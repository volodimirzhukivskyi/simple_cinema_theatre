import { prices, transactions } from './constants.js';
import { showForm, submitBuyForm } from './listeners.js';
import { deleteTransaction } from './functions/deleteTransaction.js';
window.addEventListener('DOMContentLoaded', () => {
  //! При запуску рендериться початковий масив.
  render();
});

export function buyTicket(row, place, clientName) {
  // Покупка квитка.

  transactions.push({
    type: 'purchase',
    sum: prices[row],
    row,
    place,
    clientName,
  });

  render();
}

function returnTicket(row, place) {
  // const foundTransactions = transactions.filter((transaction) => {
  //   if (transaction.row === row && transaction.place === place) {
  //     return true;
  //   }

  //   return false;
  // });
  let findIndex;
  const findTransaction = transactions.find((transaction, i) => {
    if (transaction.row === row && transaction.place === place) {
      findIndex = i;
      return true;
    }

    return false;
  });
  // const findTransaction = foundTransactions.pop();

  if (!findTransaction) {
    alert('Error ...');
    return;
  }
  findTransaction.isDelete = true;
  transactions.splice(findIndex, 1, findTransaction);

  if (findTransaction.type === 'refund') {
    alert('Error ... refund');
    return;
  }

  transactions.push({
    type: 'refund',
    sum: findTransaction.sum * 0.5,
    row: findTransaction.row,
    place: findTransaction.place,
    clientName: findTransaction.clientName,
    purchaseTransaction: findTransaction,
  });

  render();
}

function calcTotalSum() {
  let sumPurchase = 0;
  let sumReturn = 0;
  let returnDelta = 0;

  transactions.forEach((transaction) => {
    if (transaction.type === 'purchase') {
      sumPurchase += transaction.sum;
    }
    if (transaction.type === 'refund') {
      sumReturn += transaction.sum;

      returnDelta += transaction.purchaseTransaction.sum - transaction.sum;
    }
  });

  const total = sumPurchase - sumReturn;

  return {
    total: total,
    returnDelta: returnDelta,
  };
}

function getPlaces() {
  const places = [
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
  ];

  transactions.forEach((transaction) => {
    if (transaction.type === 'purchase') {
      places[transaction.row][transaction.place] = true;
    }

    if (transaction.type === 'refund') {
      places[transaction.row][transaction.place] = false;
    }
  });

  return places;
}

function getBusyPlaces(places) {
  let busy = 0;
  places.forEach((row) => {
    row.forEach((place) => {
      if (place) {
        busy += 1;
      }
    });
  });

  return busy;
}

function printPlaces(places) {
  const screen_layout = document.getElementById('screen_layout');

  screen_layout.innerHTML = '';

  places.forEach((row, rowIndex) => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row_elem';
    row.forEach((place, placeIndex) => {
      const placeDiv = document.createElement('div');
      placeDiv.className = 'place_elem';
      placeDiv.insertAdjacentHTML(
        'beforeend',
        `
      <div class="hover-block">
      <h3 class="title">ROW ${rowIndex + 1}</h3>
      <h3 class="title">SEAT ${placeIndex + 1}</h3>
      <p class="price">$${prices[rowIndex]}</p>
    </div>
      `
      );
      placeDiv.onclick = () => {
        if (!place) {
          document.querySelector('.focus')?.classList.remove('focus');
          document.getElementById('buyBtn').disabled = false;
          placeDiv.classList.add('focus');

          document.getElementById('place').value = placeIndex;
          document.getElementById('row').value = rowIndex;
        } else {
          document.querySelector('.focus')?.classList.remove('focus');
          document.getElementById('buyBtn').disabled = true;
        }
      };

      if (place) {
        placeDiv.style.backgroundColor = 'grey';
        placeDiv.onclick = returnTicket;
      }
      rowDiv.append(placeDiv);
      screen_layout.append(rowDiv);
    });
  });
}

function render() {
  const total = calcTotalSum();
  const numberOfBusyPlaces = getBusyPlaces(getPlaces());

  printPlaces(getPlaces());

  document.getElementById('number_of_seats').innerText = numberOfBusyPlaces;
  document.getElementById('total_sum').innerText = total.total + ' UAH';
  document.getElementById('return_sum').innerText = total.returnDelta + ' UAH';

  console.log('transactions', transactions);

  console.log('render');

  const tbodyElem = document.querySelector('.log tbody');

  tbodyElem.innerHTML = '';

  transactions.forEach((transaction) => {
    //! рендер правої таблиці.
    if (transaction.type === 'refund'||transaction.isDelete) return;
    //! пропуск всіх транзакцій з refund.

    const elem = document.createElement('tr');

    const row = document.createElement('td');
    row.innerText = +transaction.row + 1;
    elem.append(row);

    const place = document.createElement('td');
    place.innerText = transaction.place;
    elem.append(place);

    const clientName = document.createElement('td');
    clientName.innerText = transaction.clientName;
    elem.append(clientName);

    const deleteBtn = document.createElement('td');
    const btn = document.createElement('button');
    btn.innerText = 'Refund';
    btn.onclick = function () {
      returnTicket(transaction.row, transaction.place);
      console.log(this.closest('tr'));
      this.closest('tr').remove();
      render();
    };
    deleteBtn.append(btn);
    elem.append(deleteBtn);
    tbodyElem.append(elem);
  });
}

function success() {
  alert('Success');
}
showForm();
submitBuyForm();

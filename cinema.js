window.addEventListener('DOMContentLoaded', () => {
  //! При запуску рендериться початковий масив.
  render();
});
//! Масив транзакцій
const transactions = [
  {
    type: 'purchase',
    sum: 100,
    row: 0,
    place: 1,
    clientName: 'Ivan',
  },
  {
    type: 'purchase',
    sum: 100,
    row: 0,
    place: 2,
    clientName: 'Anna',
  },
];
//!

const prices = [50, 100, 100, 400, 500];
//! Масив цін

function buyTicket(row, place, clientName) {
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
  const foundTransactions = transactions.filter((transaction) => {
    if (transaction.row === row && transaction.place === place) {
      return true;
    }

    return false;
  });

  const lastTransaction = foundTransactions.pop();

  if (!lastTransaction) {
    alert('Error ...');
    return;
  }

  if (lastTransaction.type === 'refund') {
    alert('Error ... refund');
    return;
  }

  transactions.push({
    type: 'refund',
    sum: lastTransaction.sum * 0.5,
    row: lastTransaction.row,
    place: lastTransaction.place,
    clientName: lastTransaction.clientName,
    purchaseTransaction: lastTransaction,
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
      placeDiv.insertAdjacentHTML('beforeend', `
      <div class="hover-block">
      <h3 class="title">ROW ${rowIndex + 1}</h3>
      <h3 class="title">SEAT ${placeIndex+1}</h3>
      <p class="price">$${prices[rowIndex]}</p>
    </div>
      `)
      placeDiv.onclick = () => {
        if (!place) {
          document.querySelector('.focus')?.classList.remove('focus');
          document.getElementById('modal-form').style.display = 'block';
          placeDiv.classList.add('focus');

          document.getElementById('place').value = placeIndex;
          document.getElementById('row').value = rowIndex;
        }else{
            document.querySelector('.focus')?.classList.remove('focus');
          document.getElementById('modal-form').style.display = 'none';
        }
      };

      if (place) {
        placeDiv.style.backgroundColor = 'red';
      }

      rowDiv.append(placeDiv);
    });
    screen_layout.append(rowDiv);
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

    const elem = document.createElement('tr');

    const row = document.createElement('td');
    row.innerText = +transaction.row+1;
    elem.append(row);

    const place = document.createElement('td');
    place.innerText = transaction.place;
    elem.append(place);

    const clientName = document.createElement('td');
    clientName.innerText = transaction.clientName;
    elem.append(clientName);

    tbodyElem.append(elem);
  });
}

function success() {
  alert('Success');
}

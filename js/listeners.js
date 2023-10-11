import { buyTicket } from './cinema.js';

export function showForm() {
  const buyBtn = document.getElementById('buyBtn');
  const modalBuy = document.getElementById('modal-form');

  if (buyBtn) {
    buyBtn.onclick = function () {
      modalBuy.style.display = 'block';
      buyBtn.disabled = true;
    };
  }
}
export function submitBuyForm() {
  const form = document.getElementById('buy_form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log(this);
    const name = document.getElementById('name').value;
    const row = document.getElementById('row').value;
    const place = document.getElementById('place').value;

    buyTicket(row, place, name);
    form.reset();
    document.getElementById('modal-form').style.display = 'none';
  });
}

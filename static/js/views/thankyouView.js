class ThankyouView {
  _parentElement = document.querySelector(".thankyou");

  render(name, data) {
    const markup = this._generateMarkup(name, data);
    this._parentElement.insertAdjacentHTML("beforeend", markup);
  }

  _generateMarkup(name, data) {
    return `
      <h1 class="thankyou__header">付款成功，感謝您的訂購。</h1>
      <p class="thankyou__description">
      ${name} 您好，您的行程預定成功，以下是您的訂單資訊
      </p>
      <table class="thankyou__table">
        <tr>
          <th>訂單編號</th>
          <td>${data.number}</td>
        </tr>
        <tr>
          <th>行程名稱</th>
          <td>${data.trip.attraction.name}</td>
        </tr>
        <tr>
          <th>訂單金額</th>
          <td>${data.price}元</td>
        </tr>
        <tr>
          <th>付款方式</th>
          <td>信用卡</td>
        </tr>
      </table>
      <div class="thankyou__btn">
        <a class="btn" href="/">返回首頁</a>
        <a class="btn btn--outline" href="#">查詢歷史訂單</a>
      </div>
    `;
  }

  removeLoadingMessage() {
    document.querySelector(".loader").style.display = "none";
  }

  clear() {
    this._parentElement.innerHTML = "";
  }

  renderError(err) {
    const markup = `
      <section class="section-profile">
        <div class="error">
          <svg xmlns="http://www.w3.org/2000/svg" class="error__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="error__message">${err}</p>
        </div>
      </section>`;
    this.clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}

export default new ThankyouView();

import View from "./View.js";

class ThankyouView extends View {
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
          <td>新台幣 ${data.price} 元</td>
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
}

export default new ThankyouView();

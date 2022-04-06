import View from "./View.js";

class BookingView extends View {
  _parentElement = document.querySelector(".booking");

  render(name, data) {
    const markup = this._generateMarkup(name, data);
    this._parentElement.insertAdjacentHTML("beforeend", markup);
  }

  _generateMarkup(name, data) {
    if (!data)
      return `
    <h2 class="booking-header">您好，${name}，待預訂的行程如下：</h2>
    <p class="booking-message">目前沒有任何待預訂的行程</p>`;

    return `
    <h2 class="booking-header">您好，${name}，待預訂的行程如下：</h2>
    <section class="section-cart booking-container">
      <div class="products">
        <div class="product grid">
          <a href="/attraction/${data.attraction.id}">
            <img src="${data.attraction.image}" alt="Attraction photo" />
          </a>
          <div class="product__content">
            <a class="product__title" href="/attraction/${
              data.attraction.id
            }">台北一日遊：${data.attraction.name}</a>
            <dl class="product__infos">
              <div class="product__info">
                <dt>日期：</dt>
                <dd>${data.date}</dd>
              </div>
              <div class="product__info">
                <dt>時間：</dt>
                <dd>${
                  data.time === "morning"
                    ? "早上 8 點到下午 2 點"
                    : "下午 2 點到晚上 8 點"
                }</dd>
              </div>
              <div class="product__info">
                <dt>費用：</dt>
                <dd>新台幣 ${data.price} 元</dd>
              </div>
              <div class="product__info">
                <dt>地點：</dt>
                <dd>${data.attraction.address}</dd>
              </div>
            </dl>
            <button class="btn delete__btn">
              <img
                src="../static/img/icon/delete.svg"
                class="delete__icon"
                alt="Delete icon"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
    <hr class="horizontal-line" />
    <form class="form-reservation">
      <section class="section-contact booking-container">
        <h3 class="contact__header">您的聯絡資訊</h3>
        <div class="contact__field">
          <label for="contact__name"
            >聯絡姓名：
            <input type="text" id="contact__name" required />
          </label>
          <label for="contact__email"
            >連絡信箱：
            <input type="email" id="contact__email" required />
          </label>
          <label for="contact__phone"
            >手機號碼：
            <input type="tel" id="contact__phone" pattern="[0-9]*" required />
          </label>
          <p class="contact__notice">
            請保持手機暢通，準時到達，導覽人員將用手機與您聯繫，務必留下正確的聯絡方式。
          </p>
        </div>
      </section>
      <hr class="horizontal-line" />
      <section class="section-payment booking-container">
        <h3 class="payment__header">信用卡付款資訊</h3>
        <div class="payment__field">
          <div class="form-group card-number-group">
            <label for="card-number">卡片號碼：</label>
            <div class="tpfield" id="card-number"></div>
          </div>
          <div class="form-group expiration-date-group">
            <label for="card-expiration-date">過期時間：</label>
            <div class="tpfield" id="card-expiration-date"></div>
          </div>
          <div class="form-group cvc-group">
            <label for="card-ccv">驗證密碼：</label>
            <div class="tpfield" id="card-ccv"></div>
          </div>
        </div>
      </section>
      <hr class="horizontal-line" />
      <div class="checkout booking-container">
        <p class="checkout__amount">總價：新台幣 ${data.price} 元</p>
        <button class="btn checkout__btn" type="submit" disabled="true">確認訂購並付款</button>
      </div>
    </form>
    `;
  }

  renderNavBookingBtn(user) {
    let markup;
    if (!user) {
      markup = `<a class="nav__link btn--booking btn--show-signin">預定行程</a>`;
    } else {
      markup = `<a class="nav__link btn--booking" href="/booking">預定行程</a>`;
    }

    document
      .querySelector("[data-cart]")
      .insertAdjacentHTML("afterbegin", markup);
  }

  addHandlerDeleteBooking(handler) {
    document.querySelector(".delete__btn").addEventListener("click", handler);
  }

  addHandlerFormSubmit(handler) {
    document
      .querySelector(".form-reservation")
      .addEventListener("submit", handler);
  }

  addHandlerTappayFields(handler) {
    TPDirect.card.onUpdate(handler);
  }

  setNumberFormGroupToError(el) {
    const selector = document.querySelector(el);
    selector.classList.add("has-error");
    selector.classList.remove("has-success");
  }

  setNumberFormGroupToSuccess(el) {
    const selector = document.querySelector(el);
    selector.classList.remove("has-error");
    selector.classList.add("has-success");
  }

  setNumberFormGroupToNormal(el) {
    const selector = document.querySelector(el);
    selector.classList.remove("has-error");
    selector.classList.remove("has-success");
  }
}

export default new BookingView();

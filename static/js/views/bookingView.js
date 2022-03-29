class BookingView {
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
          <label for="contact__mobile"
            >手機號碼：
            <input type="tel" id="contact__mobile" pattern="[0-9]*" required />
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
          <label for="card-number"
            >卡片號碼：
            <input
              id="card-number"
              type="text"
              pattern="[0-9]*"
              inputmode="numeric"
              placeholder="**** **** **** ****"
              autocomplete="off"
              required
            />
          </label>
          <label for="expiration-date"
            >過期時間：
            <input
              id="expiration-date"
              type="text"
              pattern="(0?[1-9]|1[0-2])\\/(\\d{2})"
              placeholder="MM / YY"
              autocomplete="off"
              required
            />
          </label>
          <label for="security-code"
            >驗證密碼：
            <input
              id="security-code"
              type="text"
              pattern="[0-9]{3}"
              inputmode="numeric"
              placeholder="CVV"
              autocomplete="off"
              required
            />
          </label>
        </div>
      </section>
      <hr class="horizontal-line" />
      <div class="checkout booking-container">
        <p class="checkout__amount">總價：新台幣 ${data.price} 元</p>
        <button class="btn checkout__btn">確認訂購並付款</button>
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

export default new BookingView();

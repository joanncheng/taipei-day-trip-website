import { TRIP_PRICE_AM, TRIP_PRICE_PM } from "../config.js";

class AttractionView {
  _parentElement = document.querySelector(".attraction-profile");

  render(data) {
    const markup = this._generateMarkup(data);
    this._parentElement.insertAdjacentHTML("beforeend", markup);
  }

  _generateImagesMarkup(data) {
    const markup = data.images.map((image, i) => {
      return `
      <li class="slide" ${i === 0 ? "data-active" : ""}>
        <img src="${image}" alt="${data.name} photo#${i + 1}" />
      </li>
    `;
    });
    return markup.join("");
  }

  _generateDotMarkup(count) {
    const markup = [];
    for (let i = 0; i < count; i++) {
      markup.push(
        `<div class="dot slider__dot ${
          i === 0 ? "slider__dot--active" : ""
        }" data-slide="${i}"></div>`
      );
    }

    return markup.join("");
  }

  _generateMarkup(data) {
    return `
      <section class="section-profile">
        <div class="slider">
          <ul class="slides">
            ${this._generateImagesMarkup(data)}
          </ul>
          <button class="btn slider__btn slider__btn--left" data-slider-btn="left">
            <img
              src="../static/img/Button/left arrow.svg"
              class="left__icon"
              alt="Left arrow icon"
              data-slider-btn="left"
            />
          </button>
          <button class="btn slider__btn slider__btn--right" data-slider-btn="right">
            <img
              src="../static/img/Button/right arrow.svg"
              class="left__icon"
              alt="Right arrow icon"
              data-slider-btn="right"
            />
          </button>
          <div class="slider__dots">
            ${this._generateDotMarkup(data.images.length)}
          </div>
        </div>
        <div class="profile">
          <h1 class="profile__header">${data.name}</h1>
          <p class="profile__description">${data.category} at ${data.mrt}</p>
          <form class="form-booking">
            <h3 class="booking__header">訂購導覽行程</h3>
            <p class="booking__description">
              以此景點為中心的一日行程，帶您探索城市角落故事
            </p>
            <div class="form__item">
              <label for="booking__date">選擇日期：</label>
              <input type="date" id="booking__date" class="booking__date"
              required />
            </div>
            <div class="form__item">
              <label>選擇時間：</label>
              <div class="booking__time">
                <label class="radio-container" for="booking__time--am">
                  <input
                    type="radio"
                    id="booking__time--am"
                    class="booking__radio booking__time--am"
                    name="time"
                    value="morning"
                    required
                    checked
                  />
                  上半天
                </label>

                <label class="radio-container" for="booking__time--pm">
                  <input
                    type="radio"
                    id="booking__time--pm"
                    class="booking__radio booking__time--pm"
                    name="time"
                    value="afternoon"
                    required
                  />
                  下半天
                </label>
              </div>
            </div>
            <div class="form__item">
              <label>導覽費用：</label>
              <p class="booking__price">新台幣 <span>${TRIP_PRICE_AM}</span> 元</p>
            </div>
            <button class="btn booking__btn">開始預定行程</button>
            <div class="booking__message"></div>
          </form>
        </div>
      </section>
      <hr class="horizontal-line" />
      <section class="section-infos grid grid--1-cols">
        <p class="info__description">
          ${data.description}
        </p>
        <div class="info__item">
          <h4 class="info__title">景點地址：</h4>
          <p>${data.address}</p>
        </div>
        <div class="info__item">
          <h4 class="info__title">交通方式：</h4>
          <p>
            ${data.transport}
          </p>
        </div>
      </section>
  `;
  }

  addHandlerSlide(handler) {
    const btns = document.querySelectorAll(".slider__btn");

    btns.forEach((btn) => btn.addEventListener("click", handler));
  }

  addHandlerSlideDot(handler) {
    document.querySelector(".slider__dots").addEventListener("click", handler);
  }

  addHandlerChangePrice(handler) {
    document
      .querySelector(".booking__time")
      .addEventListener("change", handler);
  }

  addHandlerBooking(handler) {
    document.querySelector(".booking__btn").addEventListener("click", handler);
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

  removeLoadingMessage() {
    document.querySelector(".loader").style.display = "none";
  }

  renderMessage(msg, time = 2) {
    const msgContainer = document.querySelector(".booking__message");

    const markup = `<span>${msg}</span>`;

    msgContainer.innerHTML = markup;
    setTimeout(() => {
      msgContainer.innerHTML = "";
    }, time * 1000);
  }
}

export default new AttractionView();

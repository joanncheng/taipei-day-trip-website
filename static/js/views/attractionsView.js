import View from "./View.js";

class AttractionsView extends View {
  _parentElement = document.querySelector(".attractions-container");
  _subLoader = document.querySelector(".sub-loader");
  isLoading = true;

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      this.hideLoading();
      this.removeLoadingMessage();
      this.renderError("查無景點");
      return;
    }
    data.forEach((el) => {
      const markup = this._generateMarkup(el);
      this._parentElement.insertAdjacentHTML("beforeend", markup);
    });
    this.isLoading = false;
  }

  _generateMarkup(el) {
    return `
    <a href="/attraction/${el.id}">
      <div class="attraction grid grid--1-col" data-id="${el.id}">
        <div class="attraction__img-box">
          <img
          src="${el.images[0]}"
          class="attraction__img"
          alt="${el.name}"
          
          />
        </div>      
        <div class="attraction__content">
          <p class="attraction__title">${el.name}</p>
          <ul class="attraction__attributes">
            <li class="attraction__attribute">${el.mrt}</li>
            <li class="attraction__attribute">${el.category}</li>
          </ul>
        </div>
      </div>
    </a>
  `;
  }

  addHandlerRender(handler) {
    const footer = document.querySelector(".footer");
    const footerObserver = new IntersectionObserver(handler, {
      root: null,
      threshold: 0,
    });
    footerObserver.observe(footer);
  }

  addHandlerShowPagetopBtn(handler) {
    window.onscroll = handler;
  }

  addHandlerGoToPagetop(handler) {
    document.querySelector(".pagetop").addEventListener("click", handler);
  }

  showLoading() {
    this._subLoader.classList.add("show");
  }

  hideLoading() {
    this._subLoader.classList.remove("show");
  }

  removeLoading() {
    this._subLoader.style.display = "none";
  }
}

export default new AttractionsView();

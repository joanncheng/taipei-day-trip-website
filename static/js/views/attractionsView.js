class AttractionsView {
  _parentElement = document.querySelector(".attractions-container");
  _subLoader = document.querySelector(".sub-loader");
  isLoading = true;

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
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

  clear() {
    this._parentElement.innerHTML = "";
  }

  renderError(msg = "查無景點") {
    const markup = `
        <div class="error">
          <svg xmlns="http://www.w3.org/2000/svg" class="error__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="error__message">${msg}</p>
        </div>`;
    this.clear();
    this.hideLoading();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
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

  removeLoadingMessage() {
    document.querySelector(".loader").style.display = "none";
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

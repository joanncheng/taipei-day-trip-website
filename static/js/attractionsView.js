class AttractionsView {
  _parentElement = document.querySelector(".attractions-container");
  isLoading = true;

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this.hideLoading();
    data.forEach((el) => {
      const markup = this._generateMarkup(el);
      this._parentElement.insertAdjacentHTML("beforeend", markup);
    });
    this.isLoading = false;
  }

  _generateMarkup(el) {
    return `
    <div class="attraction">
      <img
        src="${el.images[0]}"
        class="attraction__img"
        alt="${el.name}"
      />
      <div class="attraction__content">
        <p class="attraction__title">${el.name}</p>
        <ul class="attraction__attributes">
          <li class="attraction__attribute">${el.mrt}</li>
          <li class="attraction__attribute">${el.category}</li>
        </ul>
      </div>
    </div>
  `;
  }

  clear() {
    this._parentElement.innerHTML = "";
  }

  renderError(msg = "查無景點") {
    const markup = `
        <div class="error">
          <ion-icon name="alert" class="error__icon"></ion-icon>
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

  showLoading() {
    document.querySelector(".loading").classList.add("show");
  }

  hideLoading() {
    document.querySelector(".loading").classList.remove("show");
  }
}

export default new AttractionsView();

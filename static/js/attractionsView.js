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
      <div class="attraction" data-id="${el.id}">
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

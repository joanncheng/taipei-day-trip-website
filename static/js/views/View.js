export default class View {
  clear() {
    this._parentElement.innerHTML = "";
  }

  removeLoadingMessage() {
    document.querySelector(".loader").style.display = "none";
  }

  showLoadingMessage() {
    document.querySelector(".loader").style.display = "block";
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

  _hideAlert() {
    const el = document.querySelector(".alert");
    if (el) el.parentElement.removeChild(el);
  }

  // type is 'success' or 'error'
  showAlert(type, msg, time = 5) {
    this._hideAlert();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
    window.setTimeout(this._hideAlert, time * 1000);
  }
}

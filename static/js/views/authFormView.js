import View from "./View.js";

class AuthFormView extends View {
  renderMessage(status, form) {
    const msgContainer = document.querySelector(`.form-${form} > div`);

    let msg;
    if (status.error) {
      msg = status.message;
      msgContainer.classList.add("has-error");
    } else {
      msg = form === "signup" ? "註冊成功" : "登入成功";
      msgContainer.classList.remove("has-error");
    }

    const markup = `
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="message__icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
          <path stroke-linecap="round" stroke-linejoin="round" 
          ${
            status.error
              ? `d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>`
              : `d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />`
          }
          </svg>
          <p>${msg}</p>`;

    msgContainer.innerHTML = "";
    msgContainer.insertAdjacentHTML("afterbegin", markup);
  }

  renderAuthBtn(user) {
    let markup;
    if (user) {
      markup = `<a class="nav__link nav__link-btn btn--logout" href="#">登出系統</a>`;
    } else {
      markup = `<a
      class="nav__link nav__link-btn btn--signin btn--show-signin"
      href="#"
      >登入&sol;註冊</a
      >`;
    }
    document
      .querySelector("[data-auth]")
      .insertAdjacentHTML("afterbegin", markup);
  }

  addHandlerLogin(handler) {
    document.querySelector(".form-signin").addEventListener("submit", handler);
  }

  addHandlerSignup(handler) {
    document.querySelector(".form-signup").addEventListener("submit", handler);
  }

  addHandlerLogout(handler) {
    document.querySelector(".btn--logout").addEventListener("click", handler);
  }
}

export default new AuthFormView();

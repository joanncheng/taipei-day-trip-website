const modals = document.querySelectorAll(".popup");
const signinModal = document.querySelector(".signin");
const overlay = document.querySelector(".overlay");
const signupModal = document.querySelector(".signup");

class ModalView {
  _showSigninModal() {
    signinModal.querySelector(".form__message").innerHTML = "";
    signinModal.classList.remove("hidden");
    overlay.classList.remove("hidden");

    signupModal.classList.add("hidden");
  }

  _showSignupModal() {
    signupModal.querySelector(".form__message").innerHTML = "";
    signupModal.classList.remove("hidden");
    overlay.classList.remove("hidden");
  }

  _closeModal() {
    modals.forEach((modal) => {
      modal.classList.add("hidden");
    });
    overlay.classList.add("hidden");
  }

  showModal() {
    // Show sign in form
    document.querySelectorAll(".btn--show-signin").forEach((btn) => {
      btn.addEventListener("click", this._showSigninModal);
    });

    // Show sign up form
    document
      .querySelector(".btn--show-signup")
      .addEventListener("click", this._showSignupModal);

    // Close modal
    document.querySelectorAll(".btn--close-modal").forEach((btn) => {
      btn.addEventListener("click", this._closeModal);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this._closeModal();
    });
    overlay.addEventListener("click", this._closeModal);
  }
}

export default new ModalView();

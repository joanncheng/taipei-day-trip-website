const modals = document.querySelectorAll(".popup");
const signinModal = document.querySelector(".signin");
const overlay = document.querySelector(".overlay");
const signupModal = document.querySelector(".signup");
const btnsOpenSigninModal = document.querySelectorAll(".btn--show-signin");
const btnOpenSignupModal = document.querySelector(".btn--show-signup");
const btnsCloseModal = document.querySelectorAll(".btn--close-modal");

class ModalView {
  showSigninModal() {
    signinModal.classList.remove("hidden");
    overlay.classList.remove("hidden");

    signupModal.classList.add("hidden");
  }

  showSignupModal() {
    signupModal.classList.remove("hidden");
    overlay.classList.remove("hidden");
  }

  closeModal() {
    modals.forEach((modal) => {
      modal.classList.add("hidden");
    });
    overlay.classList.add("hidden");
  }

  handleShowSigninModal = () => {
    btnsOpenSigninModal.forEach((btn) => {
      btn.addEventListener("click", this.showSigninModal);
    });
  };

  handleShowSignupModal = () => {
    btnOpenSignupModal.addEventListener("click", this.showSignupModal);
  };

  handleCloseModal() {
    btnsCloseModal.forEach((btn) => {
      btn.addEventListener("click", this.closeModal);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closeModal();
    });
  }
}

export default new ModalView();

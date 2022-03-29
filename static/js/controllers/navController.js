import * as model from "../model.js";
import modalView from "../views/modalView.js";
import authFormView from "../views/authFormView.js";
import bookingView from "../views/bookingView.js";

const controlSignup = async (e) => {
  try {
    e.preventDefault();
    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    await model.signup(name, email, password);
    authFormView.renderMessage(model.state.status, "signup");
    if (model.state.status.ok) {
      window.setTimeout(() => {
        location.reload(true);
      }, 1000);
    }
    document
      .querySelectorAll(".form-signup input")
      .forEach((el) => (el.value = ""));
  } catch (err) {
    authFormView.showAlert("error", "註冊失敗，伺服器內部錯誤，請稍後再試");
    console.error(err);
  }
};

const controlLogin = async (e) => {
  try {
    e.preventDefault();

    const email = document.getElementById("signin-email").value;
    const password = document.getElementById("signin-password").value;

    await model.login(email, password);
    authFormView.renderMessage(model.state.status, "signin");
    if (model.state.status.ok) {
      window.setTimeout(() => {
        location.reload(true);
      }, 1000);
    }

    document
      .querySelectorAll(".form-signin input")
      .forEach((el) => (el.value = ""));
  } catch (err) {
    authFormView.showAlert("error", "登入失敗，伺服器內部錯誤，請稍後再試");
    console.error(err);
  }
};

const controlLogout = async () => {
  try {
    await model.logout();
    if (model.state.status.ok) location.reload(true);
  } catch (err) {
    authFormView.showAlert("error", "登出失敗，伺服器內部錯誤，請稍後再試");
    console.error(err);
  }
};

const init = async () => {
  try {
    authFormView.renderAuthBtn(model.state.user);
    bookingView.renderNavBookingBtn(model.state.user);

    if (model.state.user) {
      authFormView.addHandlerLogout(controlLogout);
    } else {
      modalView.showModal();
      authFormView.addHandlerSignup(controlSignup);
      authFormView.addHandlerLogin(controlLogin);
    }
  } catch (err) {
    authFormView.showAlert("error", "伺服器內部錯誤，請稍後再試");
    console.error(err);
  }
};

init();

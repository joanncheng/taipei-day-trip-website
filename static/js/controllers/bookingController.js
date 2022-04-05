import * as model from "../model.js";
import bookingView from "../views/bookingView.js";
import navBar from "./navController.js";
import { TPAPP_ID, TPAPP_KEY, TPAPP_ENV } from "../config.js";

const showBooking = async () => {
  try {
    await model.loadBooking();
    bookingView.removeLoadingMessage();
    bookingView.render(model.state.user.name, model.state.booking);
  } catch (err) {
    throw err;
  }
};

const controlDeleteBooking = async () => {
  try {
    await model.deleteBooking();
    location.reload(true);
  } catch (err) {
    throw err;
  }
};

const tappaySetup = () => {
  TPDirect.setupSDK(TPAPP_ID, TPAPP_KEY, TPAPP_ENV);
  const fields = {
    number: {
      // css selector
      element: "#card-number",
      placeholder: "**** **** **** ****",
    },
    expirationDate: {
      // DOM object
      element: document.getElementById("card-expiration-date"),
      placeholder: "MM / YY",
    },
    ccv: {
      element: "#card-ccv",
      placeholder: "CVV",
    },
  };

  TPDirect.card.setup({
    fields,
    styles: {
      input: {
        "font-size": "16px",
      },
      ":focus": {
        color: "black",
      },
      ".valid": {
        color: "#46b171",
      },
      ".invalid": {
        color: "#eb4d4b",
      },
    },
  });
};

const controlTappayFields = (update) => {
  const submitBtn = document.querySelector(".checkout__btn");

  if (update.canGetPrime) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", true);
  }

  // Change form-group style when tappay field status change
  if (update.status.number === 2) {
    bookingView.setNumberFormGroupToError(".card-number-group");
  } else if (update.status.number === 0) {
    bookingView.setNumberFormGroupToSuccess(".card-number-group");
  } else {
    bookingView.setNumberFormGroupToNormal(".card-number-group");
  }

  if (update.status.expiry === 2) {
    bookingView.setNumberFormGroupToError(".expiration-date-group");
  } else if (update.status.expiry === 0) {
    bookingView.setNumberFormGroupToSuccess(".expiration-date-group");
  } else {
    bookingView.setNumberFormGroupToNormal(".expiration-date-group");
  }

  if (update.status.cvc === 2) {
    bookingView.setNumberFormGroupToError(".cvc-group");
  } else if (update.status.cvc === 0) {
    bookingView.setNumberFormGroupToSuccess(".cvc-group");
  } else {
    bookingView.setNumberFormGroupToNormal(".cvc-group");
  }
};

const controlSubmit = (e) => {
  e.preventDefault();

  document.querySelector(".checkout__btn").setAttribute("disabled", true);

  const name = document.querySelector("#contact__name").value;
  const email = document.querySelector("#contact__email").value;
  const phone = document.querySelector("#contact__phone").value;
  const tappayStatus = TPDirect.card.getTappayFieldsStatus();

  if (tappayStatus.canGetPrime === false) {
    console.error("Can not get prime");
    return;
  }

  TPDirect.card.getPrime(async (result) => {
    if (result.status !== 0) {
      bookingView.showAlert("error", `付款失敗(${result.msg})`);
      return;
    }
    const checkoutResult = await model.checkout(result.card.prime, {
      name,
      email,
      phone,
    });

    if (checkoutResult.payment.status === 0) {
      location.assign(`/thankyou?number=${checkoutResult.number}`);
    } else {
      bookingView.showAlert("error", "付款失敗");
    }
  });
};

const init = async () => {
  try {
    await navBar();

    if (!model.state.user) {
      location.assign("/");
    }

    await showBooking();
    if (model.state.booking !== null) {
      bookingView.addHandlerDeleteBooking(controlDeleteBooking);
      tappaySetup();
      bookingView.addHandlerTappayFields(controlTappayFields);
      bookingView.addHandlerFormSubmit(controlSubmit);
    }
  } catch (err) {
    console.error(err);
    bookingView.renderError("伺服器內部錯誤，請稍後再試");
  }
};

init();

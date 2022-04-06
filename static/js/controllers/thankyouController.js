import * as model from "../model.js";
import thankyouView from "../views/thankyouView.js";
import navBar from "./navController.js";

const showThankyou = async () => {
  try {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const number = urlParams.get("number");

    if (!number) {
      location.assign("/");
      return;
    }
    await model.loadOrder(number);

    if (!model.state.order) {
      location.assign("/");
      return;
    }
    thankyouView.removeLoadingMessage();
    thankyouView.render(model.state.user.name, model.state.order);
  } catch (err) {
    throw err;
  }
};

const init = async () => {
  try {
    await navBar();

    if (!model.state.user) {
      location.assign("/");
      return;
    }
    await showThankyou();
  } catch (err) {
    console.error(err);
    thankyouView.renderError("伺服器內部錯誤，請與我們聯絡確認訂單資訊");
  }
};

init();

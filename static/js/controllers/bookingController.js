import * as model from "../model.js";
import bookingView from "../views/bookingView.js";
import { loadNavScript } from "../helper.js";

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

const init = async () => {
  try {
    await model.checkLoggedIn();
    if (!model.state.user) {
      location.assign("/");
    }
    loadNavScript();

    await showBooking();
    if (model.state.booking !== null) {
      bookingView.addHandlerDeleteBooking(controlDeleteBooking);
    }
  } catch (err) {
    console.error(err);
    bookingView.renderError("伺服器內部錯誤，請稍後再試");
  }
};

init();

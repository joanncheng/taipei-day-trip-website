import * as model from "./attractionsModel.js";
import attractionsView from "./attractionsView.js";
import searchView from "./searchView.js";
import modalView from "./modalView.js";

const showAttractions = async () => {
  try {
    await model.loadAttractions(model.state.nextPage);
    attractionsView.removeLoadingMessage();
    attractionsView.render(model.state.attractions);
  } catch (err) {
    attractionsView.renderError(err);
  }
};

const controlLoadMore = async (entries, observer) => {
  try {
    const [entry] = entries;
    if (
      !entry.isIntersecting ||
      !model.state.nextPage ||
      attractionsView.isLoading
    )
      return;

    attractionsView.isLoading = true;
    attractionsView.showLoading();

    await model.loadAttractions(model.state.nextPage, model.state.query);
    attractionsView.hideLoading();

    attractionsView.render(model.state.attractions);

    if (!model.state.nextPage) {
      observer.unobserve(entry.target);
      attractionsView.removeLoading();
    }
  } catch (err) {
    attractionsView.renderError(err);
  }
};

const controlSearchResults = async () => {
  try {
    const query = searchView.getQuery();
    if (!query) return;

    await model.loadAttractions(0, query);

    attractionsView.clear();
    attractionsView.render(model.state.attractions);
    if (model.state.nextPage) {
      attractionsView.addHandlerRender(controlLoadMore);
    }
  } catch (err) {
    attractionsView.renderError(err);
  }
};

const controlPagetop = () => {
  const btnPagetop = document.querySelector(".pagetop");
  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    btnPagetop.style.display = "block";
  } else {
    btnPagetop.style.display = "none";
  }
};

const init = () => {
  showAttractions();
  attractionsView.addHandlerRender(controlLoadMore);
  attractionsView.addHandlerPagetop(controlPagetop);
  searchView.addHandlerSearch(controlSearchResults);
  modalView.handleShowSigninModal();
  modalView.handleShowSignupModal();
  modalView.handleCloseModal();
};

init();

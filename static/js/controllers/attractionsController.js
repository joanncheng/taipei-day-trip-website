import * as model from "../model.js";
import attractionsView from "../views/attractionsView.js";
import searchView from "../views/searchView.js";
import navBar from "./navController.js";

const showAttractions = async () => {
  try {
    await model.loadAttractions(model.state.nextPage);
    attractionsView.removeLoadingMessage();
    attractionsView.render(model.state.attractions);
  } catch (err) {
    throw err;
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
    attractionsView.renderError("伺服器內部錯誤，請稍後再試");
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
    attractionsView.renderError("伺服器內部錯誤，請稍後再試");
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
  attractionsView.addHandlerGoToPagetop(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
};

const init = async () => {
  try {
    await navBar();

    await showAttractions();
    attractionsView.addHandlerRender(controlLoadMore);
    attractionsView.addHandlerShowPagetopBtn(controlPagetop);
    searchView.addHandlerSearch(controlSearchResults);
  } catch (err) {
    attractionsView.renderError("伺服器內部錯誤，請稍後再試");
  }
};

init();

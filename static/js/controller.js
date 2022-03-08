import * as model from "./model.js";
import attractionsView from "./attractionsView.js";
import searchView from "./searchView.js";

// let scrollDebounce = true;

const showAttractions = async () => {
  try {
    await model.loadAttractions(model.state.nextPage);

    attractionsView.render(model.state.attractions);
  } catch (err) {
    attractionsView.renderError(err);
  }
};

const controlLoadMore = async () => {
  try {
    if (attractionsView.scrollDebounce) {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight) {
        attractionsView.scrollDebounce = false;
        attractionsView.showLoading();
        await model.loadAttractions(model.state.nextPage);
        attractionsView.render(model.state.attractions);

        if (!model.state.nextPage) {
          attractionsView.removeHandlerRender(controlLoadMore);
        }
      }
    }
  } catch (err) {
    attractionsView.renderError(err);
  }
};

const controlSearchResults = async () => {
  try {
    const query = searchView.getQuery();

    await model.loadSearchResults(query);

    attractionsView.clear();
    attractionsView.render(model.state.attractions);

    if (model.state.nextPage) {
      attractionsView.addHandlerRender(controlLoadMore);
    } else {
      attractionsView.removeHandlerRender(controlLoadMore);
    }
  } catch (err) {
    attractionsView.renderError(err);
  }
};

const init = () => {
  showAttractions();
  attractionsView.addHandlerRender(controlLoadMore);
  searchView.addHandlerSearch(controlSearchResults);
};

init();

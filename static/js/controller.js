import * as model from "./model.js";
import attractionsView from "./attractionsView.js";
import searchView from "./searchView.js";

const showAttractions = async () => {
  try {
    await model.loadAttractions(model.state.nextPage);

    attractionsView.render(model.state.attractions);
  } catch (err) {
    attractionsView.renderError(err);
  }
};

let scrollDebounce = true;

const controlLoadMore = async () => {
  try {
    if (scrollDebounce) {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight) {
        scrollDebounce = false;
        attractionsView.showLoading();
        await model.loadAttractions(model.state.nextPage);
        if (!model.state.nextPage) {
          attractionsView.removeHandlerRender(controlLoadMore);
        }

        attractionsView.render(model.state.attractions);
      }
      scrollDebounce = true;
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
    attractionsView.addHandlerRender(controlLoadMore);
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

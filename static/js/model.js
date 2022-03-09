import { API_URL } from "./config.js";
import { getJSON } from "./helper.js";

export const state = {
  nextPage: 0,
  attractions: [],
};

export const loadAttractions = async (page) => {
  try {
    const data = await getJSON(`${API_URL}/attractions?page=${page}`);

    state.nextPage = data.nextPage;
    state.attractions = data.data.map((attraction) => {
      return {
        name: attraction.name,
        category: attraction.category,
        mrt: attraction.mrt ? attraction.mrt : "無",
        images: attraction.images,
      };
    });
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async (query) => {
  try {
    const data = await getJSON(`${API_URL}/attractions?keyword=${query}`);

    state.nextPage = data.nextPage;
    state.attractions = data.data.map((attraction) => {
      return {
        name: attraction.name,
        category: attraction.category,
        mrt: attraction.mrt ? attraction.mrt : "無",
        images: attraction.images,
      };
    });
  } catch (err) {
    throw err;
  }
};

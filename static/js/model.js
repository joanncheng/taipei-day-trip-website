import { API_URL } from "./config.js";
import { getJSON } from "./helper.js";

export const state = {
  nextPage: 0,
  attractions: [],
  query: "",
};

export const loadAttractions = async (page = 0, query = "") => {
  try {
    const url = query
      ? `${API_URL}/attractions?page=${page}&keyword=${query}`
      : `${API_URL}/attractions?page=${page}`;

    const data = await getJSON(url);

    state.query = query;
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

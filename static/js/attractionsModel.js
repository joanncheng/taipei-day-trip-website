import { API_URL } from "./config.js";
import { getJSON } from "./helper.js";

export const state = {
  nextPage: 0,
  attractions: [],
  query: "",
  attraction: {},
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
        id: attraction.id,
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

export const loadAttraction = async (id) => {
  try {
    const data = await getJSON(`${API_URL}/attraction/${id}`);

    state.attraction = {
      name: data.data.name,
      category: data.data.category,
      description: data.data.description,
      address: data.data.address,
      transport: data.data.transport,
      mrt: data.data.mrt ? data.data.mrt : "無",
      images: data.data.images,
    };
  } catch (err) {
    throw err;
  }
};

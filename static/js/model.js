import { API_URL } from "./config.js";
import { fetchData } from "./helper.js";

export const state = {
  nextPage: 0,
  attractions: [],
  query: "",
  attraction: {},
  user: null,
  status: {},
  booking: null,
};

export const loadAttractions = async (page = 0, query = "") => {
  try {
    const url = query
      ? `${API_URL}/attractions?page=${page}&keyword=${query}`
      : `${API_URL}/attractions?page=${page}`;

    const res = await fetchData(url);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

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
    const res = await fetchData(`${API_URL}/attraction/${id}`);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    state.attraction = {
      id: data.data.id,
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

export const signup = async (name, email, password) => {
  try {
    const res = await fetchData(`${API_URL}/user`, {
      name,
      email,
      password,
    });
    const data = await res.json();
    state.status = data;
  } catch (err) {
    throw err;
  }
};

export const login = async (email, password) => {
  try {
    const res = await fetchData(
      `${API_URL}/user`,
      {
        email,
        password,
      },
      "PATCH"
    );
    const data = await res.json();
    state.status = data;
  } catch (err) {
    throw err;
  }
};

export const checkLoggedIn = async () => {
  try {
    const res = await fetchData(`${API_URL}/user`);
    const data = await res.json();

    state.user = data.data;
  } catch (err) {
    throw err;
  }
};

export const logout = async () => {
  try {
    const res = await fetchData(`${API_URL}/user`, {}, "DELETE");
    const data = await res.json();
    if (data.ok) state.user = null;
    state.status = data;
  } catch (err) {
    throw err;
  }
};

export const booking = async (attractionId, date, time, price) => {
  try {
    const res = await fetchData(`${API_URL}/booking`, {
      attractionId,
      date,
      time,
      price,
    });
    const data = await res.json();
    return data;
  } catch (err) {
    throw err;
  }
};

export const loadBooking = async () => {
  try {
    const res = await fetchData(`${API_URL}/booking`);
    const data = await res.json();
    state.booking = data.data;
  } catch (err) {
    throw err;
  }
};

export const deleteBooking = async () => {
  try {
    const res = await fetchData(`${API_URL}/booking`, {}, "DELETE");
    const data = await res.json();
    if (data.ok) state.booking = null;
  } catch (err) {
    throw err;
  }
};

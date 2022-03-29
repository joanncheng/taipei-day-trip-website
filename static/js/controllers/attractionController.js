import { TRIP_PRICE_AM, TRIP_PRICE_PM } from "../config.js";
import * as model from "../model.js";
import attractionView from "../views/attractionView.js";
import navBar from "./navController.js";

const showAttraction = async () => {
  try {
    const pathname = window.location.pathname;
    const id = pathname.slice(pathname.lastIndexOf("/") + 1);
    await model.loadAttraction(id);
    attractionView.removeLoadingMessage();
    attractionView.render(model.state.attraction);
  } catch (err) {
    throw err;
  }
};

const restrictBookingDate = () => {
  const availableDate = document.getElementById("booking__date");
  const minDate = new Date();
  const maxDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  availableDate.min = minDate.toLocaleDateString("en-ca");
  availableDate.max = maxDate.toLocaleDateString("en-ca");
};

const activateDot = (slide) => {
  document.querySelectorAll(".slider__dot").forEach((dot) => {
    dot.classList.remove("slider__dot--active");
  });
  document
    .querySelector(`.slider__dot[data-slide="${slide}"]`)
    .classList.add("slider__dot--active");
};

const goToSlide = (slides, activeSlide, slide) => {
  slides.children[slide].dataset.active = true;
  activeSlide !== slides.children[slide] && delete activeSlide.dataset.active;
  activateDot(slide);
};

const controlSlide = (e) => {
  const offset = e.target.dataset.sliderBtn === "right" ? 1 : -1;
  const slides = document.querySelector(".slides");
  const activeSlide = slides.querySelector("[data-active]");

  let slide = [...slides.children].indexOf(activeSlide) + offset;

  if (slide < 0) slide = slides.children.length - 1;
  if (slide >= slides.children.length) slide = 0;
  goToSlide(slides, activeSlide, slide);
};

const controlSlideDot = (e) => {
  if (e.target.classList.contains("slider__dot")) {
    const { slide } = e.target.dataset;
    const slides = document.querySelector(".slides");
    const activeSlide = slides.querySelector("[data-active]");
    goToSlide(slides, activeSlide, slide);
  }
};

const controlPrice = (e) => {
  const price = document.querySelector(".booking__price > span");

  if (e.target.classList.contains("booking__time--am")) {
    price.innerHTML = TRIP_PRICE_AM;
  }

  if (e.target.classList.contains("booking__time--pm")) {
    price.innerHTML = TRIP_PRICE_PM;
  }
};

const controlBookingBtn = async (e) => {
  try {
    e.preventDefault();
    if (!model.state.user) {
      document.querySelector(".signin").classList.remove("hidden");
      document.querySelector(".overlay").classList.remove("hidden");
    } else {
      const attractionId = model.state.attraction.id;
      const date = document.getElementById("booking__date").value;
      const time = document.querySelector('input[name="time"]:checked').value;
      const price = time === "afternoon" ? TRIP_PRICE_PM : TRIP_PRICE_AM;

      if (!date || new Date() > new Date(date)) {
        attractionView.renderMessage("請選擇有效的日期");
        return;
      }
      const booked = await model.booking(attractionId, date, time, price);
      if (booked.ok) location.assign("/booking");
    }
  } catch (err) {
    throw err;
  }
};

const init = async () => {
  try {
    await navBar();

    await showAttraction();
    restrictBookingDate();
    attractionView.addHandlerSlide(controlSlide);
    attractionView.addHandlerSlideDot(controlSlideDot);
    attractionView.addHandlerChangePrice(controlPrice);
    attractionView.addHandlerBooking(controlBookingBtn);
  } catch (err) {
    attractionView.renderError(err);
  }
};

init();

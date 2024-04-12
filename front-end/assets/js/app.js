import { HOME_URL } from "./config.js";
import { displayToast } from "./display.js";
import { Router } from "./classes/Router.js";
import * as auth from "./auth.js";

export const router = new Router();

const emailField = document.getElementById("mail");
const passwordField = document.getElementById("password");
const submitButton = document.getElementById("login");
const navLogin = document.getElementById("nav-login");
const navLogout = document.getElementById("nav-logout");

// Event listeners
submitButton.addEventListener("click", () => {
  let mail = emailField.value;
  let pass = passwordField.value;
  auth.login(mail, pass);
});

navLogin.addEventListener("click", (event) => {
  event.preventDefault();
  window.history.pushState("", "", HOME_URL + "login");
});

navLogout.addEventListener("click", (event) => {
  event.preventDefault();
  auth.logout();
  
  window.history.pushState("", "", HOME_URL + "login");
});

export function addDashboardListeners() {
  const homeBtn = document.getElementById("home-btn");
  const homeSection = document.getElementById("home-section");
  const promotionsBtn = document.getElementById("promotions-btn");
  const promoSection = document.getElementById("promotions-section");

  promotionsBtn.addEventListener("click", (event) => {
    event.preventDefault();
    window.history.pushState("", "", HOME_URL + "dashboard/promotions");
    promoSection.style.display = "block";
    homeSection.style.display = "none";
    setActiveNavbarItem(promotionsBtn);
  });

  homeBtn.addEventListener("click", (event) => {
    event.preventDefault();
    window.history.pushState("", "", HOME_URL + "dashboard");
    homeSection.style.display = "block";
    promoSection.style.display = "none";
    setActiveNavbarItem(homeBtn);
  });
}

function setActiveNavbarItem(item) {
  const dshbNavbar = document.getElementById("dashboard-navbar");
  dshbNavbar.querySelectorAll(".nav-link").forEach((element) => {
    element.classList.remove("active");
  });
  item.classList.add("active");
}

// Procedural code
displayToast("SIMPLON SWS", "Welcome to the website, the page has reloaded", "success");
if (auth.getToken() && !auth.isTokenExpired()) {
  auth.switchInterface(true);

} else {
  auth.switchInterface(false);
}

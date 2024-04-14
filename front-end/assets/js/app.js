import { HOME_URL } from "./config.js";
import { displayToast } from "./display.js";
import { Router } from "./classes/Router.js";
import { Dashboard } from "./classes/Dashboard.js";
import { ComponentCreator } from "./classes/ComponentCreator.js";
import * as auth from "./auth.js";

export const componentCreator = new ComponentCreator();
export const dashboard = new Dashboard();
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

// Procedural code
displayToast("SIMPLON SWS", "Welcome to the website, the page has reloaded", "success");
if (auth.getToken() && !auth.isTokenExpired()) {
  auth.switchInterface(true);

} else {
  auth.switchInterface(false);
}

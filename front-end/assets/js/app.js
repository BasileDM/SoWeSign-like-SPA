import { HOME_URL, API_URL } from "./config.js";
import { displayToast } from "./display.js";
import { Router } from "./classes/Router.js";
import { getToken, isTokenExpired } from "./auth.js";

const router = new Router();

const emailField = document.getElementById("mail");
const passwordField = document.getElementById("password");
const submitButton = document.getElementById("login");
const navLogin = document.getElementById("nav-login");

function login($mail, $pass) {
  fetch(API_URL + "login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mail: $mail,
      password: $pass,
    }),
  })
    .then((response) => {
      return response.json();
    })    
    .then((data) => {
      if (data.error) {
        displayToast("SIMPLON SWS", data.error, "error");

      } else if (data.success) {
        displayToast("SIMPLON SWS", data.success, "success");
        localStorage.setItem("token", data.token);
        router.navigateToRoute(HOME_URL + data.page);

      } else {
        displayToast("SIMPLON SWS", "Something went wrong.", "error");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Event listeners
submitButton.addEventListener("click", () => {
  let mail = emailField.value;
  let pass = passwordField.value;
  login(mail, pass);
});

navLogin.addEventListener("click", (event) => {
  event.preventDefault();
  window.history.pushState("", "", HOME_URL + "login");
});

// Procedural code
// displayToast("SIMPLON SWS", "Welcome to the website, the page has reloaded", "success");


import { HOME_URL, API_URL } from "./config.js";
import { displayToast } from "./display.js";
import { Router } from "./classes/Router.js";

window.addEventListener("DOMContentLoaded", () => {
  const router = new Router();
});

const emailField = document.getElementById("mail");
const passwordField = document.getElementById("password");
const submitButton = document.getElementById("login");
const navLogin = document.getElementById("nav-login");

function login($mail, $pass) {
  fetch(API_URL + "b", {
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
      console.log("Raw response:", response);
      return response;
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const router = new Router();
      // window.history.pushState("", "", HOME_URL + "dashboard");
      router.navigateToRoute(HOME_URL + "dashboard");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

submitButton.addEventListener("click", () => {
  let mail = emailField.value;
  let pass = passwordField.value;
  login(mail, pass);
});

navLogin.addEventListener("click", (event) => {
  event.preventDefault();
  window.history.pushState("", "", HOME_URL + "login");
});

displayToast("SIMPLON SWS", "Welcome to the website, the page has reloaded", "success");

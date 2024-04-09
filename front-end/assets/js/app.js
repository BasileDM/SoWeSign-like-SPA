import { HOME_URL, API_URL } from "./config.js";
import { displayToast } from "./display.js";

const emailField = document.getElementById("mail");
const passwordField = document.getElementById("password");
const submitButton = document.getElementById("login");

function login($mail, $pass) {
  fetch(API_URL + "a", {
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
      window.history.pushState("", "", HOME_URL + "dashboard");
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

displayToast("SIMPLON SWS", "Welcome to the website, the page has reloaded", "success");

import { HOME_URL, API_URL } from "./config.js";

const emailField = document.getElementById("mail");
const passwordField = document.getElementById("password");
const submitButton = document.getElementById("login");

submitButton.addEventListener("click", () => {
  let mail = emailField.value;
  let pass = passwordField.value;
  login(mail, pass);
});

function login($mail, $pass) {
  fetch(API_URL + "a", {
    method: "POST",
    headers: {
      "Origin": "http://brief6-sws-front",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mail: $mail,
      password: $pass,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
      } else {
        window.history.pushState("", "", HOME_URL + "dashboard");
      }
});
}
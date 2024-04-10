import { login } from "../app.js";

const submitButton = document.getElementById("login");

submitButton.addEventListener("click", () => {
  const emailField = document.getElementById("mail");
  const passwordField = document.getElementById("password");
  let mail = emailField.value;
  let pass = passwordField.value;
  login(mail, pass);
});
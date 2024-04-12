import { API_URL } from "./config.js";

const homeTabCtn = document.getElementById("nav-home");
const homeTab = document.getElementById("nav-home-tab");
const classSpinner = document.getElementById("class-spinner");
const classSpinnerText = document.getElementById("class-spinner-text");
const classContainer = document.getElementById("class-container");

export function loadClasses() {
  console.log('Fetching classes ......................');
  fetch (API_URL + "getclasses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: localStorage.getItem("token"),
    }),
  })
    .then((response) => response.json())
    .then((data) => {

      if (data.error) {
        displayToast("SIMPLON SWS", data.error, "error");

      } else if (data.success) {
        console.log(data);
        classSpinner.classList.add("visually-hidden");
        classSpinnerText.classList.add("visually-hidden");
        data.classes.forEach((classe) => {
          classContainer.innerHTML += classe;
        });
      }
    })
    .catch((error) => console.error(error));
}
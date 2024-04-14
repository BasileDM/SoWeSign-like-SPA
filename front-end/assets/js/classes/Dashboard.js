import { API_URL } from "../config.js";
import { displayToast } from "../display.js";
import { componentCreator } from "../app.js";
import * as auth from "../auth.js";

export class Dashboard {
  constructor() {
    this.isLoaded = false;
  }

  loadClasses() {
    console.log("Fetching classes ......................");
    fetch(API_URL + "getclasses", {
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
          const homeTab = document.getElementById("nav-home");
          const role = auth.decodeJwt(auth.getToken()).payload.role;

          data.todaysClasses.forEach((classe) => {
            let classComponent = componentCreator.createComponent("classes", classe, role);
            homeTab.appendChild(classComponent);
          });
        }
      })
      .catch((error) => console.error(error));
  }

  async loadDashboard() {
    fetch(API_URL + "dashboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
      }),
    })
      .then((response) => {
        console.log(`Fetching dashboard : ${response.statusText}`);
        if (!response.ok) {
          throw new Error(`Cannot load dashboard: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          this.navigateToRoute(HOME_URL);
          displayToast("SIMPLON SWS", data.error, "error");
        } else if (data.success) {
          this.isLoaded = true;
          window.history.pushState("", "", "dashboard");
          displayToast("SIMPLON SWS", data.success, "success");
          document.querySelector("#dashboard-section").innerHTML = data.dashboard;
          console.log("%c Dashboard loaded from server, now making it visible", "color: red");
          this.render("dashboard-section");
          this.loadClasses();
        } else {
          displayToast("SIMPLON SWS", "Something went wrong.", "error");
        }
      });
  }

  render(section) {
    document.querySelector(`#${section}`).style.display = "block";
  }
}

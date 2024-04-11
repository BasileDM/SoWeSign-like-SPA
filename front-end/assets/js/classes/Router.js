import { HOME_URL, API_URL } from "../config.js";
import { displayToast } from "../display.js";

export class Router {
  constructor() {
    this.isDashboardLoaded = false;
    this.dashboardHtml = "";
    this.currentSection = null;
    this.routes = {
      "/": "login-section",
      "/home": "login-section",
      "/login": "login-section",
      "/confirm": "activate-section",
      "/dashboard": "dashboard-section",
    };
    this.init();
    console.log("Router initialized");
  }

  init() {
    if (!(window.location.pathname in this.routes)) {
      window.location.pathname = HOME_URL;
      return;
    }
    this.currentSection = this.routes[window.location.pathname];

    // Event listeners
    window.addEventListener("popstate", (event) => {
      const path = event.state && event.state.path;
      this.navigateToRoute(path || window.location.pathname);
    });

    window.addEventListener("click", (event) => {
      const element = event.target;
      if (element.tagName === "A") {
        event.preventDefault();
        this.navigateToRoute(element.pathname);
      }
    });
    this.navigateToRoute(window.location.pathname);
  }

  navigateToRoute(path) {
    document.getElementById(this.currentSection).style.display = "none";
    const section = this.routes[path];
    if (section && !this.isDashboardLoaded && section === "dashboard-section") {
      this.loadDashboard().catch((error) => console.error(error));
    } else if (section) {
      this.render(section);
      window.history.pushState("", "", path);
    }
    this.currentSection = section;
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
          this.isDashboardLoaded = true;          
          window.history.pushState("", "", "dashboard");
          displayToast("SIMPLON SWS", data.success, "success");
          document.querySelector("#dashboard-section").innerHTML = data.dashboard;
          this.render("dashboard-section");

        } else {
          displayToast("SIMPLON SWS", "Something went wrong.", "error");
        }
      });
  }

  render(section) {
    document.querySelector(`#${section}`).style.display = "block";
  }
}

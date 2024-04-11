import { HOME_URL, API_URL } from "../config.js";
import { displayToast } from "../display.js";

export class Router {
  constructor() {
    this.currentSection = null;
    this.routes = {
      "/": "login-section",
      "/home": "login-section",
      "/login": "login-section",
      "/confirm": "activate-section",
      "/dashboard": "dashboard-section",
    };
    this.init();
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
    if (section && section === "dashboard-section") {
      this.loadDashboard().catch((error) => console.error(error));

    } else if (section) {
      this.render(section);
      window.history.pushState("", "", path);
    }
    this.currentSection = section;
  }

  async loadDashboard() {
    const response = await fetch(API_URL + "dashboard");
    if (!response.ok) {
      this.navigateToRoute(HOME_URL);
      throw new Error(`Cannot load dashboard: ${response.statusText}`);
    }
    let data = await response.json();
    if (data.error) {
      this.navigateToRoute(HOME_URL);
      displayToast("SIMPLON SWS", data.error, "error");

    } else if (data.success) {
      window.history.pushState("", "", "dashboard");
      displayToast("SIMPLON SWS", data.success, "success");
      document.querySelector("#dashboard-section").innerHTML = data.dashboard;
      this.render("dashboard-section");
    }
  }

  render(section) {
    document.querySelector(`#${section}`).style.display = "block";
  }
}

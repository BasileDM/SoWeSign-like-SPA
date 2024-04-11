import { HOME_URL, API_URL } from "../config.js";
import { displayToast } from "../display.js";
import { isTokenExpired } from "../auth.js";

export class Router {
  constructor() {
    this.isDashboardLoaded = false;
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
      console.log(`Init : Pathname not found : ${window.location.pathname}`);
      return;
    }
    this.currentSection = this.routes[window.location.pathname];
    console.log(`Init : Current section set to : ${this.currentSection}`);

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
    console.log(`Navigating to : ${path}, Hiding current section : ${this.currentSection}`);
    document.getElementById(this.currentSection).style.display = "none";
    const section = this.routes[path];
    console.log(`Setting nav section to : ${this.routes[path]}`);
    const token = localStorage.getItem("token");

    // Authentication dependant rerouting
    switch (section) {
      case "login-section":
        if (token && !isTokenExpired()) {
          console.log(`Rerouting from login to dashboard`);
          this.navigateToRoute(HOME_URL + "dashboard");
        }
        break;
      case "activate-section":
        if (token && !isTokenExpired()) {
          this.navigateToRoute(HOME_URL + "dashboard");
        }
        break;
      case "dashboard-section":
        if (isTokenExpired()) {
          this.navigateToRoute(HOME_URL);
        }
        break;
      default:
        console.log("Wrong section name, can't reroute");
        break;
    }

    if (!section) {
      displayToast("SIMPLON SWS", "The page you are trying to access does not exist", "error");
      return;
    }

    if (section === "dashboard-section" && !this.isDashboardLoaded) {
      this.loadDashboard().catch((error) => console.error(error));
      return;
    }

    this.render(section);
    console.log(`${section} is now visible`);
    this.currentSection = section;
    console.log(`New current section set to : ${this.currentSection}`);
    window.history.pushState("", "", path);
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
          console.log("Dashboard loaded from server, now making it visible");
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

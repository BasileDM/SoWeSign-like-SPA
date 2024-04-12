import { HOME_URL, API_URL } from "../config.js";
import { displayToast } from "../display.js";
import { isTokenExpired, getToken } from "../auth.js";

export class Router {
  constructor() {
    this.isDashboardLoaded = false;
    this.currentSection = null;
    this.routes = {
      "/": "login-section",
      "/home": "login-section",
      "/login": "login-section",
      "/logout": "logout-section",
      "/confirm": "activate-section",
      "/dashboard": "dashboard-section",
      "/dashboard/promotions": "dashboard-section",
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
    console.log(`Init : Current section set to Window pathname : ${this.currentSection}`);

    this.navigateToRoute(window.location.pathname);

    // Add Window object event listeners
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
  }

  navigateToRoute(path) {
    const section = this.routes[path];
    if (!section) {
      displayToast("SIMPLON SWS", "The page you are trying to access does not exist", "error");
      return;
    }
    console.log(`Valid section, nav section is now : ${section}`);
    document.getElementById(this.currentSection).style.display = "none";
    console.log(`Navigating to : ${path}, Hiding current section : ${this.currentSection}`);
    this.currentSection = section;
    console.log(`New current section set to : ${this.currentSection}`);

    // Authenticated user rerouting
    if (getToken()) {
      switch (section) {
        case "login-section":
          if (!isTokenExpired()) {
            console.log(`%c Rerouting from login to dashboard`, "color: orange");
            this.navigateToRoute(HOME_URL + "dashboard");
            return;
          }
          break;

        case "activate-section":
          if (!isTokenExpired()) {
            this.navigateToRoute(HOME_URL + "dashboard");
            console.log(`%c Rerouting from activate to dashboard`, "color: orange");
            return;
          }
          break;

        default:
          console.log("Token present but no reroute necessary");
          break;
      }
    }

    switch (section) {
      case "dashboard-section":
        if (!this.isDashboardLoaded) {
          console.log(`Is dahboard loaded : ${this.isDashboardLoaded}`);
          if (getToken() && !isTokenExpired()) {
            this.loadDashboard().catch((error) => console.error(error));
          } else {
            console.log(`token not found or expired`);
          }
        } else {
          this.render(section);
          console.log(`${section} is now visible`);
          window.history.pushState("", "", path);
        }
        if (isTokenExpired()) {
          this.navigateToRoute(HOME_URL);
          console.log(`%c Rerouting from dashboard to login`, "color: orange");
          return;
        }
        break;

      case "logout-section":
        console.log(`%c Rerouting from logout to login`, "color: orange");
        this.navigateToRoute(HOME_URL);
        return;

      default:
        this.render(section);
        console.log(`${section} is now visible`);
        window.history.pushState("", "", path);
        break;
    }
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
        console.log(`Fetching dashboard : ${response}`);
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
          console.log("%c Dashboard loaded from server, now making it visible", "color: red");
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

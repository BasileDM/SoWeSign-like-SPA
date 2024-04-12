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
    console.log(`Init : Current section set to Window pathname : ${this.currentSection}`);

    this.navigateToRoute(window.location.pathname);

    // Add Window object event listeners
    // window.addEventListener("popstate", (event) => {
    //   const path = event.state && event.state.path;
    //   this.navigateToRoute(path || window.location.pathname);
    // });

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
            console.log(`Rerouting from login to dashboard`);
            this.navigateToRoute(HOME_URL + "dashboard");
            return;
          }
          break;

        case "activate-section":
          if (!isTokenExpired()) {
            this.navigateToRoute(HOME_URL + "dashboard");
            console.log(`Rerouting from activate to dashboard`);
            return;
          };
          break;

        case "dashboard-section":
          if (isTokenExpired()) {
            this.navigateToRoute(HOME_URL);
            console.log(`Rerouting from dashboard to login`);
            return;
          }
          break;
        default:
          console.log("Wrong section name, can't reroute");
          break;
      }
    }

    if (section === "dashboard-section" && !this.isDashboardLoaded) {
      if (getToken() && !isTokenExpired()) this.loadDashboard().catch((error) => console.error(error));
      return;
    }

    this.render(section);
    console.log(`${section} is now visible`);
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

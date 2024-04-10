import { HOME_URL, API_URL } from "../config.js";

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
    console.log(`router initialized`);
    console.log(`window location pathname : ${window.location.pathname}`);
    if (!(window.location.pathname in this.routes)) {
      window.location.pathname = HOME_URL;
      return;
    }
    this.currentSection = this.routes[window.location.pathname];
    console.log(`current section : ${this.currentSection}`);

    // Event listeners
    window.addEventListener("popstate", (event) => {
      const path = event.state && event.state.path;
      console.log(`popstate path : ${path || window.location.pathname}`);
      this.navigateToRoute(path || window.location.pathname);
    });

    window.addEventListener("click", (event) => {
      const element = event.target;
      if (element.tagName === "A") {
        console.log(`link pathname : ${element.pathname}`);
        event.preventDefault();
        this.navigateToRoute(element.pathname);
      }
    });
    this.navigateToRoute(window.location.pathname);
  }

  navigateToRoute(path) {
    document.getElementById(this.currentSection).style.display = "none";
    console.log(`navigate to : ${path}`);
    const section = this.routes[path];
    console.log(`section ID : ${section}`);
    if (section && section === "dashboard-section") {
      this.loadDashboard().catch((error) => console.error(error));
      window.history.pushState("", "", "dashboard");
    } else if (section) {
      this.render(section);
      window.history.pushState("", "", path);
    }
    this.currentSection = section;
    console.log(`New current section : ${this.currentSection}`);
  }

  async loadDashboard() {
    console.log(`Fetching at address : ${API_URL + "dashboard"}`);
    const response = await fetch(API_URL + "dashboard");
    if (!response.ok) {
      throw new Error(`Cannot load dashboard: ${response.statusText}`);
    }
    let data = await response.json();
    document.querySelector("#dashboard-section").innerHTML = data.dashboard;
    this.render("dashboard-section");
  }

  render(section) {
    console.log(`render : ${section}`);
    document.querySelector(`#${section}`).style.display = "block";
  }
}

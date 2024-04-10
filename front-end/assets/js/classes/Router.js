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
      "/test": "test-section",
    };
    this.init();
  }

  init() {
    console.log(`router initialized`);
    console.log(`window location pathname : ${window.location.pathname}`);
    this.currentSection = this.routes[window.location.pathname];
    console.log(`current section : ${this.currentSection}`);

    window.addEventListener("popstate", (event) => {
      let path = event.state && event.state.path;
      if (path === null || path === undefined) {
        if (window.location.pathname === HOME_URL) {
          return;
        } else {
          this.navigateToRoute(HOME_URL);
        }
      } else {
        this.navigateToRoute(path);
      }
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
      this.loadDashboard(section).catch((error) => console.error(error));
      window.history.pushState("", "", "dashboard");
    } else if (section) {
      this.render(section);
      window.history.pushState("", "", path);
    }
    this.currentSection = section;
    console.log(`New current section : ${this.currentSection}`);
  }

  async loadDashboard(section) {
    let html = "";
    if (section === "dashboard-section") {
      console.log(`Fetching at address : ${API_URL + "dashboard"}`);
      const response = await fetch(API_URL + "dashboard");
      if (!response.ok) {
        throw new Error(`Cannot load ${section}: ${response.statusText}`);
      }
      html = await response.json();
      document.querySelector("#dashboard-section").innerHTML = html;
      this.render(section);
    }
  }

  render(section) {
    console.log(`render : ${section}`);
    document.querySelector(`#${section}`).style.display = "block";
  }
}

import { HOME_URL, API_URL } from "../config";

export class Router {
  constructor() {
    this.routes = {
      "/": "index.php",
      "/login": "login.html", // help
      "/confirm": "confirm.html",
      "/dashboard": " " + API_URL + " dashboard.html", // TODO : fix this
    };
    this.init();
  }

  init() {
    window.addEventListener("DOMContentLoaded", () => this.navigateToRoute(window.location.pathname));

    window.addEventListener("popstate", (event) => {
      this.navigateToRoute(event.state.path ? event.state.path : HOME_URL);
    });
  }

  navigateToRoute(path) {
    const route = this.routes[path];
    if (route) {
      this.loadHtml(route).catch(error => console.error(error));
    }
  }

  async loadHtml(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Cannot load ${url}: ${response.statusText}`);
    }
    const html = await response.text();
    document.querySelector("main").innerHTML = html;
  }
}


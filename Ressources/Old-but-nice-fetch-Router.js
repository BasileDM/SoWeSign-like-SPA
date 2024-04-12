import { HOME_URL, API_URL } from "../config";

export class Router {
  constructor() {
    this.routes = {
      "/": "./includes/home.html",
      "/home": "./includes/home.html",
      "/login": "./includes/home.html",
      "/confirm": "./includes/confirm.html",
      "/dashboard": " " + API_URL + " dashboard.html",
      "/test": "./includes/test.html",
    };
    this.init();
  }

  init() {
    console.log(`router initialized`);
    console.log(`window location pathname : ${window.location.pathname}`);

    window.addEventListener("DOMContentLoaded", () => this.navigateToRoute(window.location.pathname));

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
        console.log(element.pathname);
        event.preventDefault();
        this.navigateToRoute(element.pathname);
      }
    });

    this.navigateToRoute(window.location.pathname);
  }

  navigateToRoute(path) {
    console.log(`navigate to : ${path}`);
    const url = this.routes[path];
    if (url) {
      this.loadHtml(url).catch((error) => console.error(error));
    }
  }

  async loadHtml(url) {
    if (url === " " + API_URL + " dashboard.html") {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Cannot load ${url}: ${response.statusText}`);
      }
      const html = await response.text();
      document.querySelector("main").innerHTML = html;
    } else {
      console.log(`LOAD HTML URL : ${url}`);
      const response = await fetch(url);
      const html = await response.text();
      document.querySelector("main").innerHTML = html;
    }
  }
}

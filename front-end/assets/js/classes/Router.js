import { HOME_URL } from "../config.js";
import { displayToast, render } from "../display.js";
import { isTokenExpired, getToken, activate } from "../auth.js";
import { dashboard } from "../app.js";

export class Router {
  constructor() {
    this.currentSection = null;
    this.routeComponents = null;
    this.routes = {
      "/index.html": "login-section",
      "/": "login-section",
      "/home": "login-section",
      "/login": "login-section",
      "/logout": "logout-section",
      "/confirm": "activate-section",
      "/dashboard": "dashboard-section",
      "/activate": "activate-section",
    };
    this.init();
    console.log("Router initialized");
  }

  init() {
    this.routeComponents = window.location.pathname.split("/");
    console.log(`Init: Unspliced route components: ${this.routeComponents}`);

    this.routeComponents.splice(0, HOME_URL.split("/").length);
    console.log(`Init: Spliced route components: ${this.routeComponents}`);
    
    console.log(`Init: Searching for /${this.routeComponents[0]} in routes`);
    if (!("/" + this.routeComponents[0] in this.routes)) {
      console.log(`Init: Pathname not found: ${HOME_URL} ${window.location.pathname}`);
      return;
    }
    console.log(`Init: Pathname found`);

    this.currentSection = this.routes["/" + this.routeComponents[0]];
    console.log(`Init: Current section set to: ${this.currentSection}`);

    console.log(`Init: navigateToRoute(${this.routeComponents[0]}) called`);
    this.navigateToRoute(this.routeComponents[0]);

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
    let splitPath = path.split("/");
    console.log(`Nav: Splitting path: ${splitPath} | Length: ${splitPath.length}`);
    const section = this.routes["/" + splitPath[0]];
    console.log(`Nav: using first element of path as key in routes to find value of nav switch.`);
    console.log(`Nav: Section switch set to: ${section}`);

    if (!section) {
      console.log(`Nav: Section not found: ${section}`);
      displayToast("SIMPLON SWS", "The page you are trying to access does not exist", "error");
      return;
    }
    console.log(`Nav: section ${section} found`);

    document.getElementById(this.currentSection).style.display = "none";
    console.log(`Nav: hiding current section: ${this.currentSection}`);
    
    this.currentSection = section;
    console.log(`Nav: new current section set to : ${this.currentSection}`);

    console.log(`Nav: Checking if user is authenticated and if reroute is necessary.`);
    // Authenticated user rerouting
    if (getToken()) {
      console.log(`Nav: Token found. Checking for reroutes.`);
      switch (section) {
        case "login-section":
          if (!isTokenExpired()) {
            console.log(`%c Nav: Rerouting from login to dashboard`, "color: orange");
            this.navigateToRoute(HOME_URL + "dashboard");
            return;
          }
          break;

        case "activate-section":
          if (!isTokenExpired()) {
            this.navigateToRoute(HOME_URL + "dashboard");
            console.log(`%c Nav: Rerouting from activate to dashboard`, "color: orange");
            return;
          }
          break;

        default:
          console.log("Token present but no reroute necessary");
          break;
      }
    }
    console.log(`Nav: Reroute check complete.`);

    console.log(`Nav: Rendering section: ${section}`);
    switch (section) {
      case "dashboard-section":
        if (!dashboard.isLoaded) {
          console.log(`Nav: Dashboard not loaded, loading it first`);
          if (getToken() && !isTokenExpired()) {
            console.log(`Nav: Token found and not expired, loading dashboard.`);
            dashboard.loadDashboard().catch((error) => console.error(error));
          } else {
            console.log(`Nav: token not found or expired, can't load dashboard.`);
          }
        } else {
          console.log(`Nav: dashboard already loaded.`);
          console.log(`Nav: calling render(${section}) method.`);
          render(section);
          console.log(`Nav: ${section} is now visible`);
          console.log(`Nav: Pushing url state with url: /${splitPath[0]}`);
          window.history.pushState("", "", HOME_URL + "/" + splitPath[0]);
        }
        if (isTokenExpired()) {
          console.log(`%c Nav: Token expired, rerouting from dashboard to login`, "color: orange");
          this.navigateToRoute(HOME_URL);
          return;
        }
        break;

      case "logout-section":
        console.log(`%c Nav: Rerouting from logout to login`, "color: orange");
        this.navigateToRoute(HOME_URL);
        return;

      case "activate-section":
        render(section);
        document.getElementById("activate-account-btn").addEventListener("click", (event) => {
          const errorCtn = document.getElementById("password-activation-error");
          const pass1Input = document.getElementById("password-activation");
          const pass2Input = document.getElementById("password2-activation");
          let password = pass1Input.value;
          let passwordConfirm = pass2Input.value;
          if (password === "") {
            errorCtn.textContent = "Veuillez entrer un mot de passe.";
            pass1Input.classList.add("is-invalid");
            pass2Input.classList.add("is-invalid");
            return;
          }
          if (password !== passwordConfirm) {
            errorCtn.textContent = "Les mots de passe ne sont pas identiques.";
            pass1Input.classList.add("is-invalid");
            pass2Input.classList.add("is-invalid");
            return;
          }
          if (password.length < 8) {
            errorCtn.textContent = "Le mot de passe doit contenir au moins 8 caractères.";
            pass1Input.classList.add("is-invalid");
            pass2Input.classList.add("is-invalid");
            return;
          }
          pass1Input.classList.remove("is-invalid");
          pass2Input.classList.remove("is-invalid");
          pass1Input.classList.add("is-valid");
          pass2Input.classList.add("is-valid");
          let code = window.location.search.split("=")[1];
          console.log(`Code: ${window.location.search.split("=")[1]}`);
          activate(code, password, passwordConfirm);
        });
        break;

      default:
        console.log(`Nav: calling render(${section}) method.`);
        render(section);
        console.log(`Nav: ${section} is now visible`);
        console.log(splitPath);
        console.log(`Nav: Pushing url state with url: /${splitPath[0]}`);
        window.history.pushState("", "", HOME_URL + "/" + splitPath[0]);
        break;
    }
  }
}

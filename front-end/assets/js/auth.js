import { HOME_URL, API_URL } from "./config.js";
import { displayToast } from "./display.js";
import { router } from "./app.js";


export function decodeJwt(token) {
  // Split token in different parts
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("JWT is invalid");
  }
  // Decode function for base64Url encoded strings
  function base64UrlDecode(str) {
    // Replace special characters in base64Url to those of standard base64
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    // Add equal signs (=) to complete the string if necessary
    while (base64.length % 4) {
      base64 += "=";
    }
    // Decode base64 and convert to UTF-8
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  }

  // Decode header and payload
  const header = JSON.parse(base64UrlDecode(parts[0]));
  const payload = JSON.parse(base64UrlDecode(parts[1]));

  return { header, payload };
}

export function getToken() {
  return localStorage.getItem("token");
}

export function isTokenExpired() {
  const token = getToken();
  if (!token) {
    return true;
  }
  const { payload } = decodeJwt(token);
  const timeLeft = 3600000 - (Date.now() - payload.iat * 1000);
  if (timeLeft <= 0) {
    localStorage.removeItem("token");
    displayToast("SIMPLON SWS", "Your session has expired.", "error");
    return true;
  }
  console.log(`%c Token validity time left : ${Math.floor(timeLeft / 60000)} minutes`, "color: green; font-weight: bold;");
  return false;
}

export function logout() {
  localStorage.removeItem("token");
}

export function login(mail, pass) {
  fetch(API_URL + "login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mail: mail,
      password: pass,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.error) {
        displayToast("SIMPLON SWS", data.error, "error");
      } else if (data.success) {
        displayToast("SIMPLON SWS", data.success, "success");
        localStorage.setItem("token", data.token);
        switchInterface(true);
        router.navigateToRoute(HOME_URL + data.page);
      } else {
        displayToast("SIMPLON SWS", "Something went wrong.", "error");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export function switchInterface(isLoggedIn) {
  const navLogin = document.getElementById("nav-login");
  const navLogout = document.getElementById("nav-logout");
  if (isLoggedIn) {
    navLogin.style.display = "none";
    navLogout.style.display = "block";
  } else {
    navLogin.style.display = "block";
    navLogout.style.display = "none";
  }
}

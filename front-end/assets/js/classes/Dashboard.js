import { API_URL } from "../config.js";
import { displayToast, render } from "../display.js";
import { componentCreator } from "../app.js";
import * as auth from "../auth.js";

export class Dashboard {
  constructor() {
    this.isLoaded = false;
  }

  loadClasses() {
    console.log("Fetching classes ......................");
    fetch(API_URL + "getclasses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          displayToast("SIMPLON SWS", data.error, "error");
        } else if (data.success) {
          console.log(data);
          const homeTab = document.getElementById("nav-home");
          const role = auth.decodeJwt(auth.getToken()).payload.role;

          data.todaysClasses.forEach((classe) => {
            let classComponent = componentCreator.createComponent("classes", classe, role);
            homeTab.appendChild(classComponent);
          });
          
          this.loadProms(); // loadProms then loads students
        }
      })
      .catch((error) => console.error(error));
  }

  loadProms() {
    console.log("Fetching proms ......................");
    fetch(API_URL + "getproms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          displayToast("SIMPLON SWS", data.error, "error");
        } else if (data.success) {
          console.log(data);
          const promTable = document.getElementById("prom-table-body");
          const role = auth.decodeJwt(auth.getToken()).payload.role;
          const studentListTable = document.getElementById("student-list-table");

          data.promotions.forEach((prom) => {
            // These table bodies will be populated in the loadStudents method
            studentListTable.innerHTML += `<tbody id="students-table-body-prom${prom.ID}" class="d-none"></tbody>`;
            let promComponent = componentCreator.createComponent("promTableRow", prom, role);
            promTable.appendChild(promComponent);
          });

          this.loadStudents();
        }
      })
      .catch((error) => console.error(error));
  }

  loadStudents() {
    console.log("Fetching students ......................");
    fetch(API_URL + "getstudents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          displayToast("SIMPLON SWS", data.error, "error");
        } else if (data.success) {
          console.log(data);
          const role = auth.decodeJwt(auth.getToken()).payload.role;

          data.students.forEach((student) => {
            // Each table body for each prom are created in the loadProms method
            let studentTable = document.getElementById("students-table-body-prom" + student.IdPromotion);
            let studentComponent = componentCreator.createComponent("studentsTableRow", student, role);
            studentTable.appendChild(studentComponent);
          });
        }
      })
      .catch((error) => console.error(error));
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
        console.log(`Fetching dashboard : ${response.statusText}`);
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
          this.isLoaded = true;
          window.history.pushState("", "", "dashboard");
          displayToast("SIMPLON SWS", data.success, "success");
          document.querySelector("#dashboard-section").innerHTML = data.dashboard;
          console.log("%c Dashboard loaded from server, now making it visible", "color: red");
          render("dashboard-section");

          this.loadClasses(); // This methos then loads proms

        } else {
          displayToast("SIMPLON SWS", "Something went wrong.", "error");
        }
      });
  }
}

import { API_URL } from "../config";
import { displayToast } from "../display";

export function todaysClasses(content, role) {
  // Elements creation
  const component = document.createElement("div");
  const header = document.createElement("div");
  const titleSubtile = document.createElement("div");
  const title = document.createElement("h4");
  const subtile = document.createElement("p");
  const date = document.createElement("p");
  const body = document.createElement("div");
  const button = document.createElement("div");
  const inputCode = document.createElement("div");
  const input = document.createElement("input");
  const inputLabel = document.createElement("label");
  const classCode = document.createElement("h4");

  // Classes assignation
  component.className = "container-sm bg-body-secondary p-3 rounded mt-5";
  header.className = "d-flex justify-content-between";
  body.className = "d-flex flex-column gap-3";
  inputCode.className = "d-flex flex-column";
  input.dataset.classId = content.Id;

  // Ordered architecture composition
  inputCode.appendChild(inputLabel);
  inputCode.appendChild(input);
  role === "1" ? body.appendChild(inputCode) : inputCode.remove;
  body.appendChild(button);
  titleSubtile.appendChild(title);
  titleSubtile.appendChild(subtile);
  header.appendChild(titleSubtile);
  header.appendChild(date);
  component.appendChild(header);
  component.appendChild(body);

  // Content population
  date.textContent = content.StartTime.split(" ")[0];
  let time = content.StartTime.split(" ")[1];
  let endTime = content.EndTime.split(" ")[1];
  title.textContent = content.PromName;
  title.innerHTML +=
    " " +
    "<span style='color: #3b82f6; font-size: 0.8em'>" +
    time.split(":")[0] +
    "h" +
    time.split(":")[1] +
    " - " +
    endTime.split(":")[0] +
    "h" +
    endTime.split(":")[1] +
    "</span>";
  subtile.textContent = content.StudentsNumber + " participants";
  inputLabel.textContent = "Code*";

  const currentHour = new Date().getHours();
  const currentMinutes = new Date().getMinutes();
  const [classHour, classMinute] = time.split(":");
  const [classEndHour, classEndMinute] = endTime.split(":");
  const hasClassStarted =
    currentHour > parseInt(classHour) ||
    (currentHour === parseInt(classHour) && currentMinutes >= parseInt(classMinute));
  const hasClassEnded =
    currentHour > parseInt(classEndHour) ||
    (currentHour === parseInt(classEndHour) && currentMinutes >= parseInt(classEndMinute));

  // Role dependent generation
  switch (role) {
    case "2":
      if (content.Code === null) {
        button.className = "btn btn-primary ms-auto align-self-end";
        button.textContent = "Valider présence";
        button.addEventListener("click", generateCode);
        hasClassStarted ? button.classList.remove("disabled") : button.classList.add("disabled");
      } else {
        body.insertBefore(classCode, button);
        hasClassEnded ? classCode.remove() : classCode.textContent = content.Code;
        classCode.className = "border border-2 border-primary rounded p-1 w-100 text-center";
        hasClassEnded ? button.className = "btn btn-success ms-auto align-self-end" : button.className = "btn btn-warning ms-auto align-self-end";
        hasClassEnded ? button.innerHTML = "<strong>Signatures recueillies</strong>" : button.innerHTML = "<strong>Signatures en cours</strong>";
      }
      break;

    case "1":
      button.className = "btn btn-primary ms-auto align-self-end";
      button.textContent = "Signer";
      button.addEventListener("click", submitCode);
      if (content.Code === null) {
        inputCode.remove();
        button.remove();
      }
      if (content.userStatus != null) {
        button.textContent = "Présence enregistrée !";
        button.className = "btn btn-success ms-auto align-self-end disabled";
        inputCode.innerHTML = "";
        button.removeEventListener("click", submitCode);
      } else if (hasClassEnded) {
        button.textContent = "Cours terminé";
        button.className = "btn btn-danger ms-auto align-self-end disabled";
        inputCode.innerHTML = "";
        button.removeEventListener("click", submitCode);
      }
      break;
    default:
      break;
  }
  return component;

  function generateCode() {
    fetch(API_URL + "generatecode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        classId: content.Id, // ID of the class the code is gonna be generated for
        token: localStorage.getItem("token"),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          displayToast("SIMPLON SWS", data.error, "error");
        } else if (data.success) {
          body.insertBefore(classCode, button);
          classCode.textContent = data.code;
          classCode.className = "border border-2 border-primary rounded p-1 w-100 text-center";
          button.className = "btn btn-warning ms-auto align-self-end";
          button.innerHTML = "<strong>Signatures en cours</strong>";
          content.Code = data.code;
          button.removeEventListener("click", generateCode);
        } else {
          displayToast("SIMPLON SWS", "Something went wrong.", "error");
        }
      });
  }

  function submitCode() {
    let currentHour = new Date().getHours();
    let currentMinutes = new Date().getMinutes();
    console.log(currentHour, currentMinutes, classHour, classMinute);
    let isStudentLate = (currentHour * 60 + currentMinutes) - (parseInt(classHour) * 60 + parseInt(classMinute)) > 15 ? 2 : 1;
    if (currentHour > parseInt(classEndHour) || (currentHour === parseInt(classEndHour) && currentMinutes >= parseInt(classEndMinute))) {
      displayToast("SIMPLON SWS", "Erreur : Cours terminé", "error");
      return;
    }
    console.log(isStudentLate);

    fetch(API_URL + "sign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        classId: content.Id, // ID of the class the code is sent for
        submittedCode: input.value,
        presenceStatus: isStudentLate, // 1 = present, 2 = late
        token: localStorage.getItem("token"),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          displayToast("SIMPLON SWS", data.error, "error");
        } else if (data.success) {
          displayToast("SIMPLON SWS", data.success, "success");
          button.textContent = "Présence enregistrée !";
          button.className = "btn btn-success ms-auto align-self-end disabled";
          inputCode.innerHTML = "";
          button.removeEventListener("click", submitCode);
        } else {
          displayToast("SIMPLON SWS", "Something went wrong.", "error");
        }
      });
  }
}

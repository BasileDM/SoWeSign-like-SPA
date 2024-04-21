import { API_URL } from "../config.js";
import { displayToast } from "../display.js";

export function customForm(content, role, type) {
  // type parameter = [switch case(name), create/edit, section to display on goBack button click]
  // example usage :
  // let editForm = compCreator.createComponent("customForm", content, role, ["user", "edit", hideSection]);

  const editSection = document.getElementById("form-creation-section");
  editSection.style.display = "block";

  let headerTitle = "";
  let headerSubtitle = "";
  let inputNames = [];
  let inputTypes = [];
  let idList = [];
  let inputPlaceholders = [];

  switch (type[0]) {
    case "promotion":
      headerTitle = type[1] === "create" ? "Création d'une promotion" : "Modifier la promotion " + content.NAME;
      headerSubtitle = type[1] === "create" ? "" : "Les changements appliqués sont définitifs.";
      inputNames = ["Nom de la promotion", "Date de début", "Date de fin", "Places disponibles"];
      inputTypes = ["text", "date", "date", "number"];
      inputPlaceholders =
        type[1] === "create" ? [] : [content.NAME, content.START_DATE, content.END_DATE, content.AVAILABLE_SPOTS];
      break;

    case "user":
      headerTitle =
        type[1] === "create"
          ? "Création d'un apprenant"
          : "Modifier l'apprenant " + content.FirstName + " " + content.LastName;
      headerSubtitle = type[1] === "create" ? "" : "Les changements appliqués sont définis.";
      inputNames = ["Nom de famille", "Prénom", "Mail"];
      inputTypes = ["text", "text", "email"];
      type[1] === "create" ? [] : (inputPlaceholders = [content.LastName, content.FirstName, content.Mail]);
      break;

    case "retard":
      headerTitle =
        type[1] === "create"
          ? "Création d'un retard"
          : "Modifier le retard de l'apprenant " + content.FirstName + " " + content.LastName;
      headerSubtitle = type[1] === "create" ? "" : "Les changements appliqués sont définis.";
      inputNames = ["Date de retard", "Commentaire"];
      inputTypes = ["date", "text"];
      type[1] === "create" ? [] : (inputPlaceholders = [content.lateDate.split(" ")[0], content.ID_USER]);
      break;

    default:
      break;
  }

  const component = document.createElement("form");
  component.className = "d-flex flex-column gap-3";
  const header = document.createElement("div");
  const title = document.createElement("h4");
  const subtitle = document.createElement("p");
  title.textContent = headerTitle;
  subtitle.textContent = headerSubtitle;
  header.appendChild(title);
  header.appendChild(subtitle);
  component.appendChild(header);

  // Configuration loop for each input
  for (let i = 0; i < inputNames.length; i++) {
    const div = document.createElement("div");
    div.className = "mb-3";
    const label = document.createElement("label");
    label.className = "form-label";
    label.innerHTML = inputNames[i];
    label.for = inputNames[i];
    const input = document.createElement("input");
    input.className = "form-control";
    input.name = inputNames[i];
    input.id = makePascalCase(inputNames[i]);
    input.value = type[1] === "create" ? null : inputPlaceholders[i];
    idList = [...idList, makePascalCase(inputNames[i])];
    input.type = inputTypes[i];
    div.appendChild(label);
    div.appendChild(input);
    component.appendChild(div);

    const errorContainer = document.createElement("div");
    errorContainer.className = "text-danger d-none";
    errorContainer.textContent = "Error container";
    errorContainer.id = makePascalCase(inputNames[i]) + "-error-ctn";
    component.appendChild(errorContainer);

    input.addEventListener("change", () => {
      input.type !== "date" ? checkFieldType(inputTypes[i], input.id, input.value) : null;
    });
  }

  // Bottom buttons
  const buttonBar = document.createElement("div");
  buttonBar.className = "d-flex gap-3";
  const leftButtons = document.createElement("div");
  const rightButtons = document.createElement("div");
  leftButtons.className = "d-flex gap-3";
  rightButtons.className = "d-flex gap-3 ms-auto";

  const goBackButton = document.createElement("div");
  goBackButton.className = "btn btn-primary";
  goBackButton.textContent = "Retour";
  leftButtons.appendChild(goBackButton);

  const deleteButton = document.createElement("div");
  deleteButton.className = type[1] === "create" ? "d-none" : "btn btn-danger";
  deleteButton.textContent = "Supprimer";
  rightButtons.appendChild(deleteButton);

  const submitButton = document.createElement("div");
  submitButton.className = "btn btn-primary";
  submitButton.textContent = "Enregistrer";
  rightButtons.appendChild(submitButton);

  buttonBar.appendChild(leftButtons);
  buttonBar.appendChild(rightButtons);
  component.appendChild(buttonBar);

  // Delete button
  deleteButton.addEventListener("click", () => {
    switch (type[0]) {
      case "promotion":
        deletePromotion(content.ID);
        break;
      case "user":
        deleteUser(content.Id);
        break;
      default:
        console.error("Invalid type");
        break;
    }
  });

  // Go back button
  goBackButton.addEventListener("click", () => {
    const sectionTodisplayBack = type[2];
    const editSection = document.getElementById("form-creation-section");
    sectionTodisplayBack.style.display = "block";
    editSection.style.display = "none";
    editSection.innerHTML = "";
  });

  // // Event listeners
  // Submit button
  submitButton.addEventListener("click", () => {
    let valuesList = [];
    let areAllinputValid = [];
    for (let i = 0; i < idList.length; i++) {
      valuesList = [...valuesList, document.getElementById(idList[i]).value];
      if (inputTypes[i] === "date") {
        valuesList = [...valuesList, document.getElementById(idList[i + 1]).value];
        checkFieldType(inputTypes[i], idList[i], valuesList[i], valuesList[i + 1])
          ? (areAllinputValid = [...areAllinputValid, true])
          : (areAllinputValid = [...areAllinputValid, false]);
        i++;
        continue;
      }
      checkFieldType(inputTypes[i], idList[i], valuesList[i], valuesList[i + 1])
        ? (areAllinputValid = [...areAllinputValid, true])
        : (areAllinputValid = [...areAllinputValid, false]);
    }
    if (areAllinputValid.includes(false)) {
      return;
    } else {
      if (type[0] == "user" && type[1] == "edit") valuesList = [content.Id, ...valuesList];
      if (type[0] == "promotion" && type[1] == "edit") valuesList = [content.ID, ...valuesList];
      sendForm(valuesList, type[1], type[0]); // sendForm(arg1: valuesList, arg2: create/edit, arg3: prom/user/etc.)
    }
  });

  // Input check functions
  function checkFieldType(type, id, value, value2 = null) {
    switch (type) {
      case "number":
        value = parseInt(value);
        return checkInt(value, id);
      case "email":
        return checkMail(value, id);
      case "text":
        return checkName(value, id);
      case "date":
        return checkDateSpan(value, value2, id);
      default:
        return false;
    }
  }

  function displayFormError(id) {
    let errorContainer = document.getElementById(id + "-error-ctn");
    errorContainer.classList.remove("d-none");
    errorContainer.classList.add("d-block");
    document.getElementById(id).classList.add("is-invalid");
    document.getElementById(id).classList.remove("is-valid");
    document.getElementById(id).insertAdjacentElement("afterend", errorContainer);
  }

  function displayValidForm(id) {
    let errorContainer = document.getElementById(id + "-error-ctn");
    document.getElementById(id).classList.add("is-valid");
    document.getElementById(id).classList.remove("is-invalid");
    errorContainer.classList.add("d-none");
    errorContainer.classList.remove("d-block");
  }

  function checkName(string, id) {
    let errorContainer = document.getElementById(id + "-error-ctn");
    if (string.length < 2 || string.length > 50) {
      errorContainer.textContent = "Entre 2 et 50 caractères sont requis";
      displayFormError(id);
      return false;
    }
    displayValidForm(id);
    return true;
  }

  function checkMail(string, id) {
    let errorContainer = document.getElementById(id + "-error-ctn");
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(string)) {
      errorContainer.textContent = "Veuillez entrer un mail valide";
      displayFormError(id);
      return false;
    }
    if (string.length > 80) {
      errorContainer.textContent = "Le mail ne doit pas avoir plus de 80 caractères";
      displayFormError(id);
      return false;
    }
    displayValidForm(id);
    return true;
  }

  function checkDateSpan(date1, date2, id = null) {
    let errorContainer = document.getElementById(id + "-error-ctn");
    const index = idList.indexOf(document.getElementById(id).id);
    const date2InputId = idList[index + 1];
    let errorContainer2 = document.getElementById(date2InputId + "-error-ctn");
    if (date1 === "") {
      errorContainer.textContent = "Veuillez entrer une date.";
      displayFormError(id);
      if (date2 === "") {
        errorContainer2.textContent = "Veuillez entrer une date.";
        displayFormError(date2InputId);
      }
      return false;
    }
    displayValidForm(id);
    if (date2 === "") {
      errorContainer2.textContent = "Veuillez entrer une date.";
      displayFormError(date2InputId);
      return false;
    }
    displayValidForm(date2InputId);
    if (new Date(date1) > new Date(date2)) {
      errorContainer.textContent = "";
      errorContainer2.textContent = "La date de fin doit être supérieure à la date de début";
      displayFormError(id);
      displayFormError(date2InputId);
      return false;
    }
    displayValidForm(id);
    displayValidForm(date2InputId);
    return true;
  }

  function checkInt(int, id) {
    let errorContainer = document.getElementById(id + "-error-ctn");
    if (int < 0 || !Number.isInteger(parseInt(int))) {
      errorContainer.textContent = "Veuillez entrer une valeur valide";
      displayFormError(id);
      return false;
    }
    displayValidForm(id);
    return true;
  }

  // Other functions
  function makePascalCase(string) {
    let word = string
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("");
    return word;
  }

  function deleteUser(userId) {
    fetch(API_URL + "deleteuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
        deleteUserId: userId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          displayToast("SIMPLON SWS", data.error, "error");
        } else if (data.success) {
          displayToast("SIMPLON SWS", data.success, "success");
        }
      })
      .catch((error) => console.error(error));
  }

  function deletePromotion(promId) {
    fetch(API_URL + "deleteprom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
        deletePromId: promId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          displayToast("SIMPLON SWS", data.error, "error");
        } else if (data.success) {
          displayToast("SIMPLON SWS", data.success, "success");
        }
      })
      .catch((error) => console.error(error));
  }

  function sendForm(inputValues, crudType, formCategory) {
    console.log(inputValues, crudType, formCategory);
    fetch(API_URL + "handleForm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
        crudType: crudType,
        formCategory: formCategory,
        formContent: inputValues,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          displayToast("SIMPLON SWS", data.error, "error");
        } else if (data.success) {
          console.log(data);
          displayToast("SIMPLON SWS", data.success, "success");
        }
      })
      .catch((error) => console.error(error));
  }

  return component;
}

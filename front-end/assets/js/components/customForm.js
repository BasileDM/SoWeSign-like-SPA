export function customForm(content, role, type) {
  // type parameter = [switch case(name), create/edit, section to display on goBack button click]
  // example usage : 
  // let editForm = compCreator.createComponent("customForm", content, role, ["student", "edit", hideSection]);
  
  const editSection = document.getElementById("form-creation-section");
  editSection.style.display = "block";

  let headerTitle = "";
  let headerSubtitle = "";
  let inputNames = [];
  let inputTypes = [];
  let idList = [];

  switch (type[0]) {
    case "promotion":
      headerTitle = type[1] === "create" ? "Création d'une promotion" : "Modifier la promotion " + content.NAME;
      headerSubtitle = type[1] === "create" ? "" : "Les changements appliqués sont définitifs.";
      inputNames = ["Nom de la promotion", "Date de début", "Date de fin", "Places disponibles"];
      inputTypes = ["text", "date", "date", "number"];
      break;

    case "student":
      headerTitle =
        type[1] === "create"
          ? "Création d'un apprenant"
          : "Modifier l'apprenant " + content.FirstName + " " + content.LastName;
      headerSubtitle = type[1] === "create" ? "" : "Les changements appliqués sont définis.";
      inputNames = ["Nom de famille", "Prénom", "Mail"];
      inputTypes = ["text", "text", "email"];
      break;

    case "retard":
      headerTitle =
        type[1] === "create"
          ? "Création d'un retard"
          : "Modifier le retard de l'apprenant " + content.FirstName + " " + content.LastName;
      headerSubtitle = type[1] === "create" ? "" : "Les changements appliqués sont définis.";
      inputNames = ["Date de retard", "Commentaire"];
      inputTypes = ["date", "text"];
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
    idList = [...idList, makePascalCase(inputNames[i])];
    input.type = inputTypes[i];
    div.appendChild(label);
    div.appendChild(input);
    component.appendChild(div);
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

  // Go back button
  goBackButton.addEventListener("click", () => {
    const sectionTodisplayBack = type[2];
    const editSection = document.getElementById("form-creation-section");
    sectionTodisplayBack.style.display = "block";
    editSection.style.display = "none";
    editSection.innerHTML = "";
  });

  // Submit button
  submitButton.addEventListener("click", () => {
    let valuesList = [];
    for (let i = 0; i < idList.length; i++) {
      valuesList = [...valuesList, document.getElementById(idList[i]).value];
      switch (inputTypes[i]) {
        case "date":
          valuesList[i] = new Date(valuesList[i]);
          break;
        case "number":
          valuesList[i] = parseInt(valuesList[i]);
          break;
        case "email":
          break;
        case "text":
          break;
        default:
          break;
      }
    }
  });

  // if (type[0] === "promotion") {
  //   deleteButton.addEventListener("click", () => {
  //     deletePromo();
  //   });
  // }

  function makePascalCase(string) {
    let word = string
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("");
    return word;
  }

  function checkName(string) {
    if (string.length < 2) {
      alert("Le nom ne peut pas être vide.");
      return false;
    }
  }

  function checkMail(string) {
    if (string.length < 2) {
      alert("Le mail ne peut pas être vide.");
      return false;
    }

    return true;
  }

  function checkDateSpan(date1, date2) {
    if (date1 > date2) {
      alert("La date de fin doit être superieur à la date de debut.");
      return false;
    }

    return true;
  }

  function checkInt(int) {
    if (int < 0) {
      alert("La valeur doit être positive.");
      return false;
    }
    if (Number.isInteger(int) === false) {
      alert("La valeur doit être un entier.");
      return false;
    }

    return true;
  }

  return component;
}

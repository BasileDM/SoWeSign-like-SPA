export function customForm(content, role, type) {
  let headerTitle = "";
  let headerSubtitle = "";
  let inputAmmount = null;
  let inputNames = [];
  let inputTypes = [];

  switch (type[0]) {
    case "promotion":
      headerTitle = type[1] === "create" ? "Création d'un promotion" : "Modifier la promotion " + content.NAME;
      headerSubtitle = type[1] === "create" ? "" : "Les changements appliqués sont définitifs.";
      inputAmmount = 4;
      inputNames = ["Nom de la promotion", "Date de début", "Date de fin", "Places disponibles"];
      inputTypes = ["text", "date", "date", "number"];
      break;

    case "student":
      headerTitle =
        type[1] === "create"
          ? "Création d'un apprenant"
          : "Modifier l'apprenant " + content.FIRST_NAME + " " + content.LAST_NAME;
      headerSubtitle = type[1] === "create" ? "" : "Les changements appliqués sont définis.";
      inputAmmount = 3;
      inputNames = ["Nom de famille", "Prénom", "Mail"];
      inputTypes = ["text", "text", "email"];
      break;

    case "retard":
      headerTitle =
        type[1] === "create"
          ? "Création d'un retard"
          : "Modifier le retard de l'apprenant " + content.FIRST_NAME + " " + content.LAST_NAME;
      headerSubtitle = type[1] === "create" ? "" : "Les changements appliqués sont définis.";
      inputAmmount = 2;
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

  for (let i = 0; i < inputAmmount; i++) {
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

  goBackButton.addEventListener("click", () => {
    const listSection = document.getElementById("promolist");
    const editSection = document.getElementById("promoEdit");
    listSection.style.display = "block";
    editSection.style.display = "none";
    editSection.innerHTML = "";
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

  return component;
}

export function customForm(content, role, type) {
  let inputAmmount = null;
  let inputNames = [];
  let inputTypes = [];

  switch (type[0]) {
    case "promotion":
      inputAmmount = 4;
      inputNames = ["Nom de la promotion", "Date de début", "Date de fin", "Places disponibles"];
      inputTypes = ["text", "date", "date", "number"];
      break;

    default:
      break;
  }

  const component = document.createElement("form");
  component.className = "d-flex flex-column gap-3";
  
  for (let i = 0; i < inputAmmount; i++) {
    const div = document.createElement("div");
    div.className = "mb-3";
    const label = document.createElement("label");
    label.className = "form-label";
    label.innerHTML = inputNames[i];
    const input = document.createElement("input");
    input.className = "form-control";
    input.name = inputNames[i];
    input.type = inputTypes[i];
    div.appendChild(label);
    div.appendChild(input);
    component.appendChild(div);
  }
  return component;
}

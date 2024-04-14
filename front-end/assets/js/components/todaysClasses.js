export function todaysClasses(content) {
  // Elements creation
  const component = document.createElement("div");

  const header = document.createElement("div");
  const titleSubtile = document.createElement("div");
  const title = document.createElement("h4");
  const subtile = document.createElement("p");
  const date = document.createElement("p");

  const body = document.createElement("div");
  const button = document.createElement("div");

  // Classes assignation
  component.className = "container-sm bg-body-secondary p-3 rounded mt-5";
  header.className = "d-flex justify-content-between";
  body.className = "d-flex";
  button.className = "btn btn-primary ms-auto align-self-end";

  // Architecture composition
  body.appendChild(button);
  titleSubtile.appendChild(title, subtile);
  header.appendChild(titleSubtile);
  header.appendChild(date);
  component.appendChild(header);
  component.appendChild(body);

  // Content population
  button.textContent = "Valider présence";
  date.textContent = content.StartTime.split(" ")[0];
  let time = content.StartTime.split(" ")[1];
  date.innerHTML += " " + "<span style='color: #3b82f6'>" + time + "</span>";
  title.textContent = content.IdPromotion;

  return component;
}
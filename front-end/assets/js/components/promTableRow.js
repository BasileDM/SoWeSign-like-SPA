export function promTableRow(content, role) {
  const component = document.createElement("tr");
  const th = document.createElement("th");
  const tdstart = document.createElement("td");
  const tdend = document.createElement("td");
  const tdplaces = document.createElement("td");
  const tdactions = document.createElement("td");
  const actionDiv = document.createElement("div");
  const a1 = document.createElement("span");
  const a2 = document.createElement("span");
  const a3 = document.createElement("span");

  th.setAttribute("scope", "row");
  th.textContent = content.NAME;
  tdstart.textContent = content.START_DATE;
  tdend.textContent = content.END_DATE;
  tdplaces.textContent = content.AVAILABLE_SPOTS;
  actionDiv.className = "d-flex gap-2 justify-content-end flex-wrap";
  a1.style.cursor = "pointer";
  a2.style.cursor = "pointer";
  a3.style.cursor = "pointer";
  a1.textContent = "Voir";
  a2.textContent = "Modifier";
  a3.textContent = "Supprimer";
  a1.addEventListener("click", displayPromo);
  a2.addEventListener("click", editPromo);
  a3.addEventListener("click", deletePromo);
  a1.className = "link-info link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover";
  a2.className = "link-info link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover";
  a3.className = "link-danger link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover";

  component.appendChild(th);
  component.appendChild(tdstart);
  component.appendChild(tdend);
  component.appendChild(tdplaces);
  component.appendChild(tdactions);
  tdactions.appendChild(actionDiv);
  actionDiv.appendChild(a1);
  actionDiv.appendChild(a2);
  actionDiv.appendChild(a3);

  return component;

  function displayPromo() {
    console.log(content);
    const promList = document.getElementById("nav-promos");
    promList.style.display = "none";
    const promdetails = document.getElementById("promodetails");
    promdetails.style.display = "block";


    const toolbar = document.getElementById("student-list-toolbar");
    const addStudentButton = document.createElement("div");
    const goBackButton = document.createElement("div");

    goBackButton.className = "btn btn-primary ms-auto align-self-start";
    goBackButton.textContent = "Retour";
    
    addStudentButton.className = "btn btn-success ms-auto align-self-start";
    const header = document.createElement("div");
    const title = document.createElement("h4");
    const subtitle = document.createElement("p");
    addStudentButton.textContent = "Ajouter apprenant";
    header.appendChild(title);
    header.appendChild(subtitle);
    toolbar.appendChild(header);
    toolbar.appendChild(addStudentButton);
    toolbar.appendChild(goBackButton);
    toolbar.className = "d-flex justify-content-between";
    title.textContent = "Promotion";
    subtitle.textContent = "Promotion " + content.NAME;

    goBackButton.addEventListener("click", () => {
      promList.style.display = "block";
      promdetails.style.display = "none";
      promdetails.innerHTML = ""; // FIX THIS
    });
  }

  function editPromo() {
    console.log(content);
  }

  function deletePromo() {
    console.log(content);
  }
}
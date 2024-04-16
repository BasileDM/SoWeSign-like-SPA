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
    const promTableBody = document.getElementById(`students-table-body-prom${content.ID}`);
    const promLateTableBody = document.getElementById(`late-table-body-prom${content.ID}`);
    promTableBody.classList.remove("d-none");
    promLateTableBody.classList.remove("d-none");

    const promList = document.getElementById("promolist");
    promList.style.display = "none";
    const promdetails = document.getElementById("promodetails");
    promdetails.style.display = "block";

    const title = document.getElementById("students-toolbar-title");
    const subtitle = document.getElementById("students-toolbar-subtitle");
    title.textContent = "Promotion";
    subtitle.textContent = "Promotion " + content.NAME;

    const goBackButton = document.getElementById("students-toolbar-goback-btn");

    goBackButton.addEventListener("click", () => {
      promList.style.display = "block";
      promdetails.style.display = "none";
      promTableBody.classList.add("d-none");
      promLateTableBody.classList.add("d-none");
    });
  }

  function editPromo() {
    console.log(content);
  }

  function deletePromo() {
    console.log(content);
  }
}
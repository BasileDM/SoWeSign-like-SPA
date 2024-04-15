export function promTableRow(content, role) {
  const component = document.createElement("tr");
  const th = document.createElement("th");
  const tdstart = document.createElement("td");
  const tdend = document.createElement("td");
  const tdplaces = document.createElement("td");
  const tdactions = document.createElement("td");
  const actionDiv = document.createElement("div");
  const a1 = document.createElement("a");
  const a2 = document.createElement("a");
  const a3 = document.createElement("a");

  th.setAttribute("scope", "row");
  th.textContent = content.NAME;
  tdstart.textContent = content.START_DATE;
  tdend.textContent = content.END_DATE;
  tdplaces.textContent = content.AVAILABLE_SPOTS;
  actionDiv.className = "d-flex gap-2 justify-content-end flex-wrap";
  a1.textContent = "Voir";
  a2.textContent = "Modifier";
  a3.textContent = "Supprimer";
  a1.setAttribute("href", "./promdetails");
  a2.setAttribute("href", "./promedit");
  a3.setAttribute("href", "./promdelete");
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
}
export function promTableRow(content) {
  const ctn = document.createElement("tr");
  const th = document.createElement("th");
  const tdprom = document.createElement("td");
  const tdstart = document.createElement("td");
  const tdend = document.createElement("td");
  const tdplaces = document.createElement("td");
  const a1 = document.createElement("a");
  const a2 = document.createElement("a");
  const a3 = document.createElement("a");

  th.setAttribute("scope", "row");
  a1.textContent = "Voir";
  a2.textContent = "Modifier";
  a3.textContent = "Supprimer";
  a1.setAttribute("href", "./cours");
  a2.setAttribute("href", "./cours");
  a3.setAttribute("href", "./cours");

  ctn.appendChild(th);
  ctn.appendChild(tdprom);
  ctn.appendChild(tdstart);
  ctn.appendChild(tdend);
  ctn.appendChild(tdplaces);
  tdplaces.appendChild(a1);
  tdplaces.appendChild(a2);
  tdplaces.appendChild(a3);
}
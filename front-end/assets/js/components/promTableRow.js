export function promTableRow(content, role) {
  const component = document.createElement("tr");
  const th = document.createElement("th");
  const tdstart = document.createElement("td");
  const tdend = document.createElement("td");
  const tdplaces = document.createElement("td");
  const tdactions = document.createElement("td");
  const a1 = document.createElement("a");
  const a2 = document.createElement("a");
  const a3 = document.createElement("a");

  th.setAttribute("scope", "row");
  th.textContent = content.NAME;
  tdstart.textContent = content.START_DATE;
  tdend.textContent = content.END_DATE;
  tdplaces.textContent = content.AVAILABLE_SPOTS;
  a1.textContent = "Voir";
  a2.textContent = "Modifier";
  a3.textContent = "Supprimer";
  a1.setAttribute("href", "./voir");
  a2.setAttribute("href", "./modifier");
  a3.setAttribute("href", "./supprimer");

  component.appendChild(th);
  component.appendChild(tdstart);
  component.appendChild(tdend);
  component.appendChild(tdplaces);
  component.appendChild(tdactions);
  tdactions.appendChild(a1);
  tdactions.appendChild(a2);
  tdactions.appendChild(a3);

  return component;
}
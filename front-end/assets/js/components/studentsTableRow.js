import { ComponentCreator } from "../classes/ComponentCreator";

export function studentsTableRow(content, role, type) {
  console.log(`content on element creation :`);
  console.log(content);
  const component = document.createElement("tr");
  const th = document.createElement("th");
  const tdFirstName = document.createElement("td");
  const tdMail = document.createElement("td");
  const tdActivated = document.createElement("td");
  const tdRole = document.createElement("td");
  const tdactions = document.createElement("td");
  const actionDiv = document.createElement("div");
  const a1 = document.createElement("span");
  const a2 = document.createElement("span");

  th.setAttribute("scope", "row");
  th.textContent = content.LastName;
  tdFirstName.textContent = content.FirstName;
  tdMail.textContent = type === "late" ? content.lateDate : content.Mail;
  tdActivated.textContent = content.Activated;
  tdRole.textContent = content.IdRole;
  actionDiv.className = "d-flex gap-2 justify-content-end flex-wrap";
  a1.style.cursor = "pointer";
  a2.style.cursor = "pointer";
  a1.textContent = "Éditer";
  a2.textContent = "Supprimer";
  a1.addEventListener("click", editAction);
  a2.addEventListener("click", deleteAction);
  a1.className = "link-info link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover";
  a2.className = "link-danger link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover";

  component.appendChild(th);
  component.appendChild(tdFirstName);
  component.appendChild(tdMail);
  component.appendChild(tdActivated);
  component.appendChild(tdRole);
  component.appendChild(tdactions);
  tdactions.appendChild(actionDiv);
  actionDiv.appendChild(a1);
  actionDiv.appendChild(a2);

  return component;

  function editAction() {
    const compCreator = new ComponentCreator();
    let hideSection = document.getElementById("promodetails");
    let editForm = compCreator.createComponent("customForm", content, role, ["student", "edit", hideSection]);
    switch (type) {
      case "late":
        console.log(`Content sent in form through late component edit button :`);
        console.log(content);
        editForm = compCreator.createComponent("customForm", content, role, ["retard", "edit", hideSection]);
        break;
      default:
        break;
      }
    hideSection.style.display = "none";
    document.getElementById("form-creation-section").appendChild(editForm);
  }

  function deleteAction() {
    console.log(content);
  }
}
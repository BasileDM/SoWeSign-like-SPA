import { todaysClasses } from "../components/todaysClasses.js";
import { promTableRow } from "../components/promTableRow.js";
import { studentsTableRow } from "../components/studentsTableRow.js";
import { customForm } from "../components/customForm.js";

export class ComponentCreator {
  constructor() {
    this.templates = {};
    this.registerTemplate("classes", todaysClasses);
    this.registerTemplate("promTableRow", promTableRow);
    this.registerTemplate("studentsTableRow", studentsTableRow);
    this.registerTemplate("customForm", customForm);
  }

  registerTemplate(name, templateFunction) {
    this.templates[name] = templateFunction;
  }

  createComponent(name, content, role = null, type = null) {
    if (!(name in this.templates)) {
      console.error(`Template for ${name} not found.`);
      return null;
    }
    const templateFunction = this.templates[name];
    return templateFunction(content, role, type);
  }
}

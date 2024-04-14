import { todaysClasses } from "../components/todaysClasses.js";

export class ComponentCreator {
  constructor() {
    this.templates = {};
    this.registerTemplate("classes", todaysClasses);
  }

  registerTemplate(name, templateFunction) {
    this.templates[name] = templateFunction;
  }

  createComponent(name, content) {
    if (!(name in this.templates)) {
      console.error(`Template for ${name} not found.`);
      return null;
    }

    const templateFunction = this.templates[name];
    return templateFunction(content);
  }
}

import { todaysClasses } from "../components/todaysClasses.js";

export class ComponentCreator {
  constructor() {
    this.templates = {};

    // Registering Default Components
    // Today's Classes Component
    this.registerTemplate("classes", todaysClasses);

    this.registerTemplate("customComponent", function (content) {
      const div = document.createElement("div");
      div.className = "custom-component";
      div.textContent = content;
      return div;
    });
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

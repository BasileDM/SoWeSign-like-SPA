export class ComponentCreator {
  constructor() {
    this.templates = {};
    
    // Registering default templates
    this.registerTemplate("classes", function (content) {
      const div = document.createElement("div");
      div.className = "comment";
      div.textContent = content;
      return div;
    });
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

class ComponentCreator {
  constructor() {
    this.templates = {};
  }

  registerTemplate(name, templateFunction) {
    this.templates[name] = templateFunction;
  }

  createComponent(type, content) {
    if (!(type in this.templates)) {
      console.error(`Template for ${type} not found.`);
      return null;
    }

    const template = this.templates[type];
    return template(content);
  }
}

// Example usage:
const componentCreator = new ComponentCreator();

// Register templates for different components
componentCreator.registerTemplate("comment", function(content) {
  const div = document.createElement("div");
  div.className = "comment";
  div.textContent = content;
  return div;
});

componentCreator.registerTemplate("customComponent", function(content) {
  const div = document.createElement("div");
  div.className = "custom-component";
  div.textContent = content;
  return div;
});

// Create components
const commentComponent = componentCreator.createComponent("comment", "This is a comment.");
const customComponent = componentCreator.createComponent("customComponent", "This is a custom component.");

// Append components to the document body
document.body.appendChild(commentComponent);
document.body.appendChild(customComponent);

export function displayToast(title, message, type) {
  const toastElement = document.getElementById("toast");
  switch (type) {
    case "success":
      toastElement.classList.remove("bg-danger");
      toastElement.classList.add("bg-success");
      break;
    case "error":
      toastElement.classList.remove("bg-success");
      toastElement.classList.add("bg-danger");
      break;
    default:
      break;
  }
  const toastHeader = document.querySelector(".toast-header>strong");
  toastHeader.textContent = title;
  const toastBody = document.querySelector(".toast-body");
  toastBody.textContent = message;
  const toast = new bootstrap.Toast(document.getElementById("toast"));
  toast.show();
}

export function render(section) {
  document.querySelector(`#${section}`).style.display = "block";
}
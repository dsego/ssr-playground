const debounce = (callback, delay) => {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(callback, delay);
  };
};

// TODO: handle htmx event
const inputs = document.querySelectorAll("[data-preview-target]");
inputs.forEach((input) => {
  const previewTarget = input.dataset.previewTarget;
  input.oninput = debounce(() => {
    document.getElementById(previewTarget).src = "";
    document.getElementById(previewTarget).src = input.value;
  }, 200);
});

document.body.addEventListener("htmx:load", (evt) => {
  const input = document.querySelector("#input-field-name");
  if (input) {
    // console.log("LOAD", input)
    // input.setCustomValidity("Name already exists")
    // input.reportValidity()
    input.addEventListener("input", () => {
      input.setCustomValidity("");
      input.checkValidity();
    });
  }
});

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

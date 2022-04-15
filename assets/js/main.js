const debounce = (callback, delay) => {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(callback, delay);
  };
};

htmx.onLoad(() => {
  const inputs = document.querySelectorAll("[data-preview-target]");
  inputs.forEach((input) => {
    const previewTarget = input.dataset.previewTarget;
    input.oninput = debounce(() => {
      document.getElementById(previewTarget).src = "";
      document.getElementById(previewTarget).src = input.value;
    }, 200);
  });
})


document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    const dialog = document.querySelector('dialog[open]');
    if (dialog) htmx.trigger(".dialog-close", "click");
  }
})

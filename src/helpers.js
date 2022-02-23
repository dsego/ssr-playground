export function getForm(ctx) {
  const form = {};
  if (request?.hasBody) {
    const body = request.body();
    if (body.type === "form") {
      const urlencoded = await body.value;
      for (const [key, value] of urlencoded) {
        form[key] = value;
      }
    }
  }
  return form;
}


// decode form body as URLSearchParams and trim the values
export async function getForm(ctx) {
  const form = {};
  if (ctx.request?.hasBody) {
    const body = ctx.request.body();
    if (body.type === "form") {
      const urlencoded = await body.value;
      for (const [key, value] of urlencoded) {
        form[key] = String(value).trim();
      }
    }
  }
  return form;
}

export function parseJoiError(joiError) {
  return ({
    [joiError.details[0].context.key]: joiError.details[0].message,
  });
}

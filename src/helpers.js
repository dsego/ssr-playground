import { insane } from "./deps.js";

// decode form body as URLSearchParams and trim the values
export async function getForm(ctx, sanitize = true) {
  const form = {};
  if (ctx.request?.hasBody) {
    const body = ctx.request.body();
    if (body.type === "form") {
      const urlencoded = await body.value;
      for (const [key, value] of urlencoded) {
        const trimmedValue = String(value).trim();
        form[key] = sanitize ? insane(trimmedValue) : trimmedValue;
      }
    }
  }
  return form;
}

// produce HTML input validation attributes from Yup schema
export function validationAttributes(yupSchema) {
  const description = yupSchema.describe();
  const attrs = {};

  for (const name in description.fields) {
    attrs[name] = { type: "text" };
    for (const test of description.fields[name].tests) {
      if (test.name === "email") attrs[name].type = "email";
      else if (test.name === "url") attrs[name].type = "url";
      else if (test.name === "required") attrs[name].required = true;
      else if (test.name === "min") attrs[name].minLength = test.params.min;
      else if (test.name === "max") attrs[name].maxLength = test.params.max;
    }
  }

  return attrs;
}

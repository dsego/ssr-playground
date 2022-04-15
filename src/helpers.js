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

// return error messages keyed by field name
export function parseAjvErrors(errors) {
  return errors.reduce((result, err) => {
    // remove leading slash, eg. "/email" -> "email"
    const propName = err.instancePath.slice(1)
    result[propName] = err.message
    return result
  }, {})
}

// parse the json schema & produce HTML input validation attributes
// TODO: support other formats & attributes
export function validation(jsonSchema, name) {
  const {properties, required: requiredList} = jsonSchema;
  let type = "text"
  if (properties[name].format === "email") type = "email"
  if (properties[name].format === "uri") type = "url"
  const required = requiredList.includes(name)
  const minlength = properties[name].minLength
  const maxlength = properties[name].maxLength

  return {
    type,
    ...(minlength && {minlength}),
    ...(maxlength && {maxlength}),
    required,
  }
}

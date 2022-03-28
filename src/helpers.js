import { JOB_COLORS } from "./constants.js";
import * as store from "./store.js";

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

export const jobColor = (() => {
  let cachedColors = null;
  return async (jobType) => {
    if (!cachedColors) {
      const jobs = await store.profiles.jobs();
      cachedColors = jobs.reduce((acc, job, i) => {
        acc.set(job, JOB_COLORS[i % JOB_COLORS.length]);
        return acc;
      }, new Map());
    }
    return cachedColors.get(jobType);
  };
})();

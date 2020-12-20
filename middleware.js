import { oak } from "./deps.js";

const { Status, isHttpError, isErrorStatus } = oak;

export function errorHandler({ showExtra = false }) {
  return async (ctx, next) => {
    try {
      await next();
      if (isErrorStatus(ctx.response.status)) {
        ctx.throw(ctx.response.status);
      }
    } catch (err) {
      let message = err.message;
      const status = err.status || err.statusCode || Status.InternalServerError;
      const stack = showExtra ? err.stack : undefined;

      if (!isHttpError(err)) {
        message = showExtra ? message : "Internal Server Error";
      }

      ctx.response.status = err.status;

      if (ctx.request.accepts("json")) {
        ctx.response.type = "json";
        ctx.response.body = { message, status, stack };
      } else {
        ctx.response.type = "text/plain";
        ctx.response.body = `${status} ${message}\n\n${stack ?? ""}`;
      }
    }
  };
}

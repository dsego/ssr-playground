import { oak } from "../deps.js";
import * as store from "../store.js";
import { getForm, parseJoiError } from "../helpers.js";
import * as types from "../types.js";
import { RoutePaths } from "../routePaths.js";
import { MemberForm } from "../components/MemberForm.jsx";

export const router = new oak.Router()
  .use(RoutePaths.MEMBER.EDIT, bindMember)
  .get(RoutePaths.MEMBER.EDIT, memberEdit)
  .post(RoutePaths.MEMBER.EDIT, memberPost)
  .delete(RoutePaths.MEMBER.EDIT, memberDelete);

export async function bindMember(ctx, next) {
  const pid = ctx.params.id === "new" ? null : ctx.params.id;
  if (pid) {
    ctx.member = await store.members.findBy("pid", ctx.params.id);
    if (!ctx.member) ctx.throw(404);
  }
  return next();
}

export async function memberDelete(ctx) {
  await store.members.delete(ctx.member.pid);
  ctx.response.headers.set("HX-Redirect", RoutePaths.MEMBER.LIST);
  return;
}

export async function memberEdit(ctx) {
  const emptyForm = {
    name: "",
    email: "",
    avatar: "",
  };
  await ctx.render(
    <MemberForm
      member={ctx.member}
      form={ctx.member ?? emptyForm}
    />,
  );
}

export async function memberPost(ctx) {
  let fieldError = null;
  let success = false;
  const pid = ctx.member?.pid ?? null;

  const form = await getForm(ctx);
  const { error } = types.Member.validate(form);
  if (error) {
    fieldError = parseJoiError(error);
  } else {
    try {
      if (pid) {
        await store.members.update(pid, form);
      } else {
        store.members.create(pid, form);
        ctx.response.headers.set("HX-Redirect", RoutePaths.MEMBER.LIST);
        return;
      }
      success = true;
    } catch (err) {
      fieldError = {
        [err.key]: err.message,
      };
    }
  }

  await ctx.render(
    <MemberForm
      member={ctx.member}
      form={form}
      error={fieldError}
      success={success}
    />,
  );
}

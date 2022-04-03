import { insane, oak } from "../deps.js";
import * as store from "../store.js";
import { getForm, parseJoiError } from "../helpers.js";
import * as types from "../types.js";
import { RoutePaths } from "../routePaths.js";
import { ProfileForm } from "../components/ProfileForm.jsx";

export const router = new oak.Router()
  .use(RoutePaths.PROFILE.EDIT, bindProfile)
  .get(RoutePaths.PROFILE.EDIT, editView)
  .post(RoutePaths.PROFILE.EDIT, postAction)
  .delete(RoutePaths.PROFILE.EDIT, deleteAction);

export async function bindProfile(ctx, next) {
  const pid = ctx.params.id === "new" ? null : ctx.params.id;
  if (pid) {
    ctx.profile = await store.profiles.findBy("pid", ctx.params.id);
    if (!ctx.profile) ctx.throw(404);
  }
  return next();
}

export async function deleteAction(ctx) {
  await store.profiles.delete(ctx.profile.pid);
  ctx.response.headers.set("HX-Redirect", RoutePaths.PROFILE.LIST);
  return;
}

export async function editView(ctx) {
  const emptyForm = {
    name: "",
    email: "",
    avatar: "",
  };
  await ctx.render(
    <ProfileForm
      profile={ctx.profile}
      form={ctx.profile ?? emptyForm}
    />,
  );
}

export async function postAction(ctx) {
  let fieldError = null;
  let success = false;
  const pid = ctx.profile?.pid ?? null;

  const form = await getForm(ctx);
  form.bio = insane(form.bio); // sanitize HTML!

  const { error } = types.Profile.validate(form);
  if (error) {
    fieldError = parseJoiError(error);
  } else {
    try {
      if (pid) {
        await store.profiles.update(pid, form);
      } else {
        store.profiles.create(pid, form);
        ctx.response.headers.set("HX-Redirect", RoutePaths.PROFILE.LIST);
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
    <ProfileForm
      profile={ctx.profile}
      form={form}
      error={fieldError}
      success={success}
    />,
    { partial: ctx.request.headers.has("HX-Request") },
  );
}

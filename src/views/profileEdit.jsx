import { insane, oak } from "../deps.js";
import { ajv } from "../ajv.js"
import * as store from "../store.js";
import { getForm, parseAjvErrors } from "../helpers.js";
import * as types from "../types.js";
import { ProfileForm } from "../components/ProfileForm.jsx";

export const router = new oak.Router()
  .use("/profiles/edit/:id", bindProfile)
  .get("/profiles/edit/:id", editView)
  .post("/profiles/edit/:id", postAction)
  .delete("/profiles/edit/:id", deleteAction);

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
  ctx.response.headers.set("HX-Redirect", "/profiles");
  return;
}

export async function editView(ctx) {
  const emptyForm = {
    name: "",
    email: "",
    avatar: "",
  };
  console.log(types.Profile);
  await ctx.render(
    <dialog-backdrop>
      <dialog open>
        <ProfileForm
          animateOpen
          profile={ctx.profile}
          form={ctx.profile ?? emptyForm}
        />
      </dialog>
    </dialog-backdrop>,
  );
}

export async function postAction(ctx) {
  let fieldError = null;
  let success = false;
  const pid = ctx.profile?.pid ?? null;
  let newProfile = null;

  const form = await getForm(ctx);

  // sanitize HTML!
  form.bio = insane(form.bio);


  const valid = ajv.validate(types.ProfileType, form)

  if (!valid) {
    fieldError = parseAjvErrors(ajv.errors)
  } else {
    try {
      if (pid) {
        await store.profiles.update(pid, form);
      } else {
        newProfile = await store.profiles.create(pid, form);
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
      profile={ctx.profile ?? newProfile}
      form={form}
      error={fieldError}
      success={success}
    />,
  );
}

/** @jsx h */
/** @jsxFrag Fragment */

import { oak, Yup } from "../../deps.js";

import { getForm } from "../../helpers.js";
import * as types from "../../types.js";
import { ProfileForm } from "../../partials/ProfileForm.jsx";
import { Icon } from "../../partials/Icon.jsx";

export const router = new oak.Router()
  .use("/profiles/edit/:id", bindProfile)
  .get("/profiles/edit/:id", editView)
  .post("/profiles/edit/:id", postAction)
  .delete("/profiles/edit/:id", deleteAction);

export async function bindProfile(ctx, next) {
  const pid = ctx.params.id === "new" ? null : ctx.params.id;
  if (pid) {
    ctx.state.profile = await ctx.store.findBy(
      "pid",
      ctx.params.id,
    );
    if (!ctx.state.profile) ctx.throw(404);
  }
  await next();
}

export async function deleteAction(ctx) {
  await ctx.store.delete(ctx.state.profile.pid);
  ctx.response.headers.set("HX-Redirect", "/profiles");
}

export async function editView(ctx) {
  await ctx.render(
    <dialog-backdrop id="edit-profile-dialog">
      <dialog open>
        <Icon
          class="dialog-close"
          size="1.5rem"
          name="cancel"
          role="button"
          hx-get=""
          hx-target="body"
          hx-include="[data-filter], [data-offset]"
        />
        <dialog-inner>
          <ProfileForm
            animateOpen
            jobOptions={await ctx.store.jobs()}
            profile={ctx.state.profile}
            form={ctx.state.profile ?? {}}
          />
        </dialog-inner>
      </dialog>
    </dialog-backdrop>,
  );
}

export async function postAction(ctx) {
  let fieldError = null;
  let success = false;
  const pid = ctx.state.profile?.pid ?? null;
  let newProfile = null;

  const form = await getForm(ctx);

  try {
    types.Profile.validateSync(form);
    if (pid) {
      await ctx.store.update(pid, form);
    } else {
      newProfile = await ctx.store.create(form);
    }
    success = true;
  } catch (err) {
    if (err instanceof Yup.ValidationError) {
      fieldError = {
        [err.path]: err.errors[0],
      };
    } else {
      fieldError = {
        [err.key]: err.message,
      };
    }
  }

  await ctx.render(
    <ProfileForm
      profile={ctx.state.profile ?? newProfile}
      jobOptions={await ctx.store.jobs()}
      form={form}
      error={fieldError}
      success={success}
    />,
  );
}

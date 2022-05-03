/** @jsx h */
/** @jsxFrag Fragment */

import { insane, oak } from "../../deps.js";
import { ajv } from "../../ajv.js";
import { getForm, parseAjvErrors } from "../../helpers.js";
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
    ctx.state.profile = await ctx.state.profileStore.findBy(
      "pid",
      ctx.params.id,
    );
    if (!ctx.state.profile) ctx.throw(404);
  }
  await next();
}

export async function deleteAction(ctx) {
  await ctx.state.profileStore.delete(ctx.state.profile.pid);
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
            jobOptions={await ctx.state.profileStore.jobs()}
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

  // sanitize HTML
  for (const key in form) {
    form[key] = insane(form[key]);
  }

  const valid = ajv.validate(types.ProfileType, form);

  if (!valid) {
    fieldError = parseAjvErrors(ajv.errors);
  } else {
    try {
      if (pid) {
        await ctx.state.profileStore.update(pid, form);
      } else {
        newProfile = await ctx.state.profileStore.create(form);
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
      profile={ctx.state.profile ?? newProfile}
      jobOptions={await ctx.state.profileStore.jobs()}
      form={form}
      error={fieldError}
      success={success}
    />,
  );
}

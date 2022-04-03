import { cx } from "../deps.js";
import { FormField } from "./FormField.jsx";
import { RoutePaths } from "../routePaths.js";
import * as store from "../store.js";

export async function ProfileForm({ profile, form = {}, error, success }) {
  return (
    <form
      id="profile-form"
      hx-post=""
      hx-target="#profile-form"
      hx-swap="outerHTML"
    >
      <FormField
        name="name"
        label="Name"
        type="text"
        value={form.name}
        errorMsg={error?.name}
      />
      <FormField
        name="email"
        label="Email"
        type="email"
        value={form.email}
        errorMsg={error?.email}
      />
      <FormField
        name="job"
        label="Job"
        type="text"
        value={form.job}
        errorMsg={error?.job}
        options={await store.profiles.jobs()}
      />
      <FormField
        name="avatar"
        label="Avatar"
        type="url"
        value={form.avatar}
        errorMsg={error?.avatar}
        data-preview-target="avatar-preview"
      >
        <img
          id="avatar-preview"
          src={form.avatar}
          width="100"
          height="100"
        />
      </FormField>
      <FormField
        name="bio"
        label="Short Bio"
        type="textarea"
        value={form.bio}
        errorMsg={error?.bio}
      />
      <p>
        <a href={RoutePaths.PROFILE.LIST}>Close</a>
        <button class={cx(success && "button-success")}>
          Save
        </button>
        {profile?.pid && (
          <button
            hx-confirm="Are you sure?"
            hx-delete={RoutePaths.PROFILE.EDIT.replace(":id", profile.pid)}
            hx-target="body"
          >
            Delete
          </button>
        )}
      </p>
    </form>
  );
}

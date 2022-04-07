import { cx } from "../deps.js";
import { LoadingIndicator } from "./LoadingIndicator.jsx";
import { FormField } from "./FormField.jsx";
import { Icon } from "./Icon.jsx";
import * as store from "../store.js";

export async function ProfileForm({
  animateOpen=false,
  profile,
  form = {},
  error,
  success
}) {
  return (
    <form
      id="profile-form"
      class="edit-form"
      hx-post={`/profiles/edit/${profile?.pid ?? "new"}`}
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
        name="city"
        label="City"
        type="text"
        value={form.city}
        errorMsg={error?.city}
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
      <div class="profile-form-footer">
        {profile?.pid && (
          <button
            hx-confirm="Are you sure?"
            hx-delete={`/profiles/edit/${profile?.pid ?? "new"}`}
            hx-target="body"
            class="delete-button"
          >
            Delete
          </button>
        )}
        <button class={cx("button-save", success && "button-success")}>
          <LoadingIndicator class="button-center-content" />
          <Icon name="check" class="button-center-content" />
          <span class="text-label">Save</span>
        </button>
      </div>
    </form>
  );
}

/** @jsx h */
/** @jsxFrag Fragment */

import { cx } from "../deps.js";
import { LoadingIndicator } from "./LoadingIndicator.jsx";
import { FormField } from "./FormField.jsx";
import { Icon } from "./Icon.jsx";
import { validation } from "../helpers.js";
import { ProfileType } from "../types.js";

export async function ProfileForm({
  profile,
  jobOptions,
  form = {},
  error,
  success,
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
        placeholder="full name"
        value={form.name}
        errorMsg={error?.name}
        {...validation(ProfileType, "name")}
      />
      <FormField
        name="email"
        label="Email"
        placeholder="address@example.com"
        value={form.email}
        errorMsg={error?.email}
        {...validation(ProfileType, "email")}
      />
      <FormField
        name="job"
        label="Job"
        placeholder="job type"
        value={form.job}
        errorMsg={error?.job}
        options={jobOptions}
        {...validation(ProfileType, "job")}
      />
      <FormField
        name="city"
        label="City"
        placeholder="city name"
        value={form.city}
        errorMsg={error?.city}
        {...validation(ProfileType, "city")}
      />
      <FormField
        name="avatar"
        label="Avatar"
        placeholder="image url"
        value={form.avatar}
        errorMsg={error?.avatar}
        data-preview-target="avatar-preview"
        {...validation(ProfileType, "avatar")}
      >
        <img
          id="avatar-preview"
          class="avatar-preview"
          src={form.avatar}
          width="100"
          height="100"
        />
      </FormField>
      <FormField
        name="bio"
        label="Short Bio"
        placeholder="short bio in markdown format"
        value={form.bio}
        errorMsg={error?.bio}
        {...validation(ProfileType, "bio")}
        type="textarea"
      />
      <div class="dialog-form-footer">
        {profile?.pid && (
          <button
            type="button"
            hx-confirm="Are you sure?"
            hx-delete={`/profiles/edit/${profile?.pid ?? "new"}`}
            hx-target="body"
            class="delete-button"
          >
            Delete
          </button>
        )}
        <button class={cx("save-button ml-auto", success && "button-success")}>
          <LoadingIndicator class="self-center" />
          <Icon name="check" class="self-center" />
          <span class="text-label">Save</span>
        </button>
      </div>
    </form>
  );
}

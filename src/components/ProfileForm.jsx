import { cx } from "../deps.js";
import { FormField } from "./FormField.jsx";
import { RoutePaths } from "../routePaths.js";

export function ProfileForm({ profile, form = {}, error, success }) {
  return (
    <form id="test-form" hx-post="">
      <pre>
        TODO: - avatar (input + preview) - job type (dropdown - autocomplete) -
        bio (markdown + preview)
      </pre>
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
        name="avatar"
        label="Avatar"
        type="url"
        value={form.avatar}
        errorMsg={error?.avatar}
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

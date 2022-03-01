import { Avatar, Identicon } from "./common.jsx";
import { FormField } from "./form.jsx";
import { Routes } from "../routes.jsx";
import { cx } from "../helpers.js";

export function UserAvatar({ user }) {
  return (
    <>
      {user.avatar
        ? <Avatar url={user.avatar} />
        : <Identicon username={user.username ?? ""} />}
    </>
  );
}

export function UserCard({ user }) {
  return (
    <user-card>
      <p>{user.username}</p>
      <p>
        <small>{user.name}</small>
      </p>
      <UserAvatar user={user} />
      <p>
        <a href={Routes.USER.VIEW.replace(":id", user.pid)}>View</a>
        <a href={Routes.USER.EDIT.replace(":id", user.pid)}>Edit</a>
      </p>
    </user-card>
  );
}

export function UserForm({ user, form, error, success }) {
  return (
    <form id="test-form" hx-post="" hx-target="#test-form">
      <FormField
        name="username"
        label="Username"
        type="text"
        value={form.username ?? user.username}
        errorMsg={error?.username}
      />
      <FormField
        name="email"
        label="Email"
        type="email"
        value={form.email ?? user.email}
        errorMsg={error?.email}
      />
      <FormField
        name="avatar"
        label="Avatar"
        type="url"
        value={form.avatar ?? user.avatar}
        errorMsg={error?.avatar}
      />
      <p>
        <a href={Routes.USER.LIST}>Close</a>
        <button class={cx(success && "button-success")}>
          Save
        </button>
        {user.pid && (
          <button
            hx-confirm="Are you sure?"
            hx-delete={Routes.USER.EDIT.replace(":id", user.pid)}
            hx-target="body"
          >
            Delete
          </button>
        )}
      </p>
    </form>
  );
}

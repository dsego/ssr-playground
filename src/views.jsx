import {oak} from "./deps.js";
import * as store from "./store.js";
import { getForm, cx } from "./helpers.js";
import * as types from "./types.js";

function UserCard({ user }) {
  return (
    <user-card>
      <p>{user.username}</p>
      <p>
        <small>{user.name}</small>
      </p>
      <p>
        <img src={user.avatar} />
      </p>
      <p>
        <a href={`/users/${user.pid}`}>View</a>
        <a href={`/users/edit/${user.pid}`}>Edit</a>
      </p>
    </user-card>
  )
}

export async function UserSearch({ ctx }) {
  const query = oak.helpers.getQuery(ctx);
  let users = []

  if (query.search) {
    users = await store.users.fuzzy(query.search);
  } else {
    users = await store.users.list();
  }

  return (
    <>
      {!users.length && <i>no results</i>}
      {users.map((user) => (<UserCard user={user} />))}
    </>
  )
}

export async function UserList({ ctx }) {
  const users = await store.users.list();
  return (
    <>
      <input
        type="search"
        name="search" placeholder="Begin Typing To Search Users..."
        hx-get="/users/search"
        hx-trigger="keyup changed delay:200ms, search"
        hx-target="user-list"
      />
      <user-list>
        {users.map((user) => (<UserCard user={user} />))}
      </user-list>
    </>
  );
}

export async function UserDetails({ ctx }) {
  const user = await store.users.findBy("pid", ctx.params.id);

  if (!user) {
    return <>Not found</>;
  }

  return (
    <>
      <p>{user.username}</p>
      <p>
        <img src={user.avatar} />
      </p>
    </>
  );
}

export async function UserEdit({ ctx }) {
  // empty
  let user = {
    name: "",
    email: "",
  }
  const pid = ctx.params.id === 'new' ? null : ctx.params.id;

  if (pid) {
    user = await store.users.findBy("pid", ctx.params.id);
    if (!user) {
      return <>Not found</>;
    }
  }

  let form = {};
  let validation = null;

  if (ctx.request.method === "POST") {
    form = await getForm(ctx);
    validation = types.User.partial().safeParse(form);
    if (validation.success) {
      await store.users.save(pid, form);
      if (!pid) {
        ctx.response.headers.set('HX-Redirect', '/users');
      }
    }
  } else if (ctx.request.method === "DELETE") {
    await store.users.delete(pid);
    ctx.response.headers.set('HX-Redirect', '/users');
  }

  return (
    <UserForm
      user={user}
      form={form}
      validation={validation}
    />
  )
}

function UserForm({ user, form, validation }) {
  let errors = null
  if (validation && !validation.success) {
    errors = validation.error.flatten()
  }

  return (
    <form id="test-form" hx-post="" hx-target="#test-form">
      <label for="name">Name</label>
      <input id="name" name="name" type="text" value={form.name ?? user.name} />
      <p>{errors?.fieldErrors.name}</p>
      <label for="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        value={form.email ?? user.email}
        class={cx(
          errors?.fieldErrors.email && 'input-error'
        )}
      />
      <p>{errors?.fieldErrors.email}</p>
      <a href="/users">Cancel</a>
      <button
        class={cx(
          validation?.success && 'button-success'
        )}
      >
        Save
      </button>
      <button
        hx-confirm="Are you sure?"
        hx-delete={`/users/edit/${user.pid}`}
        hx-target="body"
      >
        DEL
      </button>
    </form>
  );
}

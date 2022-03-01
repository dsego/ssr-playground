import { oak } from "./deps.js";
import * as store from "./store.js";
import { cx, getForm } from "./helpers.js";
import * as types from "./types.js";
import { Routes } from "./routes.jsx";
import { UserCard, UserForm } from "./components/user.jsx";

const parseJoiError = (joiError) => ({
  [joiError.details[0].context.key]: joiError.details[0].message,
});

export async function UserSearch({ ctx }) {
  const query = oak.helpers.getQuery(ctx);
  let users = [];

  if (query.search) {
    users = await store.users.search(query.search);
  } else {
    users = await store.users.list();
  }

  return (
    <>
      {!users.length && <i>no results</i>}
      {users.map((user) => <UserCard user={user} />)}
    </>
  );
}

export async function UserList({ ctx }) {
  const users = await store.users.list();
  return (
    <>
      <input
        type="search"
        name="search"
        placeholder="Begin Typing To Search Users..."
        hx-get={Routes.USER.SEARCH}
        hx-trigger="keyup changed delay:200ms, search"
        hx-target="user-list"
      />
      <user-list>
        {users.map((user) => <UserCard user={user} />)}
      </user-list>
      <a href={Routes.USER.EDIT.replace(":id", "new")}>
        <button>+ Add</button>
      </a>
    </>
  );
}

export async function UserDetails({ ctx }) {
  const user = await store.users.findBy("pid", ctx.params.id);

  if (!user) {
    ctx.throw(404);
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
  const pid = ctx.params.id === "new" ? null : ctx.params.id;

  // empty
  let user = {
    username: "",
    email: "",
    avatar: "",
  };

  if (pid) {
    user = await store.users.findBy("pid", ctx.params.id);
    if (!user) {
      ctx.throw(404);
    }
  }

  if (ctx.request.method === "DELETE") {
    await store.users.delete(pid);
    ctx.response.headers.set("HX-Redirect", Routes.USER.LIST);
    return;
  }

  let form = {};
  let fieldError = null;
  let success = false;

  if (ctx.request.method === "POST") {
    form = await getForm(ctx);
    const { error } = types.User.validate(form);
    if (error) {
      fieldError = parseJoiError(error);
    } else {
      try {
        await store.users.save(pid, form);
        if (!pid) {
          ctx.response.headers.set("HX-Redirect", Routes.USER.LIST);
        }
        success = true;
      } catch (err) {
        fieldError = {
          [err.key]: err.message,
        };
      }
    }
  }

  return (
    <UserForm
      user={user}
      form={form}
      error={fieldError}
      success={success}
    />
  );
}

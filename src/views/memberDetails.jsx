import * as store from "../store.js";

export async function UserDetails({ ctx }) {
  const user = await store.users.findBy("pid", ctx.params.id);

  if (!user) ctx.throw(404);

  return (
    <>
      <p>{user.username}</p>
      <p>
        <img src={user.avatar} />
      </p>
    </>
  );
}

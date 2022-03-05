import * as store from "../store.js";

export async function MemberDetails({ ctx }) {
  const member = await store.members.findBy("pid", ctx.params.id);

  if (!member) ctx.throw(404);

  return (
    <>
      <h3>{member.name}</h3>
      <p>
        <img src={member.avatar} />
      </p>
    </>
  );
}

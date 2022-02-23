import * as store from './store.js'

export async function UserList({ ctx }) {
  const users = await store.users.list();
  return (
    <user-list>
      {users.map((user) => (
        <div>
          <p>{ user.username }</p>
          <p><img src={user.avatar} /></p>
          <p><a href={`/users/${user.pid}`}>View</a></p>
        </div>
      ))}
    </user-list>
  );
}

export async function UserDetails({ ctx }) {
  const user = await store.users.findBy('pid', ctx.params.id);

  if (!user) {
    return <>Not found</>
  }

  return (
    <>
      <p>{ user.username }</p>
      <p><img src={user.avatar} /></p>
    </>
  );
}

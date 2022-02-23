import {UserDetails, UserList} from './components.jsx'

export default {
  "/users/:id": async (ctx) => <UserDetails ctx={ctx} />,
  "/users": async (ctx) => <UserList ctx={ctx} />,
  "/": () => <>hello world</>,
}

import { UserDetails, UserEdit, UserList, UserSearch } from "./views.jsx";

export default {
  "/users/search": async (ctx) => <UserSearch ctx={ctx} />,
  "/users/edit/:id": async (ctx) => <UserEdit ctx={ctx} />,
  "/users/:id": async (ctx) => <UserDetails ctx={ctx} />,
  "/users": async (ctx) => <UserList ctx={ctx} />,
  "/": () => <>hello world!</>,
  "/(.*)": () => <>404 - not found</>,
};

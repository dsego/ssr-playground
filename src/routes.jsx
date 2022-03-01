import { UserDetails, UserEdit, UserList, UserSearch } from "./views.jsx";

export const Routes = {
  USER: {
    SEARCH: "/users/search",
    EDIT: "/users/edit/:id",
    VIEW: "/users/:id",
    LIST: "/users",
  },
  HOME: "/",
  NOT_FOUND: "(.*)",
};

export default {
  [Routes.USER.SEARCH]: async (ctx) => <UserSearch ctx={ctx} />,
  [Routes.USER.EDIT]: async (ctx) => <UserEdit ctx={ctx} />,
  [Routes.USER.VIEW]: async (ctx) => <UserDetails ctx={ctx} />,
  [Routes.USER.LIST]: async (ctx) => <UserList ctx={ctx} />,
  [Routes.HOME]: () => <>hello world!</>,
  [Routes.NOT_FOUND]: (ctx) => {
    ctx.response.status = 404;
    return <>404 - not found</>;
  },
};

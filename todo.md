# TODO

user crud
---------------------------------
user list page w/ paging
user list fragment
list component (pagination, sorting)
user details page (edit, delete)
user form fragment
form input components
  <Password />
  <Username />
  <Avatar />
  <Button />
  ...


optional
--------------------------
auto form (based on DTO)
auto input field (based on DTO)
auto table/list w/ search & filters (based on DTO)
auto card grid


make pages/fragments end with  .page.jsx or .frag.jsx ?

<ItemList
  source={getAllUsers}
  item={<UserItem />}
  paginate={10}
/>


<UserItem /> -> edit action -> inline fragment <UserForm /> (or new details page)


# NOTES
------------------------------
use custom tags
https://dev.to/jfbrennan/custom-html-tags-4788








https://3perf.com/blog/link-rels/


==================



export default function Clicked({ form }) {
  const x = Math.random();
  const message = form?.message ?? "";

  return (
    <form id="test-form" hx-post="/fragments/clicked" hx-swap="outerHTML">
      <small>{x}</small>
      <br />
      <input
        id="some-input"
        name="message"
        type="text"
        placeholder="Test"
        value={message}
      />
      <br />
      <pre>
        {message}
      </pre>
      <hr />
      <button type="submit">
        Click Me!!!
      </button>
    </form>
  );
}

// ctx.redirect('/sign-in');
// redirect to named route
// ctx.redirect(ctx.router.url('sign-in'));
// ctx.status = 301;

// const query = oak.helpers.getQuery(ctx);

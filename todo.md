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




DTO - types via superstruct
--------------------------------------
- string -> text input
- username -> text input
- email  -> email input, validates email  -> use pattern(string(), /\d+/)
- money
- url
- credit card
- telephone  -> tel input, validates phone
- color   -> color input
- date   -> date input
- file ?
- password -> password (strength, etc)
- range (min, max, step)
- number
- option (chk, select, radio)
- multiple options, array
- boolean -> checkbox or toggle





https://3perf.com/blog/link-rels/


==================

store.get('user', id)

methods receives dto or id, opts which fields to include + side load relations
have paging

common methods, findBy, all, create (upsert), update, delete, softDelete, fuzzy search





serve partial jsx from page based on route match???

you can then request a specific jsx node by id

eg /path/route/ ???

if (HX-Request and HX-Target) {

  ```
  renderJSX(
    h(pageComponent, {
      request,
      query,
      form,
    }), {
      select: '#target-element-id'
    }
  );
  ```

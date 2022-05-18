### SSR Playground: Deno & HTMX

[Live demo!](https://ssr-playground.deno.dev)

This is an experiment in building a CRUD-type web UI with server-side JSX components and HTMX for a SPA-like experience.

#### JSX routes

Route callbacks directly render jsx:

```jsx
router.get("/page", (ctx) => {
    await ctx.render(
      <SomeComponent />,
    );
});
```

#### JSX partials

Partials/components are **async jsx functions**:
- they can do async work, load data from the database or an external API
- no need to prop drill data from the view/controller because a footer needs some data
- looser coupling makes it easier to maintain

```
async function MyLikes() {
    return <div>Likes: {await db.likes.count()}</div>
}
```

#### Dynamic behavior with HTMX

With HTMX it's possible to build interactive UIs without writing javascript.
For example, to search as the user enters text we add `hx-` attributes to the search input.

```html
<input
  type="search"
  name="search"
  placeholder="Search..."
  hx-get="/profiles/listonly"
  hx-trigger="keyup changed delay:200ms, search"
  hx-target="#profile-list"
  hx-include="[data-filter]"
  hx-indicator="#loading-indicator"
  data-filter
/>
```

#### Schema & native HTML validation

**Yup** is a great library for schema validation. It provides an easy way to generate native HTML5 input validation attributes from the type schema via `schema.describe()`.
We can use the same schema object to validate HTTP requests and have real-time form validation.

```js
Yup.object({
  email: Yup.string().email().required()
})

// validate HTTP request on the backend
try {
  obj.validateSync(form);
  await ctx.store.create(form);
} catch (err) {
  if (err instanceof Yup.ValidationError) {
    // ...
  }
}
```

HTML5 input attributes for inline validation.
```html
<input type="email" required />
```


#### Custom HTML tags

We don't need to use div-tags for everything. The custom UI components in this project render custom tags for meaningful and readable html.

`<div class="profile-card"></div>` becomes `<profile-card></profile-card>`

Like styled-components in the react world, custom HTML tags give us a unique component name to target in our CSS, but without a need for any additional pre-processing or JS code.

```css
profile-card {
  display: block;
  white-space: nowrap;
}
```


#### CSS classes

CSS classes are used for reusable mixins/utils, eg 'card with shadow',
```html
<profile-card class="card-w-shadow"></profile-card>
```

or conditional styles:
```jsx
<button class={cx("save-button", success && "button-success")} />
```

#### Tagged SQL

Simple & easy to construct dynamic SQL commands, no ORM to learn. Interpolated values are converted to prepared statements.
```js
const query = sql`SELECT * FROM table WHERE col=${value}`
```


#### Libraries

* Deno - javascript runtime
http://deno.land

* Oak - middleware framework for Deno’s native HTTP server
https://oakserver.github.io/oak/

* HTMX - tools for HTML interfaces
http://htmx.org

* Yup - value parsing and validation
https://github.com/jquense/yup

* Iconoir - icon library
https://iconoir.com

* Faker
https://fakerjs.dev/

* ssr_jsx - JSX library for server-side rendering
https://github.com/dsego/ssr_jsx

* sql_tag - tagged template literals for SQL statements
https://github.com/dsego/sql_tag


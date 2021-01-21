import { h } from "../../deps.js";
import Foo from "../../components/Foo.jsx";

export default function UserList(props) {
  console.log(props);

  let message = "";
  // const query = oak.helpers.getQuery(ctx);

  // if (request.hasBody) {
  //   const body = request.body();
  //   if (body.type === "form") {
  //     let form = await body.value;
  //     message = form.get('message')
  //   }
  // }

  const x = Math.random();

  return (
    <form hx-post="/controls/clicked" hx-swap="outerHTML">
      <input name="message" type="text" value="" placeholder="Test" />
      <b>{x}</b>
      <pre>
        {message}
      </pre>
      <hr />
      <Foo />
      <button type="submit">
        Click Me
      </button>
    </form>
  );
}

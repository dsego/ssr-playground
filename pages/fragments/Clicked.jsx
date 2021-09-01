/** @jsx h */
/** @jsxFrag Fragment */
import { h } from "../../deps.js";

export default async function Clicked({ request }) {

  let message = "";

  if (request?.hasBody) {
    const body = request.body();
    if (body.type === "form") {
      let form = await body.value;
      message = form.get('message')
    }
  }
  const x = Math.random();

  return (
    <form hx-post="/fragments/clicked" hx-swap="outerHTML">
      <small>{x}</small>
      <br />
      <input name="message" type="text" value={message} placeholder="Test" />
      <br />
      <pre>
        {message}
      </pre>
      <hr />
      <button type="submit">
        Click Me
      </button>
    </form>
  )
}

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

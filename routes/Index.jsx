import Clicked from "./fragments/Clicked.jsx";

export default function Index({ query }) {
  return (
    <div>
      <h1>Hello Users!!</h1>
      <Clicked />
      <p>
        <code>{JSON.stringify(query)}</code>
      </p>
    </div>
  );
}

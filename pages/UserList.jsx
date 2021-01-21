import { h } from "../deps.js";
import Wrapper from "../components/Wrapper.jsx";
import Foo from "../components/Foo.jsx";
import Clicked from "./controls/Clicked.jsx";

export default function UserList(props) {
  return (
    <Wrapper title="User List">
      <h1>User List 2</h1>
      <Foo />
      <p><code>{JSON.stringify(props.query)}</code></p>
      <Clicked />
    </Wrapper>
  );
}

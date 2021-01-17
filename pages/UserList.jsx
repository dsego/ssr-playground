import { h } from "../deps.js";
import Foo from "../components/Foo.jsx"

export default function UserList(props) {
  return (<div>
    <h1>Hello Users!!</h1>
    <Foo />
    <p><code> {JSON.stringify(props.query)} </code></p>
  </div>)
}

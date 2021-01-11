import { connect } from "../deps.js"

// TODO  load options from a config file
export const db = await connect({
  type: "sqlite",
  database: "db.sqlite3",
});

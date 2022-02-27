import { nanoid, sql, Sqlite } from "./deps.js";
import * as types from "./types.js";

const db = new Sqlite("./test.db");
addEventListener("unload", () => db.close());

const entries = async ({ query, params }) => db.queryEntries(query, params);
const exec = async ({ query, params }) => db.query(query, params);

export const users = {
  async list(options) {
    let query = sql`SELECT * FROM user`;

    if (options?.filter) {
      // query.append(``)
    }

    if (options?.order) {
      // query.append(`ORDER BY ${sql.identifier()}`)
    }

    if (options?.limit) {
    }

    if (options?.offset) {
    }

    return entries(query);
  },

  async findBy(key, value) {
    const query = sql`SELECT * FROM user WHERE ${sql.identifier(key)}=${value}`;
    const rows = await entries(query);
    return !!rows.length ? rows[0] : null;
  },

  async save(pid, data) {
    if (pid) {
      const query = sql`UPDATE user SET ${
        sql.join(
          Object.entries(data).map(([prop, value]) =>
            sql`${sql.identifier(prop)} = ${data[prop]}`
          ),
          ", ",
        )
      } WHERE pid = ${pid}`;
      return exec(query);
    }

    // yikes
    data.pid = nanoid();
    const cols = Object.keys(data).map((val) => sql`${sql.identifier(val)}`);
    const values = Object.values(data);

    const query = sql`INSERT INTO user (${sql.join(cols, ", ")})
      VALUES ${values}`;
    return exec(query);
  },

  async delete(pid) {
    const query = sql`DELETE FROM user WHERE pid = ${pid}`;
    return exec(query);
  },

  async fuzzy(search) {
    let term = `%${search}%`;
    const query = sql`SELECT * FROM user WHERE
      name LIKE ${term} OR
      username LIKE ${term} OR
      email LIKE ${term}
    `;
    return entries(query);
  }

};

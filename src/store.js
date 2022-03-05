import { nanoid, sql, Sqlite } from "./deps.js";

const db = new Sqlite("./test.db");
addEventListener("unload", () => db.close());

const entries = async ({ query, params }) => db.queryEntries(query, params);
const exec = async ({ query, params }) => db.query(query, params);

const UniqueErrorLookup = {
  "UNIQUE constraint failed: user.email": {
    key: "email",
    message: "Email already exists",
  },
};

export const users = {
  async list(options) {
    let query = sql`SELECT * FROM user`;

    if (options?.filter) {
      // TODO
    }

    if (options?.order) {
      // TODO
    }

    if (options?.limit) {
      // TODO
    }

    if (options?.offset) {
      // TODO
    }

    return entries(query);
  },

  async findBy(key, value) {
    const query = sql`SELECT * FROM user WHERE ${sql.identifier(key)}=${value}`;
    const rows = await entries(query);
    return !!rows.length ? rows[0] : null;
  },

  async save(pid, data) {
    let query;

    if (pid) {
      query = sql`UPDATE user SET ${
        sql.join(
          Object.entries(data).map(([prop, value]) =>
            sql`${sql.identifier(prop)} = ${data[prop]}`
          ),
          ", ",
        )
      } WHERE pid = ${pid}`;
    } else {
      const newData = { ...data };

      // TODO: handle conflict
      newData.pid = nanoid();
      const cols = Object.keys(newData).map((val) =>
        sql`${sql.identifier(val)}`
      );
      const values = Object.values(newData);
      query = sql`INSERT INTO user (${sql.join(cols, ", ")}) VALUES ${values}`;
    }

    try {
      await exec(query);
    } catch (err) {
      if (err.codeName === "SqliteConstraint") {
        throw UniqueErrorLookup[err.message];
      }
    }
  },

  async delete(pid) {
    const query = sql`DELETE FROM user WHERE pid = ${pid}`;
    return exec(query);
  },

  async search(search) {
    let term = `%${search}%`;
    const query = sql`SELECT * FROM user WHERE
      name LIKE ${term} OR
      email LIKE ${term}
    `;
    return entries(query);
  },
};

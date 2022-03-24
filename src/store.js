import { nanoid, sql, Sqlite } from "./deps.js";

const db = new Sqlite("./test.db");
addEventListener("unload", () => db.close());

const entries = async ({ query, params }) => db.queryEntries(query, params);
const exec = async ({ query, params }) => {
  try {
    await db.query(query, params);
  } catch (err) {
    if (err.codeName === "SqliteConstraint") {
      throw UniqueErrorLookup[err.message];
    }
    throw err;
  }
};

const UniqueErrorLookup = {
  "UNIQUE constraint failed: member.email": {
    key: "email",
    message: "Email already exists",
  },
};

export const members = {
  async list(options) {
    let query = sql`SELECT * FROM member`;

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
    const query = sql`SELECT * FROM member WHERE ${
      sql.identifier(key)
    }=${value}`;
    const rows = await entries(query);
    return !!rows.length ? rows[0] : null;
  },

  async create(data) {
    const newData = { ...data };

    // TODO: handle conflict
    newData.pid = nanoid();
    newData.created_at = new Date();
    newData.updated_at = new Date();

    const cols = Object.keys(newData).map((val) => sql`${sql.identifier(val)}`);
    const values = Object.values(newData);
    const query = sql`INSERT INTO member (${
      sql.join(cols, ", ")
    }) VALUES ${values}`;
    await exec(query);
  },

  async update(pid, data) {
    if (!pid) throw new Error("Missing identifier");

    data.updated_at = new Date();

    const query = sql`UPDATE member SET ${
      sql.join(
        Object.entries(data).map(([prop, value]) =>
          sql`${sql.identifier(prop)} = ${value}`
        ),
        ", ",
      )
    } WHERE pid = ${pid}`;
    await exec(query);
  },

  async delete(pid) {
    const query = sql`DELETE FROM member WHERE pid = ${pid}`;
    return exec(query);
  },

  async search(search) {
    let term = `%${search}%`;
    const query = sql`SELECT * FROM member WHERE
      name LIKE ${term} OR
      email LIKE ${term}
    `;
    return entries(query);
  },
};

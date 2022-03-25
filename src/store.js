import { nanoid, sql, Sqlite } from "./deps.js";

const db = new Sqlite("./test.db");
addEventListener("unload", () => db.close());

const entries = async ({ query, params }) => db.queryEntries(query, params);
const exec = async ({ query, params }) => {
  try {
    const rows = await db.query(query, params);
    return rows;
  } catch (err) {
    if (err.codeName === "SqliteConstraint") {
      throw UniqueErrorLookup[err.message];
    }
    throw err;
  }
};

const UniqueErrorLookup = {
  "UNIQUE constraint failed: profile.email": {
    key: "email",
    message: "Email already exists",
  },
};

export const profiles = {
  async count() {
    const rows = await exec(sql`SELECT COUNT(*) FROM profile`);
    return rows[0][0];
  },

  async list(options) {
    let query = sql`SELECT * FROM profile`;

    if (options?.filter) {
      // TODO
    }

    if (options?.orderAsc) {
      query.append(sql`ORDER BY ${sql.identifier(options.orderAsc)} ASC`);
    }

    if (options?.limit) {
      const offset = options?.offset ?? 0;
      query.append(sql`LIMIT ${options.limit} OFFSET ${offset}`);
    }

    return entries(query);
  },

  async findBy(key, value) {
    const query = sql`SELECT * FROM profile WHERE ${
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
    const query = sql`INSERT INTO profile (${
      sql.join(cols, ", ")
    }) VALUES ${values}`;
    await exec(query);
  },

  async update(pid, data) {
    if (!pid) throw new Error("Missing identifier");

    data.updated_at = new Date();

    const query = sql`UPDATE profile SET ${
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
    const query = sql`DELETE FROM profile WHERE pid = ${pid}`;
    return exec(query);
  },

  async search(search, options) {
    let term = `%${search}%`;
    const query = sql`SELECT * FROM profile WHERE
      name LIKE ${term} OR
      email LIKE ${term}
    `;
    const countQuery = sql`SELECT COUNT(*) FROM (${query})`;
    const countResult = await exec(countQuery);

    if (options?.orderAsc) {
      query.append(sql`ORDER BY ${sql.identifier(options.orderAsc)} ASC`);
    }

    if (options?.limit) {
      const offset = options?.offset ?? 0;
      query.append(sql`LIMIT ${options.limit} OFFSET ${offset}`);
    }

    return [await entries(query), countResult[0][0]];
  },
};

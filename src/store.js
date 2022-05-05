import { nanoid, sql } from "./deps.js";

const UniqueErrorLookup = {
  "UNIQUE constraint failed: profile.email": {
    key: "email",
    message: "Email already exists",
  },
};

export class ProfileStore {
  constructor(db) {
    this.db = db;
  }

  async entries({ query, params }) {
    return this.db.queryEntries(query, params);
  }

  async exec({ query, params }) {
    try {
      const rows = await this.db.query(query, params);
      return rows;
    } catch (err) {
      if (err.codeName === "SqliteConstraint") {
        throw UniqueErrorLookup[err.message];
      }
      throw err;
    }
  }

  async nuke() {
    await this.exec(sql`DELETE FROM profile`);
  }

  async count() {
    const rows = await this.exec(sql`SELECT COUNT(*) FROM profile`);
    return rows[0][0];
  }

  async jobs() {
    const query = sql
      `SELECT DISTINCT job FROM profile_view WHERE job NOT NULL AND trim(job) != ''`;
    const rows = await this.exec(query);
    return rows.map((r) => r[0]);
  }

  async list(options) {
    const query = sql`SELECT * FROM profile_view`;

    if (options?.filter || options?.search) {
      const conditions = Object.entries(options?.filter)
        .filter(([_, val]) => !!val)
        .map(([key, val]) => (
          sql`${sql.identifier(key)} = ${val}`
        ));

      if (options?.search) {
        const term = `%${options.search}%`;
        conditions.push(
          sql`(name LIKE ${term} OR email LIKE ${term})`,
        );
      }

      if (conditions.length) {
        query.append(sql`WHERE ${sql.join(conditions, " AND ")}`);
      }
    }

    const countQuery = sql`SELECT COUNT(*) FROM (${query})`;
    const countResult = await this.exec(countQuery);

    if (options?.orderAsc) {
      query.append(sql`ORDER BY ${sql.identifier(options.orderAsc)} ASC`);
    } else if (options?.orderDesc) {
      query.append(sql`ORDER BY ${sql.identifier(options.orderDesc)} DESC`);
    }

    if (options?.limit) {
      const offset = options?.offset ?? 0;
      query.append(sql`LIMIT ${options.limit} OFFSET ${offset}`);
    }

    return [await this.entries(query), countResult[0][0]];
  }

  async findBy(key, value) {
    const query = sql`SELECT * FROM profile_view WHERE ${
      sql.identifier(key)
    }=${value}`;
    const rows = await this.entries(query);
    return rows.length ? rows[0] : null;
  }

  async create(data) {
    if (!Object.keys(data).length) throw new Error("Missing data");

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
    await this.exec(query);
    return newData;
  }

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
    await this.exec(query);
  }

  async delete(pid) {
    const query = sql
      `UPDATE profile SET deleted_at=${new Date()} WHERE pid = ${pid}`;
    return this.exec(query);
  }
}

// const db = new Sqlite(":memory:");
// await db.query(await Deno.readTextFile(`${Deno.cwd()}/sql/profile.sql`));
// await generateFakeProfiles(profiles, 30);
// console.log(colors.magenta("=> Generated fake data."));

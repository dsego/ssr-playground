// TODO move to deps.js
import { DB } from "https://deno.land/x/sqlite@v2.3.2/mod.ts";

export class Store {
  constructor() {
    this.db = new DB("db/demo.sqlite3");
  }

  // TODO paging, filters, order (maybe separate methods eg getOrdered)
  // TODO make async
  getAll(tablename, options) {
    const rows = this.db.query(`SELECT * FROM ${tablename} LIMIT 1, 50`);
    return rows;
  }

  async findBy(tablename, key, value) {
  }

  async create(tablename, attrs) {
  }

  async update(tablename, id, attrs) {
  }

  async replace(tablename, attrs) {
  }

  async delete(tablename, id) {
  }

  async fuzzySearch(tablename, term) {
  }
}

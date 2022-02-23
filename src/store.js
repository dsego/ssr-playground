import { Sqlite, sql } from "./deps.js";
import * as types from './types.js'


// store.get('user', id)

// methods receives dto or id, opts which fields to include + side load relations
// have paging

// common methods, findBy, all, create (upsert), update, delete, softDelete, fuzzy search


const db = new Sqlite("./test.db");
addEventListener('unload', () => db.close());


const entries = async (query) => db.queryEntries(...query.prepare());
const exec = async (query) => db.exec(...query.prepare());


// TODO config
// const db = new DB("db/demo.sqlite3");

// db.prepareQuery( ??

// iterEntries

// const countVisitsQuery = db.prepareQuery<[number]>(
//   "SELECT COUNT(*) FROM visits WHERE url = :url",
// );
// const [count] = countVisitsQuery.one({ url: req.url });

/*
    const query = db.prepareQuery(
      "SELECT id, note, created_at FROM notes ORDER BY created_at DESC",
    );
*/

//   const q = sql`SELECT ${id('author')} FROM books WHERE name = ${'foo'} AND author = ${'bar'}`
// console.log(
//   q
// )

// const run = (query) =>

//   constructor() {
//   }
// user.id = await nanoid()


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
    const rows = await entries(query)
    return !!rows.length ? rows[0] : null
  }
}



export async function create(tablename, data) {
}

export async function update(tablename, filter, data) {

  // Object.keys(data).map(key => sql`${id(key)} = ${data[key]}`)

  // `UPDATE table_name
  // SET
  //   column1 = value1,
  //   column2 = value2, ...
  // WHERE condition;`
}

  // export async replace(tablename, data) {
  // }

export async function del(tablename, id) {
}

export async function fuzzySearch(tablename, term) {
}

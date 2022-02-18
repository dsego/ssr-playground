import { DB, sql } from "../deps.js";

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



//   constructor() {
//   }

//   // TODO paging, filters, order
//   // TODO make async
export async function getAll(tablename, options) {
//     // options = { filter, order, page }
//     // const rows = this.db.query(`SELECT * FROM ${tablename} LIMIT 1, 50`);
//     return rows;
}

export async function findBy(tablename, key, value) {
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

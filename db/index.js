const { Pool } = require('pg')


/* HOW TO USE FORMAT BITCH
var sql = format('SELECT * FROM %I WHERE my_col = %L %s', 'my_table', 34, 'LIMIT 10');
console.log(sql); // SELECT * FROM my_table WHERE my_col = '34' LIMIT 10
*/


const pool = new Pool({
  user: 'db',
  host: 'app-f879d972-eede-43d2-b0f1-84595f703fbd-do-user-4296309-0.b.db.ondigitalocean.com',
  database: 'db',
  password: 'ystl9t074ig3a9qs',
  port: 25060,
  max: 20,
  connectionTimeoutMillis: 0,
  idleTimeoutMillis: 0,
  ssl: { rejectUnauthorized: false }
})
module.exports = {
  query: (text, callback) => {
    const start = Date.now()
    return pool.query(text, (err, res) => {
      const duration = Date.now() - start
      //console.log('executed query', { text, duration })
      callback(err, res)
    })
  },
  getClient: (callback) => {
    pool.connect((err, client, done) => {
      callback(err, client, done)
    })
  }
}

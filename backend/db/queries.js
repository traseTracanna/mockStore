const { response } = require('express');
const Pool = require('pg').Pool

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'fake_store',
  password: 'postgres',
  port: 5432,
})

module.exports = {
  query: (text, params, callback) =>{ 
    return pool.query(text, params, callback)
  },
};
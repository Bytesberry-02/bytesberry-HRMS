const Pool = require("pg").Pool;
const { Client } = require("pg");
require("dotenv").config();

const pool =
  process.env.NODE_ENV === "development"
    ? new Pool({
        user: "postgres",
        // password: "bytesberry123",
        // host: "192.168.1.4",
         password: "root",
         host: "localhost",
        port: 5432,
        database: "bytesberry_hrms_internship_db",
      })
    : new Pool({
        user: process.env.REACT_APP_PG_USER,
        password: process.env.REACT_APP_PG_PASSWORD,
        host: process.env.REACT_APP_PG_HOST,
        port: process.env.REACT_APP_PG_PORT,
        database: process.env.REACT_APP_PG_DATABASE,
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      });

module.exports = pool;

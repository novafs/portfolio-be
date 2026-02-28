import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD, 
  port: process.env.DB_PORT,
  // connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000, 
  idleTimeoutMillis: 30000,
  ssl: {
    // Neon memerlukan SSL. 
    // rejectUnauthorized: false biasanya digunakan jika Anda tidak menyediakan sertifikat CA spesifik
    rejectUnauthorized: false, 
  },
});

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASS, 
//   port: process.env.DB_PORT,
// });

pool.connect()
  .then(() => console.log('Connected to Postgres'))
  .catch(err => console.error('Connection error:', err));

export default pool;
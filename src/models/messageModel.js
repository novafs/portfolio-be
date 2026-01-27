import Pool from "../config/db.js";

const selectAll = ({ limit, offset, sort, sortby }) => {
  return Pool.query(
    `SELECT * FROM messages ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`,
  );
};

const select = async (id) => {
  return await Pool.query(
    `SELECT id, name, email, subject, message, isRead, createdAt FROM messages WHERE id = $1`,
    [id],
  );
};

const insert = async (data) => {
  const { id, name, email, subject, message, isRead, createdAt } = data;
  return await Pool.query(
    `INSERT INTO messages (id, name, email, subject, message, isRead, createdAt) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [id, name, email, subject, message, isRead, createdAt],
  );
};

const update = async (data) => {
  const { isRead, id } = data;
  return await Pool.query(
    `UPDATE messages SET isRead = $1 WHERE id = $2`,
    [isRead, id],
  );
};

const deleteData = async (id) => {
  return await Pool.query(`DELETE FROM messages WHERE id = $1`, [id]);
};

const countData = () => {
  return Pool.query(`SELECT count(*) FROM messages`);
};

const findId = (id) => {
  return Pool.query(`SELECT id FROM messages WHERE id ${id}`);
};

export { selectAll, select, insert, update, deleteData, countData };

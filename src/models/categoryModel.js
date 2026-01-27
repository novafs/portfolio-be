import Pool from '../config/db.js'


const selectAll = ({ limit, offset, sort, sortby }) => {
    return Pool.query(`SELECT * FROM categories ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`)
}

const select = async (id) => {
    return await Pool.query(`SELECT id, name, color, createdAt, updatedAt FROM categories WHERE id = $1`, [id]);
}

const insert = async (data) => {
    const { id, name, color, createdAt } = data
    return await Pool.query(`INSERT INTO categories (id, name, color, createdAt) VALUES ($1, $2, $3, $4)`, [id, name, color, createdAt]);
}

const update = async (data) => {
    const { name, color, id, updatedAt } = data
    return await Pool.query(`UPDATE categories SET name = $1, color = $2, updatedAt = $3 WHERE id = $4`, [name, color, updatedAt, id]);

}

const deleteData = async (id) => {
    return await Pool.query(`DELETE FROM categories WHERE id = $1`, [id]);
}

const countData = () => {
    return Pool.query(`SELECT count(*) FROM categories`)
}

const findId = (id) => {
    return Pool.query(`SELECT id FROM categories WHERE id ${id}`)
}

export {
    selectAll,
    select,
    insert,
    update,
    deleteData,
    countData
}

import Pool from '../config/db.js'


const selectAll = ({ limit, offset, sort, sortby }) => {
    return Pool.query(`SELECT * FROM services ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`)
}

const select = async (id) => {
    return await Pool.query(`SELECT id, title, description, categoryId, createdAt, updatedAt FROM services WHERE id = $1`, [id]);
}

const insert = async (data) => {
    const { id, title, description, categoryId, createdAt } = data
    return await Pool.query(`INSERT INTO services (id, title, description, categoryId, createdAt) VALUES ($1, $2, $3, $4, $5)`, [id, title, description, categoryId, createdAt]);
}

const update = async (data) => {
    const { title, description, categoryId, updatedAt, id } = data
    return await Pool.query(`UPDATE services SET title = $1, description = $2, categoryId = $3, updatedAt = $4 WHERE id = $5`, [title, description, categoryId, updatedAt , id]);

}

const deleteData = async (id) => {
    return await Pool.query(`DELETE FROM services WHERE id = $1`, [id]);
}

const countData = () => {
    return Pool.query(`SELECT count(*) FROM services`)
}

export {
    selectAll,
    select,
    insert,
    update,
    deleteData,
    countData
}

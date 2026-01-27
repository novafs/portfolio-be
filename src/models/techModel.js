import Pool from '../config/db.js'


const selectAll = ({ limit, offset, sort, sortby }) => {
    return Pool.query(`SELECT * FROM techs ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`)
}

const select = async (id) => {
    return await Pool.query(`SELECT id, name, iconUrl, color, updatedAt FROM techs WHERE id = $1`, [id]);
}

const insert = async (data) => {
    const { id, name, iconUrl, color, createdAt } = data
    return await Pool.query(`INSERT INTO techs (id, name, iconUrl, color, createdAt) VALUES ($1, $2, $3, $4, $5)`, [id, name, iconUrl, color, createdAt]);
}

const update = async (data) => {
    const { name, iconUrl, color, id, updatedAt } = data
    return await Pool.query(`UPDATE techs SET name = $1, iconUrl = $2, color = $3, updatedAt = $4 WHERE id = $5`, [name, iconUrl, color, updatedAt, id]);
}

const deleteData = async (id) => {
    return await Pool.query(`DELETE FROM techs WHERE id = $1`, [id]);
}

const countData = () => {
    return Pool.query(`SELECT count(*) FROM techs`)
}

const findId = (id) => {
    return Pool.query(`SELECT id FROM techs WHERE id ${id}`)
}

export {
    selectAll,
    select,
    insert,
    update,
    deleteData,
    countData
}

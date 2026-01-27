import Pool from '../config/db.js'


const selectAll = ({ limit, offset, sort, sortby }) => {
    return Pool.query(`SELECT * FROM certificationTypes ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`)
}

const select = async (id) => {
    return await Pool.query(`SELECT id, name, createdAt, updatedAt FROM certificationTypes WHERE id = $1`, [id]);
}

const insert = async (data) => {
    const { id, name, createdAt } = data
    return await Pool.query(`INSERT INTO certificationTypes (id, name, createdAt) VALUES ($1, $2, $3)`, [id, name, createdAt]);
}

const update = async (data) => {
    const { name, id, updatedAt } = data
    return await Pool.query(`UPDATE certificationTypes SET name = $1, updatedAt = $2 WHERE id = $3`, [name, updatedAt, id]);

}

const deleteData = async (id) => {
    return await Pool.query(`DELETE FROM certificationTypes WHERE id = $1`, [id]);
}

const countData = () => {
    return Pool.query(`SELECT count(*) FROM certificationTypes`)
}

const findId = (id) => {
    return Pool.query(`SELECT id FROM certificationTypes WHERE id = $1`, [id])
}

export {
    selectAll,
    select,
    insert,
    update,
    deleteData,
    countData
}

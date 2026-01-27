import Pool from '../config/db.js'


const selectAll = ({ limit, offset, sort, sortby }) => {
    return Pool.query(`SELECT * FROM certifications ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`)
}

const select = async (id) => {
    return await Pool.query(`SELECT id, title, authority, description, imageUrl, categoryId, certificationTypeId, featured, certificationDate, credentialLink, createdAt, updatedAt FROM certifications WHERE id = $1`, [id]);
}

const insert = async (data) => {
    const { id, title, authority, description, imageUrl, categoryId, certificationTypeId, featured, certificationDate, credentialLink, createdAt } = data
    return await Pool.query(`INSERT INTO certifications (id, title, authority, description, imageUrl, categoryId, certificationTypeId, featured, certificationDate, credentialLink, createdAt) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`, [id, title, authority, description, imageUrl, categoryId, certificationTypeId, featured, certificationDate, credentialLink, createdAt]);
}

const update = async (data) => {
    const { title, authority, description, imageUrl, categoryId, certificationTypeId, featured, certificationDate, credentialLink, updatedAt, id } = data
    return await Pool.query(`UPDATE certifications SET title = $1, authority = $2, description = $3, imageUrl = $4, categoryId = $5, certificationTypeId = $6, featured = $7, certificationDate = $8, credentialLink = $9, updatedAt = $10 WHERE id = $11`, [title, authority, description, imageUrl, categoryId, certificationTypeId, featured, certificationDate, credentialLink, updatedAt , id]);

}

const deleteData = async (id) => {
    return await Pool.query(`DELETE FROM certifications WHERE id = $1`, [id]);
}

const countData = () => {
    return Pool.query(`SELECT count(*) FROM certifications`)
}

export {
    selectAll,
    select,
    insert,
    update,
    deleteData,
    countData
}

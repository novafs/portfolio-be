import Pool from '../config/db.js'


const selectAll = ({ limit, offset, sort, sortby }) => {
    return Pool.query(`SELECT * FROM projects ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`)
}

const select = async (id) => {
    return await Pool.query(`SELECT id, thumbnailUrl, title, subtitle, description, categoryId, featured, publishDate, projectLinks, createdAt, updatedAt FROM projects WHERE id = $1`, [id]);
}

const insert = async (data) => {
    const { id, thumbnailUrl, title, subtitle, description, categoryId, featured, publishDate, projectLinks, createdAt } = data
    return await Pool.query(`INSERT INTO projects (id, thumbnailUrl, title, subtitle, description, categoryId, featured, publishDate, projectLinks, createdAt) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [id, thumbnailUrl, title, subtitle, description, categoryId, featured, publishDate, projectLinks, createdAt]);
}

const update = async (data) => {
    const { thumbnailUrl, title, subtitle, description, categoryId, featured, publishDate, projectLinks, id, updatedAt } = data
    return await Pool.query(`UPDATE projects SET thumbnailUrl = $1, title = $2, subtitle = $3, description = $4, categoryId = $5, featured = $6, publishDate = $7, projectLinks = $8, updatedAt = $9 WHERE id = $10`, [thumbnailUrl, title, subtitle, description, categoryId, featured, publishDate, projectLinks, updatedAt, id]);

}

const deleteData = async (id) => {
    return await Pool.query(`DELETE FROM projects WHERE id = $1`, [id]);
}

const countData = () => {
    return Pool.query(`SELECT count(*) FROM projects`)
}

const getProjectTech = (projectId) => {
    return Pool.query(`SELECT techId FROM project_techs WHERE projectId = $1`, [projectId]);
};

const insertProjectTech = (projectId, techId) => {
    return Pool.query(`INSERT INTO project_techs (projectId, techId) VALUES ($1, $2)`, [projectId, techId]);
};

const deleteProjectTech = (projectId) => {
    return Pool.query(`DELETE FROM project_techs WHERE projectId = $1`, [projectId]);
};

export {
    selectAll,
    select,
    insert,
    update,
    deleteData,
    countData,
    getProjectTech,
    insertProjectTech,
    deleteProjectTech
}

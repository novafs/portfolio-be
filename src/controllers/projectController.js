import {
  selectAll,
  select,
  insert,
  countData,
  update,
  deleteData,
  getProjectTech,
  insertProjectTech,
  deleteProjectTech,
} from "../models/projectModel.js";
import {
  selectAll as selectAllCategories,
  select as selectCategory,
} from "../models/categoryModel.js";
import {
  selectAll as selectAllTechs,
  select as selectTech,
} from "../models/techModel.js";
import commonHelper from "../helper/common.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import { v7 as uuidv7 } from "uuid";

export const getAllProjects = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const offset = (page - 1) * limit;
    const sortby = req.query.sortby || "id";
    const sort = req.query.sort || "ASC";
    const result = await selectAll({ limit, offset, sort, sortby });
    const {
      rows: [count],
    } = await countData();
    const totalData = parseInt(count.count);
    const totalPage = Math.ceil(totalData / limit);
    const pagination = {
      currentPage: page,
      limit: limit,
      totalData: totalData,
      totalPage: totalPage,
    };
    commonHelper.response(
      res,
      result.rows,
      200,
      "Get Projects Data success",
      pagination,
    );
  } catch (error) {
    console.log(error);
  }
};

export const getDetailProject = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await select(id);
    const techResult = await getProjectTech(id);
    const techIds = techResult.rows.map((row) => row.techid);
    if (result.rows.length === 0) {
      return commonHelper.response(res, null, 404, "Project not found");
    }
    commonHelper.response(
      res,
      { ...result.rows[0], techIds },
      200,
      "Get Project By Id Success",
    );
  } catch (error) {
    res.send(error);
  }
};

export const insertProject = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      categoryId,
      featured,
      publishDate,
      projectLinks,
    } = req.body;

    // Parsing techIds karena biasanya dikirim dalam bentuk string array dari FormData
    const techIds = JSON.parse(req.body.techIds || "[]");

    // 1. Validasi Category ID (Menggunakan model category)
    const categoryCheck = await selectCategory(categoryId);
    if (categoryCheck.rowCount === 0) {
      return res.status(404).json({
        message: "Category ID not found",
      });
    }

    // 2. Validasi Tech IDs (Pengecekan apakah semua ID teknologi tersedia)
    if (techIds.length > 0) {
      for (const tId of techIds) {
        const techCheck = await selectTech(tId);
        if (techCheck.rowCount === 0) {
          return res.status(404).json({
            message: `Tech ID ${tId} not found`,
          });
        }
      }
    }

    const uploadStream = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "Portfolio/Projects" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          },
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    const result = await uploadStream();
    const thumbnailUrl = result.secure_url;

    let id;
    let checkId;

    do {
      id = uuidv7();
      checkId = await select(id);
    } while (checkId.rows.length !== 0);

    const createdAt = new Date();

    const data = {
      id,
      thumbnailUrl,
      title,
      subtitle,
      description,
      categoryId,
      featured,
      publishDate,
      projectLinks,
      createdAt,
    };
    const insertResult = await insert(data);

    // 6. Insert ke Junction Table (project_techs)
    if (techIds.length > 0) {
      await Promise.all(techIds.map((tId) => insertProjectTech(id, tId)));
    }

    return commonHelper.response(
      res,
      { id, ...data, techIds },
      201,
      "Create Project success",
    );
  } catch (error) {
    console.error("Error in insertProject:", error);
    res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Failed to create project",
      error: error.message,
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    // if (user.role !== "admin") {
    //   return res.status(403).json({ message: "Access denied" });
    // }
    const { id } = req.params;

    const project = await select(id);

    const {
      title,
      subtitle,
      description,
      categoryId,
      techId,
      featured,
      publishDate,
      projectLinks,
    } = req.body;

    let thumbnailUrl;

    // Parsing techIds karena biasanya dikirim dalam bentuk string array dari FormData
    const techIds = JSON.parse(req.body.techIds || "[]");

    // 1. Validasi Category ID (Menggunakan model category)
    const categoryCheck = await selectCategory(categoryId);
    if (categoryCheck.rowCount === 0) {
      return res.status(404).json({
        message: "Category ID not found",
      });
    }

    // 2. Validasi Tech IDs (Pengecekan apakah semua ID teknologi tersedia)
    if (techIds.length > 0) {
      for (const tId of techIds) {
        const techCheck = await selectTech(tId);
        if (techCheck.rowCount === 0) {
          return res.status(404).json({
            message: `Tech ID ${tId} not found`,
          });
        }
      }
    }

    // Check if there's a file upload for photo update
    if (req.file) {
      // const result = await uploadFile(req.file, `projects/${id}`);
      const uploadStream = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "Portfolio/Projects" },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            },
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      const result = await uploadStream();
      thumbnailUrl = result.secure_url;
    } else {
      // If no new photo, keep the existing one or use a placeholder
      thumbnailUrl = project.thumbnailUrl;
    }

    const updatedAt = new Date();

    const data = {
      id,
      thumbnailUrl,
      title,
      subtitle,
      description,
      categoryId,
      techId,
      featured,
      publishDate,
      projectLinks,
      updatedAt,
    };

    await deleteProjectTech(id);
    if (techIds.length > 0) {
      await Promise.all(techIds.map((tId) => insertProjectTech(id, tId)));
    }

    const result = await update(data);
    commonHelper.response(res, result.rows, 200, "Project updated");
  } catch (error) {
    console.error("Error in updateProject:", error);
    res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Failed to update project",
      error: error.message,
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    //if (user.role !== "admin") {
    //  return res.status(403).json({ message: "Access denied" });
    //}
    const { id } = req.params;

    const result = await deleteData(id);
    await deleteProjectTech(id);
    commonHelper.response(res, result.rows, 200, "Project deleted");
  } catch (error) {
    console.error("Error in deleteProject:", error);
    res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Failed to delete project",
      error: error.message,
    });
  }
};

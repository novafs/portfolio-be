import {
  selectAll,
  select,
  insert,
  countData,
  deleteData,
  update,
} from "../models/techModel.js";
import commonHelper from "../helper/common.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const getAllTechs = async (req, res) => {
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
      "Get Techs Data success",
      pagination,
    );
  } catch (error) {
    console.log(error);
  }
};

export const getDetailTech = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await select(id);
    if (result.rows.length === 0) {
      return commonHelper.response(res, null, 404, "Tech not found");
    }
    commonHelper.response(res, result.rows, 200, "Get Tech By Id Success");
  } catch (error) {
    res.send(error);
  }
};

export const insertTech = async (req, res) => {
  try {
    // if (user.role !== "admin") {
    //   return res.status(403).json({ message: "Access denied" });
    // }
    const uploadStream = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "Portfolio/Techs" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          },
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    const result = await uploadStream();
    const iconUrl = result.secure_url;
    const { name, color } = req.body;
    const createdAt = new Date();
    let id = 0;
    let checkId;

    do {
      id++;
      checkId = await select(id);
    } while (checkId.rows.length !== 0);
    const data = {
      id,
      name,
      iconUrl,
      color,
      createdAt
    };
    const insertResult = await insert(data);
    commonHelper.response(
      res,
      insertResult.rows,
      201,
      "Tech Created Succesfully",
    );
  } catch (error) {
    console.error("Error in insertTech:", error);
    res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Failed to create new Tech",
      error: error.message,
    });
  }
};

export const updateTech = async (req, res) => {
  try {
    // if (user.role !== "admin") {
    //   return res.status(403).json({ message: "Access denied" });
    // }
    const id = Number(req.params.id);
    const tech = await select(id);

    const uploadStream = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "Portfolio/Techs" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          },
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    const result = await uploadStream();
    const iconUrl = result.secure_url;
    const { name, color } = req.body;
    const updatedAt = new Date();

    const data = {
      id,
      name,
      iconUrl,
      color,
      updatedAt
    };
    const editResult = await update(data);
    commonHelper.response(
      res,
      editResult.rows,
      201,
      "Tech Updated Succesfully",
    );
  } catch (error) {
    console.error("Error in editTech:", error);
    res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Failed to edit Tech",
      error: error.message,
    });
  }
};

export const deleteTech = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await deleteData(id);
    commonHelper.response(res, result.rows, 200, "Tech deleted");
  } catch (error) {
    console.error("Error in deleteTech:", error);
    res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Failed to delete Tech",
      error: error.message,
    });
  }
};

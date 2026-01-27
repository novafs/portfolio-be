import {
  selectAll,
  select,
  insert,
  countData,
  update,
  deleteData,
} from "../models/certificationModel.js";
import {
  selectAll as selectAllCategories,
  select as selectCategory,
} from "../models/categoryModel.js";
import {
  selectAll as selectAllCertificationTypes,
  select as selectCertificationType,
} from "../models/certificationTypeModel.js";
import commonHelper from "../helper/common.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import { v7 as uuidv7 } from "uuid";

export const getAllCertifications = async (req, res) => {
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
      "Get Certifications Data success",
      pagination,
    );
  } catch (error) {
    console.log(error);
  }
};

export const getDetailCertification = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await select(id);
    if (result.rows.length === 0) {
      return commonHelper.response(res, null, 404, "Certification not found");
    }
    commonHelper.response(
      res,
      result.rows[0],
      200,
      "Get Certification By Id Success",
    );
  } catch (error) {
    res.send(error);
  }
};

export const insertCertification = async (req, res) => {
  try {
    const {
      title,
      authority,
      description,
      categoryId,
      certificationTypeId,
      featured,
      certificationDate,
      credentialLink,
    } = req.body;

    // 1. Validasi Category ID (Menggunakan model category)
    const categoryCheck = await selectCategory(categoryId);
    if (categoryCheck.rowCount === 0) {
      return res.status(404).json({
        message: "Category ID not found",
      });
    }

    const certificationTypeCheck = await selectCertificationType(certificationTypeId);
    if (certificationTypeCheck.rowCount === 0) {
      return res.status(404).json({
        message: "Certification Type ID not found",
      });
    }

    const user = req.user;
    const uploadStream = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "Portfolio/Certifications" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          },
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    const result = await uploadStream();
    const imageUrl = result.secure_url;
    const createdAt = new Date();

    let id;
    let checkId;

    do {
      id = uuidv7();
      checkId = await select(id);
    } while (checkId.rows.length !== 0);
    const data = {
      id,
      title,
      authority,
      description,
      imageUrl,
      categoryId,
      certificationTypeId,
      featured,
      certificationDate,
      credentialLink,
      createdAt
    };
    const insertResult = await insert(data);

    return commonHelper.response(
      res,
      insertResult.rows,
      201,
      "Create Certification success",
    );
  } catch (error) {
    console.error("Error in insertCertification:", error);
    res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Failed to create certification",
      error: error.message,
    });
  }
};

export const updateCertification = async (req, res) => {
  try {
    const user = req.user;
    // if (user.role !== "admin") {
    //   return res.status(403).json({ message: "Access denied" });
    // }

    const id = Number(req.params.id);
    const certification = await select(id);
    const updatedAt = new Date();

    const {
      title,
      authority,
      description,
      categoryId,
      certificationTypeId,
      featured,
      certificationDate,
      credentialLink,
    } = req.body;

    let imageUrl;

    // 1. Validasi Category ID (Menggunakan model category)
    const categoryCheck = await selectCategory(categoryId);
    if (categoryCheck.rowCount === 0) {
      return res.status(404).json({
        message: "Category ID not found",
      });
    }

    const certificationTypeCheck = await selectCertificationType(certificationTypeId);
    if (certificationTypeCheck.rowCount === 0) {
      return res.status(404).json({
        message: "Certification Type ID not found",
      });
    }

    // Check if there's a file upload for photo update
    if (req.file) {
      // const result = await uploadFile(req.file, `projects/${id}`);
      const uploadStream = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "Portfolio/Certifications" },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            },
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      const result = await uploadStream();
      imageUrl = result.secure_url;
    } else {
      // If no new photo, keep the existing one or use a placeholder
      imageUrl = certification.imageUrl;
    }

    const data = {
      id,
      title,
      authority,
      description,
      imageUrl,
      categoryId,
      certificationTypeId,
      featured,
      certificationDate,
      credentialLink,
      updatedAt
    };

    const result = await update(data);
    commonHelper.response(res, result.rows, 200, "Certification updated");
  } catch (error) {
    console.error("Error in updateCertification:", error);
    res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Failed to update certification",
      error: error.message,
    });
  }
};

export const deleteCertification = async (req, res) => {
  try {
    const user = req.user;
    //if (user.role !== "admin") {
    //  return res.status(403).json({ message: "Access denied" });
    //}
    const id = Number(req.params.id);
    const result = await deleteData(id);
    commonHelper.response(res, result.rows, 200, "Certification deleted");
  } catch (error) {
    console.error("Error in deleteCertification:", error);
    res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Failed to delete certification",
      error: error.message,
    });
  }
};

import {
  selectAll,
  select,
  insert,
  countData,
  update,
  deleteData,
} from "../models/serviceModel.js";
import {
  selectAll as selectAllCategories,
  select as selectCategory,
} from "../models/categoryModel.js";
import commonHelper from "../helper/common.js";
import { v7 as uuidv7 } from "uuid";

export const getAllServices = async (req, res) => {
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
      "Get Services Data success",
      pagination,
    );
  } catch (error) {
    console.log(error);
  }
};

export const getDetailService = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await select(id);
    if (result.rows.length === 0) {
      return commonHelper.response(
        res,
        null,
        404,
        "Service not found",
      );
    }
    commonHelper.response(
      res,
      result.rows[0],
      200,
      "Get Service By Id Success",
    );
  } catch (error) {
    res.send(error);
  }
};

export const insertService = async (req, res) => {
  try {
    const {
      title,
      description,
      categoryId
    } = req.body;

    // 1. Validasi Category ID (Menggunakan model category)
    const categoryCheck = await selectCategory(categoryId);
    if (categoryCheck.rowCount === 0) {
      return res.status(404).json({
        message: "Category ID not found",
      });
    }

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
      description,
      categoryId,
      createdAt
    };
    const insertResult = await insert(data);

    return commonHelper.response(
      res,
      insertResult.rows,
      201,
      "Create Service success",
    );
  } catch (error) {
    console.error("Error in insertService:", error);
    res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Failed to create service",
      error: error.message,
    });
  }
};

export const updateService = async (req, res) => {
  try {
    // if (user.role !== "admin") {
    //   return res.status(403).json({ message: "Access denied" });
    // }

    const id = Number(req.params.id);
    const updatedAt = new Date();

    const {
      title,
      description,
      categoryId,
    } = req.body;

    // 1. Validasi Category ID (Menggunakan model category)
    const categoryCheck = await selectCategory(categoryId);
    if (categoryCheck.rowCount === 0) {
      return res.status(404).json({
        message: "Category ID not found",
      });
    }

    const data = {
      id,
      title,
      description,
      categoryId,
      updatedAt
    };

    const result = await update(data);
    commonHelper.response(res, result.rows, 200, "Service updated");
  } catch (error) {
    console.error("Error in updateService:", error);
    res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Failed to update service",
      error: error.message,
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    //if (user.role !== "admin") {
    //  return res.status(403).json({ message: "Access denied" });
    //}
    const id = Number(req.params.id);
    const result = await deleteData(id);
    commonHelper.response(res, result.rows, 200, "Service deleted");
  } catch (error) {
    console.error("Error in deleteService:", error);
    res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Failed to delete service",
      error: error.message,
    });
  }
};

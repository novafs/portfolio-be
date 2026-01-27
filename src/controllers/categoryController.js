import {
  selectAll,
  select,
  insert,
  countData,
  deleteData,
  update,
} from "../models/categoryModel.js";
import commonHelper from "../helper/common.js";

export const getAllCategories = async (req, res) => {
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
      "Get Categories Data success",
      pagination,
    );
  } catch (error) {
    console.log(error);
  }
};

export const getDetailCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await select(id);
    if (result.rows.length === 0) {
      return commonHelper.response(res, null, 404, "Category not found");
    }
    commonHelper.response(res, result.rows, 200, "Get Category By Id Success");
  } catch (error) {
    res.send(error);
  }
};

export const insertCategory = async (req, res) => {
  try {
    // if (user.role !== "admin") {
    //   return res.status(403).json({ message: "Access denied" });
    // }

    const { name, color } = req.body;
    let id = 0;
    let checkId;

    do {
      id++;
      checkId = await select(id);
    } while (checkId.rows.length !== 0);

    const createdAt = new Date();

    const data = {
      id,
      name,
      color,
      createdAt
    };
    const result = await insert(data);
    commonHelper.response(
      res,
      result.rows,
      201,
      "Category Created Succesfully",
    );
  } catch (error) {
    console.error("Error in insertCategory:", error);
    res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Failed to create new Category",
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    // if (user.role !== "admin") {
    //   return res.status(403).json({ message: "Access denied" });
    // }
    const id = Number(req.params.id);
    const category = await select(id);

    const { name, color } = req.body;
    const updatedAt = new Date();

    const data = {
      id,
      name,
      color,
      updatedAt
    };
    const result = await update(data);
    commonHelper.response(
      res,
      result.rows,
      201,
      "Category Updated Succesfully",
    );
  } catch (error) {
    console.error("Error in editCategory:", error);
    res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Failed to edit Category",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const user = req.user;
    const id = Number(req.params.id);
    const result = await deleteData(id);
    commonHelper.response(res, result.rows, 200, "Category deleted");
  } catch (error) {
    console.error("Error in deleteCategory:", error);
    res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Failed to delete Category",
      error: error.message,
    });
  }
};

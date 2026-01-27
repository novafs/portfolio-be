import {
  selectAll,
  select,
  insert,
  countData,
  deleteData,
  update,
} from "../models/messageModel.js";
import commonHelper from "../helper/common.js";

export const getAllMessages = async (req, res) => {
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
      "Get Messages Data success",
      pagination,
    );
  } catch (error) {
    console.log(error);
  }
};

export const getDetailMessage = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await select(id);
    if (result.rows.length === 0) {
      return commonHelper.response(res, null, 404, "Message not found");
    }
    commonHelper.response(res, result.rows, 200, "Get Message By Id Success");
  } catch (error) {
    res.send(error);
  }
};

export const insertMessage = async (req, res) => {
  try {
    // if (user.role !== "admin") {
    //   return res.status(403).json({ message: "Access denied" });
    // }

    const { name, email, subject, message, isRead } = req.body;
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
      email,
      subject,
      message,
      isRead,
      createdAt
    };
    const result = await insert(data);
    commonHelper.response(
      res,
      result.rows,
      201,
      "Message Created Succesfully",
    );
  } catch (error) {
    console.error("Error in insertMessage:", error);
    res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Failed to create new Message",
      error: error.message,
    });
  }
};


export const updateMessage = async (req, res) => {
  try {
    // if (user.role !== "admin") {
    //   return res.status(403).json({ message: "Access denied" });
    // }
    const id = Number(req.params.id);

    const { isRead } = req.body;

    const data = {
      id,
      isRead
    };
    const result = await update(data);
    commonHelper.response(
      res,
      result.rows,
      201,
      "Message Updated Succesfully",
    );
  } catch (error) {
    console.error("Error in editMessage:", error);
    res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Failed to edit Message",
      error: error.message,
    });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const user = req.user;
    const id = Number(req.params.id);
    const result = await deleteData(id);
    commonHelper.response(res, result.rows, 200, "Message deleted");
  } catch (error) {
    console.error("Error in deleteMessage:", error);
    res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Failed to delete Message",
      error: error.message,
    });
  }
};

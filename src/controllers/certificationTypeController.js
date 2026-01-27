import {
  selectAll,
  select,
  insert,
  update,
  countData,
  deleteData,
} from "../models/certificationTypeModel.js";
import commonHelper from "../helper/common.js";

export const getAllCertificationTypes = async (req, res) => {
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
      "Get Certification Types Data success",
      pagination
    );
  } catch (error) {
    console.log(error);
  }
};

export const getDetailCertificationType = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await select(id);
    if (result.rows.length === 0) {
      return commonHelper.response(res, null, 404, "Certification Type not found");
    }
    commonHelper.response(res, result.rows, 200, "Get Certification Type By Id Success");
  } catch (error) {
    res.send(error);
  }
};

export const insertCertificationType = async (req, res) => {
  try {
    const { name } = req.body;

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
      createdAt
    };
    const insertResult = await insert(data);
    commonHelper.response(
      res,
      insertResult.rows,
      201,
      "Certification Type Created Succesfully"
    );
  } catch (error) {
    console.error("Error in insertCertificationType:", error);
    res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Failed to create new Certification Type",
      error: error.message,
    });
  }
};

export const updateCertificationType = async (req, res) => {
  try {
    
    const id = Number(req.params.id);

    const { name } = req.body;

    const updatedAt = new Date();

    const data = {
      id,
      name,
      updatedAt
    };
    const result = await update(data);
    commonHelper.response(
      res,
      result.rows,
      201,
      "Certification Type Updated Succesfully",
    );
  } catch (error) {
    console.error("Error in editCertificationType:", error);
    res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Failed to edit Certification Type",
      error: error.message,
    });
  }
};

export const deleteCertificationType = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await deleteData(id);
    commonHelper.response(res, result.rows, 200, "Certification Type deleted");
  } catch (error) {
    console.error("Error in deleteCertificationType:", error);
    res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Failed to delete Certification Type",
      error: error.message,
    });
  }
};
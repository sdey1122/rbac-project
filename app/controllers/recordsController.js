const Record = require("../models/record");

class RecordsController {
  // CREATE
  async createRecord(req, res) {
    try {
      const { title, description, status } = req.body;

      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Title is required",
        });
      }

      const record = await Record.create({
        title,
        description,
        status,
        createdBy: req.user.id,
      });

      return res.status(201).json({
        success: true,
        message: "Record created successfully",
        data: record,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Create Error",
        error: error.message,
      });
    }
  }

  // READ ALL
  async getRecords(req, res) {
    try {
      const records = await Record.find()
        .populate("createdBy", "username email role")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: records.length,
        data: records,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Fetch Error",
        error: error.message,
      });
    }
  }

  // UPDATE
  async updateRecord(req, res) {
    try {
      const { id } = req.params;
      const { title, description, status } = req.body;

      const record = await Record.findById(id);

      if (!record) {
        return res.status(404).json({
          success: false,
          message: "Record not found",
        });
      }

      if (
        record.createdBy.toString() !== req.user.id &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this record",
        });
      }

      record.title = title || record.title;
      record.description = description || record.description;
      record.status = status || record.status;

      await record.save();

      return res.status(200).json({
        success: true,
        message: "Record updated successfully",
        data: record,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Update Error",
        error: error.message,
      });
    }
  }

  // DELETE
  async deleteRecord(req, res) {
    try {
      const { id } = req.params;

      const record = await Record.findById(id);

      if (!record) {
        return res.status(404).json({
          success: false,
          message: "Record not found",
        });
      }

      if (
        record.createdBy.toString() !== req.user.id &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to delete this record",
        });
      }

      await record.deleteOne();

      return res.status(200).json({
        success: true,
        message: "Record deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Delete Error",
        error: error.message,
      });
    }
  }
}

module.exports = new RecordsController();

const express = require("express");
const router = express.Router();

const recordsController = require("../controllers/recordsController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { checkPermission } = require("../middlewares/rbacMiddleware");

router.post(
  "/",
  verifyToken,
  checkPermission("create_record"),
  recordsController.createRecord,
);

router.get(
  "/",
  verifyToken,
  checkPermission("read_record"),
  recordsController.getRecords,
);

router.put(
  "/:id",
  verifyToken,
  checkPermission("update_record"),
  recordsController.updateRecord,
);

router.delete(
  "/:id",
  verifyToken,
  checkPermission("delete_record"),
  recordsController.deleteRecord,
);

module.exports = router;

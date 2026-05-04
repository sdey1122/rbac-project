const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/records", require("./records"));

module.exports = router;

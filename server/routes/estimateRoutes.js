const express = require("express");
const router = express.Router();
const { calculateEstimate } = require("../controllers/estimateController");

router.post("/", calculateEstimate);

module.exports = router;
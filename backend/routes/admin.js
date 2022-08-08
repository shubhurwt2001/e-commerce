const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");

router.post("/add-product", adminAuth, adminController.addProduct);

module.exports = router;

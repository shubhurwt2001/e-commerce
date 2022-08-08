const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
router.post("/login", userController.login);
router.post("/register", userController.register);

router.get("/products", userController.getProducts);
router.get("/profile", auth, userController.profile);
router.post("/add-to-cart", auth, userController.addToCart);
router.post("/clear-cart", auth, userController.clearCart);
router.post("/cart", userController.cart);
module.exports = router;

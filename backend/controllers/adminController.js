const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Product = require("../models/product");

const addProduct = async (req, res) => {
  try {
    // Get user input
    const { title, description, quantity, image, price } = req.body;

    // Validate user input
    if (!(title && description && quantity && image && price)) {
      res.status(400).json({ error: "All input is required" });
    }

    // Create user in our database
    const product = await Product.create({
      title,
      description,
      image,
      quantity,
      price,
    });

    res.status(201).json({ data: product });
  } catch (err) {
    console.log(err);
  }
};

exports.addProduct = addProduct;

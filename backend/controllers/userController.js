const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Razorpay = require("razorpay");
const Product = require("../models/product");
var {
  validatePaymentVerification,
} = require("razorpay/dist/utils/razorpay-utils");
const register = async (req, res) => {
  // Our register logic starts here
  try {
    // Get user input
    const { name, email, password } = req.body;

    // Validate user input
    if (!(email && password && name)) {
      res.status(400).json({ error: "All input is required" });
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res
        .status(409)
        .json({ error: "User Already Exist. Please Login" });
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });
    res.status(201).json({ data: user });
  } catch (err) {
    console.log(err);
  }
};

const login = async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { email, password, cart } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).json({ error: "All input is required" });
    }
    // Validate if user exist in our database
    var user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email, type: user.type },
        process.env.JWT_SECRET,
        {
          expiresIn: "2h",
        }
      );

      // user
      if (cart.length > 0) {
        const items = user.cart;

        cart.map((product) => {
          const check_index = items.findIndex((item) => item.id === product.id);
          if (check_index !== -1) {
            items[check_index].count++;
          } else {
            items.push({ ...cart.find((p) => p.id === product.id) });
          }
        });

        await User.updateOne({ _id: user._id }, { $set: { cart: items } });
        user = await User.findOne(
          { _id: user._id },
          "_id email type cart token orders"
        );
      }
      user.token = token;
      return res.status(200).json({ data: user });
    }
    res.status(400).json({ error: "Invalid Credentials" });
  } catch (err) {
    console.log(err);
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ quantity: { $gte: 0 } });
    res.status(201).json({ data: products });
  } catch (err) {
    console.log(err);
  }
};

const profile = async (req, res) => {
  try {
    // Get user input
    const user = await User.findOne(
      { _id: req.user.user_id },
      "_id email type cart orders"
    );
    res.status(201).json({ data: user });
  } catch (err) {
    console.log(err);
  }
};

const addToCart = async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.user.user_id },
      { $set: { cart: req.body.cart } }
    );
    const user = await User.findOne(
      { _id: req.user.user_id },
      "_id email type cart orders"
    );
    res.status(201).json({ data: user });
  } catch (err) {
    console.log(err);
  }
};

const cart = async (req, res) => {
  try {
    const itemIds = req.body.items.map((item) => item.id);

    const products = await Product.find().where("_id").in(itemIds);

    let items = [];
    products.map(async (product) => {
      let temp = JSON.stringify(product);
      let obj = JSON.parse(temp);
      let filtered = req.body.items.filter((item) => {
        return item.id == obj._id;
      });
      obj.count = filtered[0].count;
      items.push(obj);
    });
    res.status(201).json({ data: items });
  } catch (err) {
    console.log(err);
  }
};

const clearCart = async (req, res) => {
  try {
    await User.updateOne({ _id: req.user.user_id }, { $set: { cart: [] } });
    const user = await User.findOne({ _id: req.user.user_id });
    res.status(201).json({ data: user });
  } catch (err) {
    console.log(err);
  }
};

const checkout = async (req, res) => {
  try {
    const discarded = [];
    const products = req.body.items.filter(async (item) => {
      var product = await Product.findOne({ _id: item._id });
      if (product.quantity >= item.count) {
        return true;
      } else {
        item.quantity = product.quantity;
        discarded.push(item);
      }
    });

    if (discarded.length > 0) {
      res.status(500).json({ data: discarded });
    } else {
      var instance = await new Razorpay({
        key_id: process.env.RZRPAY_ID,
        key_secret: process.env.RZRPAY_SECRET,
      });

      instance.orders
        .create({
          amount:
            products.reduce((a, b) => a + (b["price"] * b["count"] || 0), 0) *
            100,
          currency: "INR",
          receipt: "receipt#1",
        })
        .then((data) => {
          res.status(201).json({ data: data });
        })
        .catch((err) => {
          res.status(400).json({ data: err });
        });
    }
  } catch (err) {
    console.log(err);
  }
};

const placeOrder = async (req, res) => {
  try {
    const { order_id, payment_id, signature, amount, items, id } = req.body;
    const checkSignature = validatePaymentVerification(
      { order_id: id, payment_id: payment_id },
      signature,
      process.env.RZRPAY_SECRET
    );
    if (checkSignature) {
      const order = {
        order_id,
        payment_id,
        signature,
        amount,
        items,
        date: Date.now(),
      };

      items.map(async (item, index) => {
        var product = await Product.updateOne(
          { _id: item._id },
          { $inc: { quantity: -item.count } }
        );
        item.quantity = product.quantity;
      });

      await User.updateOne(
        { _id: req.user.user_id },
        { $push: { orders: order }, $set: { cart: [] } }
      );
      const user = await User.findOne(
        { _id: req.user.user_id },
        "_id email type cart orders"
      );

      res.status(201).json({ data: user });
    } else {
      res.status(400).json({ error: "Invalid payment signature." });
    }
  } catch (err) {
    console.log(err);
  }
};
exports.login = login;
exports.register = register;
exports.getProducts = getProducts;
exports.profile = profile;
exports.addToCart = addToCart;
exports.cart = cart;
exports.clearCart = clearCart;
exports.checkout = checkout;
exports.placeOrder = placeOrder;

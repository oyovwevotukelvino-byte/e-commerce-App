import express from "express";
import Cart from "../models/Cart.js";

const router = express.Router();

// Get cart
router.get("/:userId", async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId });
  res.json(cart || { items: [] });
});

// Save or update cart
router.post("/:userId", async (req, res) => {
  const { items } = req.body;

  let cart = await Cart.findOne({ userId: req.params.userId });

  if (cart) {
    cart.items = items;
    await cart.save();
  } else {
    cart = await Cart.create({
      userId: req.params.userId,
      items
    });
  }

  res.json(cart);
});

export default router;
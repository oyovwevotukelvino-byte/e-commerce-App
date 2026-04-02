import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: Number,
  title: String,
  price: Number,
  quantity: Number
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  items: [cartItemSchema]
});

export default mongoose.model("Cart", cartSchema);
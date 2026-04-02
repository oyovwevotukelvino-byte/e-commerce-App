import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { config } from "./config.js";
import cartRoutes from "./routes/cartRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

console.log("MAIN SERVER.JS RUNNING");

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());


app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.send("Server is working");
});

app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);

if (config.mongoUri) {
  mongoose.connect(config.mongoUri)
    .then(() => {
      console.log("MongoDB Connected");
      app.listen(config.port, () => console.log(`Server running on port ${config.port}`));
    })
    .catch(err => {
      console.log("MongoDB connection error:", err.message);
      app.listen(config.port, () => console.log(`Server running on port ${config.port} (without MongoDB)`));
    });
} else {
  console.log("No MongoDB URI configured, starting server without database");
  app.listen(config.port, () => console.log(`Server running on port ${config.port}`));
}

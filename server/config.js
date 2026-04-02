import dotenv from "dotenv";

// Load environment variables once, at startup
dotenv.config({ path: "./.env" });

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  paystackSecretKey: process.env.PAYSTACK_SECRET_KEY,
};

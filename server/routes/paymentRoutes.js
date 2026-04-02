import express from "express";
import fetch from "node-fetch";
import { config } from "../config.js";

const router = express.Router();

const paystackRequest = async (endpoint, method = "GET", body = null) => {
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${config.paystackSecretKey}`,
      "Content-Type": "application/json",
    },
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`https://api.paystack.co${endpoint}`, options);
  return response.json();
};




// Initialize payment transaction
router.post("/initialize", async (req, res) => {
  try {
    const { email, amount } = req.body;

    // Convert amount to kobo (Paystack uses kobo for Nigerian Naira)
    const amountInKobo = Math.round(amount * 100);

    const transaction = await paystackRequest("/transaction/initialize", "POST", {
      email,
      amount: amountInKobo,
      currency: "NGN",
      metadata: {
        custom_fields: [
          {
            display_name: "Store Name",
            variable_name: "store_name",
            value: "ShopEasy",
          },
        ],
      },
    });

    res.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error("Paystack initialization error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Payment initialization failed",
    });
  }
});

// Verify payment transaction
router.post("/verify", async (req, res) => {
  try {
    const { reference } = req.body;

    const transaction = await paystackRequest(`/transaction/verify/${reference}`, "GET");

    if (transaction.data?.status === "success") {
      res.json({
        success: true,
        message: "Payment verified successfully",
        data: transaction.data,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment not successful",
      });
    }
  } catch (error) {
    console.error("Paystack verification error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Payment verification failed",
    });
  }
});

export default router;


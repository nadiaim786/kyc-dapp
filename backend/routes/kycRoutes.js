const express = require("express");
const router = express.Router();

const {
  submitKYC,
  verifyOTP
} = require("../controllers/kycController");

// submit KYC
router.post("/kyc", submitKYC);

// verify OTP
router.post("/verify-otp", verifyOTP);

module.exports = router;
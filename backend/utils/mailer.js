const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kycblockchainapp@gmail.com",
    pass: "ltmkwpoducfncidr"
  }
});

const sendOTP = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: "KYC App",
      to: email,
      subject: "Your OTP for KYC Verification",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`
    });

    console.log("✅ OTP sent successfully");
  } catch (error) {
    console.error("❌ Email error:", error);
  }
};

module.exports = sendOTP;
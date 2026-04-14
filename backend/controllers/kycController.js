console.log("🔥 CONTROLLER FILE LOADED");
const db = require("../config/db");
const crypto = require("crypto");
const sendOTP = require("../utils/mailer");
const contract = require("../blockchain/contract");

// ========================
// 🧾 SUBMIT KYC
// ========================
exports.submitKYC = async (req, res) => {
  const { wallet, name, dob, idNumber, address, email, isMultiBank } = req.body;

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const hash = crypto
      .createHash("sha256")
      .update(name + dob + idNumber + address)
      .digest("hex");

    const table =
      String(isMultiBank) === "true"
        ? "multi_bank_kyc"
        : "single_bank_kyc";

    db.query(
      `INSERT INTO ${table} 
      (wallet_address, name, dob, id_number, address, email, hash, otp, otp_expiry) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [wallet, name, dob, idNumber, address, email, hash, otp, otpExpiry],
      async (err) => {
        if (err) {
          console.error("MYSQL ERROR:", err);
          return res.status(500).json({ error: err.message });
        }

        try {
          await sendOTP(email, otp);
          console.log("✅ OTP sent successfully");
          return res.json({ message: "OTP sent to email" });
        } catch (mailErr) {
          console.error("MAIL ERROR:", mailErr);
          return res.status(500).json({ error: "Email sending failed" });
        }
      }
    );
  } catch (err) {
    console.error("SUBMIT KYC ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
};


// ========================
// 🔐 VERIFY OTP (FULL DEBUG FIXED)
// ========================
exports.verifyOTP = (req, res) => {
  const { wallet, otp, isMultiBank } = req.body;

  console.log("🔥 VERIFY OTP HIT");
  console.log("REQUEST BODY:", req.body);

  const table =
    String(isMultiBank) === "true"
      ? "multi_bank_kyc"
      : "single_bank_kyc";

  console.log("USING TABLE:", table);
  console.log("WALLET RECEIVED:", wallet);

  db.query(
    `SELECT * FROM ${table} 
     WHERE LOWER(wallet_address) = LOWER(?) 
     ORDER BY id DESC LIMIT 1`,
    [wallet],
    async (err, results) => {

      console.log("🔥 DB CALLBACK REACHED");

      if (err) {
        console.error("DB ERROR:", err);
        return res.status(500).json({ error: err.message });
      }

      console.log("DB RESULTS:", results);

      if (!results || results.length === 0) {
        return res.status(404).json({ error: "No record found" });
      }

      const record = results[0];

      console.log("DB OTP:", record.otp);
      console.log("USER OTP:", otp);
      console.log("OTP EXPIRY:", record.otp_expiry);

      // ========================
      // OTP CHECK (SAFE)
      // ========================
      const dbOtp = String(record.otp).trim();
      const userOtp = String(otp).trim();

      if (dbOtp !== userOtp) {
        console.log("❌ OTP MISMATCH");
        return res.status(400).json({ error: "Invalid OTP" });
      }

      // ========================
      // EXPIRY CHECK
      // ========================
      const expiry = new Date(record.otp_expiry);

      if (Date.now() > expiry.getTime()) {
        console.log("❌ OTP EXPIRED");
        return res.status(400).json({ error: "OTP expired" });
      }

      // ========================
      // UPDATE DB
      // ========================
      db.query(
        `UPDATE ${table} SET otp_verified = true WHERE id = ?`,
        [record.id],
        async (updateErr) => {
          if (updateErr) {
            console.error("UPDATE ERROR:", updateErr);
            return res.status(500).json({ error: updateErr.message });
          }

          try {
            console.log("🔗 SENDING TO BLOCKCHAIN...");

            const tx = await contract.storeKYC(
              wallet,
              "0x" + record.hash,
              isMultiBank
            );

            await tx.wait();

            console.log("✅ BLOCKCHAIN SUCCESS");

            return res.json({
              message: "KYC verified & stored on blockchain"
            });

          } catch (blockErr) {
            console.error("BLOCKCHAIN ERROR:", blockErr);

            return res.status(500).json({
              error: "Blockchain transaction failed",
              details: blockErr.message
            });
          }
        }
      );
    }
  );
};
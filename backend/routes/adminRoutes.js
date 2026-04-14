const express = require("express");
const router = express.Router();

const db = require("../config/db");
const contract = require("../blockchain/contract");

// 🔐 ADMIN LOGIN
router.post("/login", (req, res) => {
  const { bank_name, admin_id, secret_key } = req.body;

  const sql =
    "SELECT * FROM admins WHERE bank_name=? AND admin_id=? AND secret_key=?";

  db.query(sql, [bank_name, admin_id, secret_key], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ message: "Login successful" });
  });
});

// 📋 GET LATEST KYC PER WALLET (NO DUPLICATES)
router.get("/single", (req, res) => {
  db.query(
    `
    SELECT * FROM single_bank_kyc 
    WHERE id IN (
      SELECT MAX(id) 
      FROM single_bank_kyc 
      GROUP BY wallet_address
    )
    `,
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

// 📋 MULTI BANK (same logic)
router.get("/multi", (req, res) => {
  db.query(
    `
    SELECT * FROM multi_bank_kyc 
    WHERE id IN (
      SELECT MAX(id) 
      FROM multi_bank_kyc 
      GROUP BY wallet_address
    )
    `,
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

// ✅ ADMIN APPROVE KYC
router.post("/approve", (req, res) => {
  const { id, isMultiBank } = req.body;

  const table = isMultiBank ? "multi_bank_kyc" : "single_bank_kyc";

  db.query(
    `SELECT * FROM ${table} WHERE id = ?`,
    [id],
    async (err, result) => {
      if (err) return res.status(500).json(err);

      if (!result.length) {
        return res.status(404).json({ error: "Record not found" });
      }

      const record = result[0];

      // ❗ must verify OTP first
      if (!record.otp_verified) {
        return res.status(400).json({
          error: "OTP not verified yet ❌",
        });
      }

      try {
        // 🔗 BLOCKCHAIN
        const tx = await contract.storeKYC(
          record.wallet_address,
          "0x" + record.hash,
          isMultiBank
        );

        await tx.wait();

        // ✅ UPDATE DB
        db.query(
          `UPDATE ${table} SET verified = true WHERE id = ?`,
          [id]
        );

        res.json({
          message: "KYC Approved & Stored on Blockchain ✅",
        });
      } catch (err) {
        console.error("BLOCKCHAIN ERROR:", err);
        res.status(500).json({
          error: "Blockchain failed ❌",
        });
      }
    }
  );
});

module.exports = router;
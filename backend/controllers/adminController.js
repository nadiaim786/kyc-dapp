// controllers/adminController.js
const db = require("../config/db");
const contract = require("../blockchain/contract");

exports.login = (req, res) => {
  const { bank_name, admin_id, secret_key } = req.body;

  db.query(
    "SELECT * FROM admins WHERE bank_name=? AND admin_id=? AND secret_key=?",
    [bank_name, admin_id, secret_key],
    (err, result) => {
      if (result.length === 0) return res.status(401).send("Invalid");
      res.send(result[0]);
    }
  );
};

exports.verifyKYC = async (req, res) => {
  const { wallet, isMultiBank } = req.body;
  const table = isMultiBank ? "multi_bank_kyc" : "single_bank_kyc";

  await contract.verifyKYC(wallet);

  db.query(
    `UPDATE ${table} SET verified=1 WHERE wallet_address=?`,
    [wallet]
  );

  res.send("KYC Verified");
};
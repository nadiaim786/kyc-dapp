// utils/hash.js
const crypto = require("crypto");

exports.hashData = (data) => {
  return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
};
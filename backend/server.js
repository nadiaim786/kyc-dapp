const express = require("express");
const cors = require("cors");

const kycRoutes = require("./routes/kycRoutes"); // ✅ correct
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/kyc", kycRoutes);
app.use("/api/admin", adminRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
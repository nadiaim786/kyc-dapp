import { useState, useEffect } from "react";
import axios from "axios";

function Otp() {
  const [wallet, setWallet] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");

  // 🧠 AUTO-LOAD WALLET FROM URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const w = params.get("wallet");
    if (w) setWallet(w);
  }, []);

  // 🔐 VERIFY OTP
  const verifyOtp = async () => {
    try {
      if (!wallet || !otp) {
        setStatus("Please enter OTP ❗");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/kyc/verify-otp",
        {
          wallet,
          otp,
          isMultiBank: false,
        }
      );

      setStatus(res.data.message || "KYC Verified Successfully 🎉");
    } catch (err) {
      console.error(err);
      setStatus("OTP verification failed ❌");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 OTP Verification</h2>

        {/* Wallet (AUTO FILLED + READ ONLY) */}
        <input
          placeholder="Wallet Address"
          value={wallet}
          style={styles.input}
          disabled
        />

        {/* OTP INPUT */}
        <input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={styles.input}
        />

        {/* VERIFY BUTTON */}
        <button onClick={verifyOtp} style={styles.button}>
          Verify OTP
        </button>

        {/* STATUS */}
        {status && <p style={styles.status}>{status}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a, #1e3a8a, #4f46e5)",
    fontFamily: "Arial",
  },

  card: {
    padding: "35px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(12px)",
    width: "420px",
    textAlign: "center",
    boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "white",
  },

  title: {
    marginBottom: "20px",
  },

  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    fontSize: "14px",
  },

  button: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "10px",
    border: "none",
    background: "#22c55e",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s",
  },

  status: {
    marginTop: "15px",
    color: "#d1d5db",
    fontSize: "14px",
  },
};

export default Otp;
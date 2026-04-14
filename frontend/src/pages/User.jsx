import { useState } from "react";
import axios from "axios";

function User() {
  const [wallet, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [showPopup, setShowPopup] = useState(true);

  const [form, setForm] = useState({
    name: "",
    idNumber: "",
    address: "",
    email: "",
    isMultiBank: false,
  });

  const [dob, setDob] = useState("");

  // 🦊 MetaMask connect
  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert("Install MetaMask");

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setWallet(accounts[0]);
      setStatus("Wallet connected ✅");
    } catch (err) {
      setStatus("Wallet connection failed ❌");
    }
  };

  // 🧾 input handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🎂 DOB handler (calendar)
  const handleDobChange = (e) => {
    setDob(e.target.value);
  };

  // 🔥 VALIDATIONS
  const isValidEmail = (email) =>
    email.includes("@") && email.includes(".com");

  const isValidAadhaar = (id) =>
    /^\d{12}$/.test(id);

  const isAdult = (dob) => {
    if (!dob) return false;
    const birthDate = new Date(dob);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    return age >= 18;
  };

  // 🚀 SUBMIT KYC
  const submitKYC = async () => {
    try {
      if (!wallet) return alert("Connect wallet first");

      if (!isAdult(dob)) {
        return setStatus("❌ Must be 18+");
      }

      if (!isValidAadhaar(form.idNumber)) {
        return setStatus("❌ Aadhaar must be 12 digits");
      }

      if (!isValidEmail(form.email)) {
        return setStatus("❌ Invalid email format");
      }

      await axios.post("http://localhost:5000/api/kyc/kyc", {
        wallet,
        ...form,
        dob,
      });

      setStatus("OTP sent to email ✅");

      setTimeout(() => {
        window.location.href = "/otp?wallet=" + wallet;
      }, 1000);

    } catch (err) {
      console.error(err);
      setStatus("KYC submission failed ❌");
    }
  };

  return (
    <div style={styles.container}>
      
      {/* 🔥 BIG MODERN POPUP */}
      {showPopup && (
        <div style={styles.overlay}>
          <div style={styles.popupBox}>
            <h1 style={styles.popupTitle}>
              ⚡ Verify Once. Use Everywhere.
            </h1>

            <p style={styles.popupText}>
              Skip repeated KYC. Save time ⏱️, reduce paperwork 📄,  
              and go fully digital with blockchain-powered verification.
            </p>

            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="KYC"
              style={styles.popupImage}
            />

            <button
              style={styles.popupBtn}
              onClick={() => setShowPopup(false)}
            >
              🚀 Get Started
            </button>
          </div>
        </div>
      )}

      {/* MAIN CARD */}
      <div style={styles.card}>
        <h2 style={styles.title}>👤 User KYC Dashboard</h2>

        <button style={styles.button} onClick={connectWallet}>
          🦊 Connect MetaMask
        </button>

        {wallet && <p style={styles.wallet}>Wallet: {wallet}</p>}

        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          style={styles.input}
        />

        {/* ✅ CALENDAR INPUT */}
        <input
          type="date"
          value={dob}
          onChange={handleDobChange}
          style={styles.input}
        />

        <input
          name="idNumber"
          placeholder="Aadhaar Number (12 digits)"
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="address"
          placeholder="Address"
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          style={styles.input}
        />

        <button style={styles.submitBtn} onClick={submitKYC}>
          🚀 Submit KYC
        </button>

        <p style={styles.status}>{status}</p>

        {/* 🔥 PROGRESS */}
        <div style={styles.progressContainer}>
          <div style={styles.progressBar}>
            <div style={styles.progressFill}></div>
          </div>
          <p style={styles.progressText}>Step 2/3 - OTP Pending</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #e0f2fe, #f8fafc)",
  },

  card: {
    padding: "30px",
    borderRadius: "16px",
    background: "white",
    width: "420px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },

  title: {
    marginBottom: "10px",
    color: "#1e3a8a",
  },

  wallet: {
    fontSize: "12px",
    color: "#6b7280",
  },

  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
    color: "#111",
  },

  button: {
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#f97316",
    color: "white",
    cursor: "pointer",
  },

  submitBtn: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#3b82f6",
    color: "white",
    cursor: "pointer",
  },

  status: {
    marginTop: "10px",
    fontSize: "14px",
  },

  progressContainer: {
    marginTop: "20px",
  },

  progressBar: {
    height: "8px",
    background: "#e5e7eb",
    borderRadius: "10px",
  },

  progressFill: {
    width: "50%",
    height: "100%",
    background: "#3b82f6",
    borderRadius: "10px",
  },

  progressText: {
    fontSize: "12px",
    marginTop: "5px",
    color: "#6b7280",
  },

  // 🔥 POPUP STYLES
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  popupBox: {
    width: "500px",
    background: "white",
    padding: "40px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },

  popupTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: "15px",
  },

  popupText: {
    fontSize: "15px",
    color: "#4b5563",
    marginBottom: "20px",
    lineHeight: "1.6",
  },

  popupImage: {
    width: "120px",
    marginBottom: "20px",
  },

  popupBtn: {
    padding: "12px 20px",
    borderRadius: "10px",
    border: "none",
    background: "#3b82f6",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default User;
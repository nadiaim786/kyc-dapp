import { useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [form, setForm] = useState({
    bank_name: "",
    admin_id: "",
    secret_key: ""
  });

  const [data, setData] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      await axios.post("http://localhost:5000/api/admin/login", form);

      setLoggedIn(true);

      const res = await axios.get("http://localhost:5000/api/admin/single");
      setData(res.data);

    } catch {
      alert("❌ Invalid credentials");
    }
  };

  const loadData = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/single");
    setData(res.data);
  };

  const approveKYC = async (id) => {
    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/admin/approve", {
        id,
        isMultiBank: false
      });

      loadData();

    } catch {
      alert("❌ Approval failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      
      <div style={styles.card}>

        {!loggedIn ? (
          <>
            <h2 style={styles.title}>🏦 Admin Login</h2>

            <input
              placeholder="Bank Name"
              onChange={(e) =>
                setForm({ ...form, bank_name: e.target.value })
              }
              style={styles.input}
            />

            <input
              placeholder="Admin ID"
              onChange={(e) =>
                setForm({ ...form, admin_id: e.target.value })
              }
              style={styles.input}
            />

            <input
              type="password"
              placeholder="Secret Key"
              onChange={(e) =>
                setForm({ ...form, secret_key: e.target.value })
              }
              style={styles.input}
            />

            <button onClick={login} style={styles.button}>
              Login
            </button>
          </>
        ) : (
          <>
            <h2 style={styles.title}>📋 KYC Records</h2>

            <button onClick={loadData} style={styles.refreshBtn}>
              🔄 Refresh
            </button>

            <div style={styles.grid}>
              {data.map((item) => (
                <div key={item.id} style={styles.record}>
                  <p><b>👛 Wallet:</b> {item.wallet_address}</p>
                  <p><b>👤 Name:</b> {item.name}</p>
                  <p><b>📧 Email:</b> {item.email}</p>

                  <p>
                    OTP:{" "}
                    <span style={{
                      color: item.otp_verified ? "#16a34a" : "#dc2626"
                    }}>
                      {item.otp_verified ? "Verified" : "Pending"}
                    </span>
                  </p>

                  <p>
                    Blockchain:{" "}
                    <span style={{
                      color: item.verified ? "#16a34a" : "#f59e0b"
                    }}>
                      {item.verified ? "Stored" : "Not Stored"}
                    </span>
                  </p>

                  {item.otp_verified && !item.verified && (
                    <button
                      onClick={() => approveKYC(item.id)}
                      style={styles.approveBtn}
                    >
                      ✅ Approve
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {loading && (
        <div style={styles.loader}>
          ⛓️ Processing Blockchain...
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#eef2ff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#111827", // ✅ GLOBAL FIX
  },

  card: {
    width: "900px",
    background: "#ffffff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },

  title: {
    marginBottom: "15px",
    color: "#111827", // ✅ FIXED
  },

  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    color: "#111827", // ✅ TEXT FIX
  },

  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#3b82f6",
    color: "#fff",
    cursor: "pointer",
  },

  refreshBtn: {
    marginBottom: "15px",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    background: "#10b981",
    color: "#fff",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px",
  },

  record: {
    padding: "15px",
    borderRadius: "12px",
    background: "#f9fafb",
    color: "#111827", // ✅ FIX
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },

  approveBtn: {
    marginTop: "10px",
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    background: "#22c55e",
    color: "#fff",
    cursor: "pointer",
  },

  loader: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontSize: "20px",
  },
};

export default AdminDashboard;
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      
      {/* NAVBAR */}
      <div style={styles.navbar}>
        <h2 style={styles.logo}>🔐 KYC Chain</h2>
      </div>

      {/* HERO */}
      <div style={styles.hero}>
        <h1 style={styles.title}>
          Verify Once. <span style={styles.highlight}>Trust Forever.</span>
        </h1>

        <p style={styles.subtitle}>
          A blockchain-powered KYC platform that eliminates repetition,
          saves time, and keeps your identity secure across institutions.
        </p>

        <div style={styles.buttons}>
          <button
            style={styles.primaryBtn}
            onClick={() => navigate("/user")}
          >
            👤 Continue as User
          </button>

          <button
            style={styles.secondaryBtn}
            onClick={() => navigate("/admin")}
          >
            🏦 Continue as Admin
          </button>
        </div>
      </div>

      {/* FEATURES */}
      <div style={styles.features}>
        <div style={styles.card}>
          ⚡ Fast
          <p>Complete KYC in seconds</p>
        </div>

        <div style={styles.card}>
          🔐 Secure
          <p>Blockchain encrypted data</p>
        </div>

        <div style={styles.card}>
          🌍 Reusable
          <p>Use once across banks</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
    fontFamily: "sans-serif",
    color: "#111827", // ✅ GLOBAL TEXT FIX
  },

  navbar: {
    padding: "20px 40px",
  },

  logo: {
    color: "#1e3a8a",
    fontWeight: "600",
  },

  hero: {
    textAlign: "center",
    padding: "80px 20px",
  },

  title: {
    fontSize: "44px",
    fontWeight: "700",
    color: "#111827", // ✅ visible
  },

  highlight: {
    color: "#3b82f6",
  },

  subtitle: {
    marginTop: "15px",
    fontSize: "16px",
    color: "#4b5563", // ✅ visible grey
    maxWidth: "550px",
    marginInline: "auto",
  },

  buttons: {
    marginTop: "30px",
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },

  primaryBtn: {
    padding: "12px 22px",
    borderRadius: "10px",
    border: "none",
    background: "#3b82f6",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
  },

  secondaryBtn: {
    padding: "12px 22px",
    borderRadius: "10px",
    border: "1px solid #3b82f6",
    background: "#fff",
    color: "#3b82f6",
    cursor: "pointer",
    fontSize: "16px",
  },

  features: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    padding: "40px",
  },

  card: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    width: "200px",
    textAlign: "center",
    color: "#111827", // ✅ FIX TEXT
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  },
};

export default Home;
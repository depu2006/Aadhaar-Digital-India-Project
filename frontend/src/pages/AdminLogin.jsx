export default function AdminLogin({ onSuccess, onCancel }) {
  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;

    if (email.endsWith("@uidai.gov.in")) {
      onSuccess();
    } else {
      alert("Access restricted to UIDAI officials.");
    }
  };

  return (
    <div style={container}>
      <form onSubmit={handleLogin} style={card}>
        <h3>UIDAI Admin Login</h3>

        <input
          name="email"
          type="email"
          placeholder="official@uidai.gov.in"
          required
          style={input}
        />

        <button style={loginBtn}>Login</button>
        <button type="button" onClick={onCancel} style={cancelBtn}>
          Cancel
        </button>
      </form>
    </div>
  );
}

/* STYLES */
const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#0f172a",
};

const card = {
  background: "#fff",
  padding: "32px",
  borderRadius: "14px",
  width: "360px",
  textAlign: "center",
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "16px",
};

const loginBtn = {
  width: "100%",
  padding: "12px",
  background: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "8px",
};

const cancelBtn = {
  marginTop: "10px",
  background: "transparent",
  border: "none",
  color: "#64748b",
};

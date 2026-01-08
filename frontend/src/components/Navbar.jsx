export default function Navbar({ active, setActive, onLogout }) {
  const tabs = [
    "Overview",
    "Demand Analysis",
    "Friction Analysis",
    "Crowd Prediction Map",
    "Demand Table"
  ];

  return (
    <div style={styles.navbar}>

      {/* LEFT: APP NAME */}
      {/* LEFT: APP NAME (Official Branding) */}
      <div style={styles.logoSection}>
        <img
          src="https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/Aadhaar_Logo.svg/1200px-Aadhaar_Logo.svg.png"
          alt="Aadhaar Logo"
          style={styles.logo}
        />
        <div style={styles.brandText}>
          <h1 style={styles.brandTitle}>Unique Identification Authority of India</h1>
          <span style={styles.brandSubtitle}>Government of India</span>
        </div>
      </div>

      {/* CENTER: NAV BUTTONS */}
      <div style={styles.centerMenu}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            style={{
              ...styles.button,
              ...(active === tab ? styles.activeButton : {})
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* RIGHT: LOGOUT */}
      <div style={styles.logout}>
        <button style={styles.logoutButton} onClick={onLogout}>Logout</button>
      </div>

    </div>
  );
}

const styles = {
  navbar: {
    position: "sticky",
    top: 0,
    left: 0,
    width: "100%",
    height: "94px",
    background: "linear-gradient(90deg, #F6B323 0%, #F05A28 50%, #E91E63 100%)", // Ombre Gradient
    backdropFilter: "blur(10px)",
    color: "white",
    display: "grid", // Grid for robust centering
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    padding: "0 32px",
    zIndex: 1000,
    boxSizing: "border-box",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 4px 15px rgba(240, 90, 40, 0.3)"
  },

  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "rgba(255, 255, 255, 0.15)",
    padding: "6px 12px",
    borderRadius: "12px",
    backdropFilter: "blur(4px)",
    border: "1px solid rgba(255,255,255,0.1)",
    zIndex: 2,
    justifySelf: "start", // Grid alignment
    maxWidth: "100%", // Prevent blowout
  },
  // ... (logo, brandText, brandTitle, brandSubtitle remain unchanged)
  logo: {
    height: "42px",
    objectFit: "contain",
    background: "white",
    padding: "4px",
    borderRadius: "8px",
  },
  brandText: {
    display: "flex",
    flexDirection: "column",
  },
  brandTitle: {
    fontSize: "0.95rem",
    fontWeight: "800",
    margin: 0,
    letterSpacing: "0.5px",
    color: "#ffffff",
    textShadow: "0 1px 2px rgba(0,0,0,0.1)",
    fontFamily: "'Inter', sans-serif"
  },
  brandSubtitle: {
    fontSize: "0.65rem",
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  centerMenu: {
    display: "flex", // Removed absolute positioning
    gap: "4px", // Reduced gap
    background: "rgba(255, 255, 255, 0.15)",
    padding: "6px",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    justifySelf: "center", // Grid alignment
    marginLeft: "50px", // Nudge right
  },

  button: {
    background: "transparent",
    border: "none",
    color: "rgba(255, 255, 255, 0.7)",
    padding: "8px 12px", // Reduced padding
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "600",
    whiteSpace: "nowrap",
    transition: "all 0.2s ease",
  },

  activeButton: {
    background: "rgba(255, 255, 255, 0.25)",
    color: "white",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)"
  },

  logout: {
    justifySelf: "end", // Grid alignment
    zIndex: 2
  },

  logoutButton: {
    background: "white",
    border: "none",
    color: "#dc2626", // Red text for contrast and semantic meaning
    padding: "10px 24px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "600",
    boxShadow: "0 4px 12px rgba(220, 38, 38, 0.2)",
    transition: "transform 0.2s"
  }
};

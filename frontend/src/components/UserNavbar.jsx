import React, { useState, useEffect } from "react";
import { FiLogOut, FiMenu, FiX, FiGlobe } from "react-icons/fi";

export default function UserNavbar({ onLogout }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav style={{ ...styles.navbar, ...(isScrolled ? styles.scrolled : {}) }}>
        <div style={styles.container}>
          {/* Logo Section */}
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

          {/* Desktop Menu */}
          <div style={styles.desktopMenu}>
            {/* Cleaned up links as requested */}

            <div style={styles.langSelector}>
              <FiGlobe /> English
            </div>

            <div style={styles.divider}></div>

            <button onClick={onLogout} style={styles.logoutBtn}>
              <FiLogOut /> Logout
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            style={styles.mobileToggle}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div style={styles.mobileMenu}>
          <button style={styles.mobileNavLink}>My Aadhaar</button>
          <button style={styles.mobileNavLink}>About UIDAI</button>
          <button style={styles.mobileNavLink}>Ecosystem</button>
          <button onClick={onLogout} style={styles.mobileLogoutBtn}>
            Logout
          </button>
        </div>
      )}
    </>
  );
}

const styles = {
  navbar: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    width: "100%",
    background: "linear-gradient(90deg, #F6B323 0%, #F05A28 50%, #E91E63 100%)", // Ombre: Yellow -> Orange -> Pink
    color: "white",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(240, 90, 40, 0.3)",
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 24px",
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    background: "rgba(255, 255, 255, 0.2)",
    padding: "8px 16px",
    borderRadius: "12px",
    backdropFilter: "blur(4px)",
  },
  logo: {
    height: "50px",
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
    fontSize: "1.1rem",
    fontWeight: "800",
    margin: 0,
    letterSpacing: "0.5px",
    color: "#ffffff",
    textShadow: "0 1px 2px rgba(0,0,0,0.1)",
  },
  brandSubtitle: {
    fontSize: "0.75rem",
    fontWeight: "600",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: "1px",
    opacity: 0.9,
  },
  desktopMenu: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    "@media (max-width: 1024px)": {
      display: "none",
    },
  },
  // Removed unused navLink style
  divider: {
    width: "1px",
    height: "24px",
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  langSelector: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.95rem",
    cursor: "pointer",
    fontWeight: "600",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "white",
    color: "#dc2626", // Red text for contrast
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s",
    ":hover": {
      backgroundColor: "#b91c1c",
    },
  },
  mobileToggle: {
    display: "none",
    background: "none",
    border: "none",
    color: "white",
    fontSize: "24px",
    cursor: "pointer",
    "@media (max-width: 1024px)": {
      display: "block",
    },
  },
  mobileMenu: {
    position: "fixed",
    top: "80px",
    left: 0,
    right: 0,
    backgroundColor: "#0B1E40",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    zIndex: 999,
  },
  mobileNavLink: {
    background: "none",
    border: "none",
    color: "white",
    textAlign: "left",
    fontSize: "1.1rem",
    padding: "12px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  mobileLogoutBtn: {
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    marginTop: "12px",
    fontWeight: "600",
  }
};

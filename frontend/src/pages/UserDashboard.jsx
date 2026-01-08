import { useState, useEffect } from "react";
import UserNavbar from "../components/UserNavbar";
import ServiceCard from "../components/ServiceCard";
import SmartCentreLocator from "../components/SmartCentreLocator";
import DocumentChecklist from "../components/DocumentChecklist";
import { FiDownload, FiCheckCircle, FiUserCheck, FiMapPin, FiFileText, FiClock, FiCreditCard } from "react-icons/fi";

export default function UserDashboard({ onLogout }) {
  const [locatorView, setLocatorView] = useState(false);

  return (
    <div style={styles.page}>
      <UserNavbar onLogout={onLogout} />

      {/* HERO BANNER SECTION */}
      <section style={styles.heroSection}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Welcome to myAadhaar</h1>
          <p style={styles.heroSubtitle}>
            Access all Aadhaar services online – conveniently, securely, and seamlessly.
          </p>
        </div>
        <ImageCarousel />
      </section>

      <main style={styles.main}>

        {/* IMPORTANT ALERT */}
        <div style={styles.alertBox}>
          <span style={styles.alertIcon}>📢</span>
          <p style={styles.alertText}>
            <strong>Keep your Aadhaar details updated</strong> to avail government services seamlessly.
            <span style={{ color: "#d97706", fontWeight: "600", marginLeft: "6px" }}>Update online is FREE till 14/06/2026.</span>
          </p>
        </div>

        {/* SERVICE GRID */}
        <h2 style={styles.sectionTitle}>Aadhaar Services</h2>
        <div style={styles.serviceGrid}>
          {/* Functional Cards Only */}
          <ServiceCard
            icon={<FiMapPin />}
            title="Locate Enrolment Center"
            description="Find authorized Aadhaar Seva Kendras near you based on your location."
            color="#E91E63" // Pink (Ombre theme match)
            onClick={() => setLocatorView(!locatorView)}
          />
          <ServiceCard
            icon={<FiFileText />}
            title="Check Required Documents"
            description="View the list of supporting documents required for Aadhaar enrolment and updates."
            color="#F05A28" // Orange (Ombre theme match)
          />
        </div>

        {/* LOCATOR & CHECKLIST SECTION */}
        {locatorView && (
          <div style={styles.bentoSection}>
            <div style={styles.sectionHeader}>
              <h2><FiMapPin style={{ marginRight: "10px" }} /> Aadhaar Seva Kendras</h2>
              <button style={styles.closeBtn} onClick={() => setLocatorView(false)}>Close Locator</button>
            </div>
            <div style={styles.gridContainer}>
              <div style={styles.locatorWrapper}>
                <SmartCentreLocator />
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: "40px" }}>
          <h2 style={styles.sectionTitle}>Supporting Documents</h2>
          <div style={styles.docWrapper}>
            <DocumentChecklist />
          </div>
        </div>

      </main>

      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p>Copyright © 2025 Unique Identification Authority of India All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
}

// Image Carousel Component (as Banner)
function ImageCarousel() {
  const images = [
    "/assets/hero_1.png",
    "/assets/hero_2.png",
    "/assets/hero_3.png",
    "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div style={styles.carouselBg}>
      {images.map((src, idx) => (
        <img
          key={idx}
          src={src}
          alt="Slide"
          style={{
            ...styles.carouselImg,
            opacity: current === idx ? 0.6 : 0, // Increased opacity for better visibility
          }}
        />
      ))}
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#F3F4F6", // Light grey background like portal
    fontFamily: "'Inter', sans-serif",
  },
  main: {
    width: "100%",
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "0 24px 60px 24px",
    position: "relative",
    top: "-60px", // Pull up content over banner
    zIndex: 10,
  },

  // Hero Section
  heroSection: {
    height: "320px",
    background: "linear-gradient(90deg, #F6B323 0%, #F05A28 50%, #E91E63 100%)", // Ombre: Yellow -> Orange -> Pink
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(90deg, rgba(246, 179, 35, 0.85) 0%, rgba(233, 30, 99, 0.85) 100%)", // High opacity to keep text readable but show hint of image
    zIndex: 2,
  },
  heroContent: {
    position: "relative",
    zIndex: 3,
    textAlign: "center",
    color: "white",
    maxWidth: "800px",
    padding: "20px",
  },
  heroTitle: {
    fontSize: "3rem",
    fontWeight: "700",
    marginBottom: "16px",
    letterSpacing: "-1px",
    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  heroSubtitle: {
    fontSize: "1.2rem",
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },

  // Carousel Background
  carouselBg: {
    position: "absolute",
    inset: 0,
    zIndex: 1,
  },
  carouselImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    position: "absolute",
    top: 0,
    left: 0,
    transition: "opacity 1s ease-in-out",
  },

  // Alert Box
  alertBox: {
    background: "white",
    borderRadius: "12px",
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    marginBottom: "40px",
    borderLeft: "4px solid #F59E0B", // Warning color
  },
  alertIcon: {
    fontSize: "24px",
  },
  alertText: {
    color: "#1f2937",
    fontSize: "0.95rem",
    margin: 0,
  },

  // Service Grid
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "24px",
    borderLeft: "4px solid #E91E63", // Pink accent
    paddingLeft: "16px",
  },
  serviceGrid: {
    display: "flex", // Changed to flex for centering
    justifyContent: "center", // Center items
    flexWrap: "wrap",
    gap: "24px",
    marginBottom: "40px",
  },

  // Locator Section
  bentoSection: {
    backgroundColor: "white",
    padding: "32px",
    borderRadius: "24px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
    marginBottom: "40px",
    animation: "fadeIn 0.3s ease-in-out",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    color: "#0B1E40",
  },
  closeBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  gridContainer: {
    maxWidth: "100%",
  },
  locatorWrapper: {
    height: "300px",
    overflowY: "auto", // Scroll vertical
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
  },

  // Doc Wrapper
  docWrapper: {
    background: "white",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
  },

  footer: {
    textAlign: "center",
    padding: "32px 0",
    color: "#fff",
    fontSize: "0.85rem",
    background: "#0B1E40",
  },
  footerContent: {
    maxWidth: "1280px",
    margin: "0 auto",
  }
};

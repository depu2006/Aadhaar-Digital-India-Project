import { useState } from "react";

export default function LoginPage({ onLogin }) {
    const [activeTab, setActiveTab] = useState("user"); // 'user' | 'admin'
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");

        // Simple validation for demo
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        const endpoint = isSignup ? "/signup" : "/login";

        try {
            const response = await fetch(`http://localhost:8000${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: activeTab,
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if (data.success) {
                if (isSignup) {
                    setSuccessMsg(data.message);
                    setIsSignup(false); // Switch back to login
                    setPassword("");
                } else {
                    onLogin(data.role); // 'admin' or 'user'
                }
            } else {
                setError(data.message || "Action failed");
            }
        } catch (err) {
            setError("Failed to connect to server");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <img
                        src="https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/Aadhaar_Logo.svg/1200px-Aadhaar_Logo.svg.png"
                        alt="Aadhaar Logo"
                        style={styles.logo}
                    />
                    <h2 style={styles.title}>UIDAI Service Portal</h2>
                </div>

                <div style={styles.tabs}>
                    <button
                        style={{ ...styles.tab, ...(activeTab === "user" ? styles.activeTab : {}) }}
                        onClick={() => setActiveTab("user")}
                    >
                        Citizen
                    </button>
                    <button
                        style={{ ...styles.tab, ...(activeTab === "admin" ? styles.activeTab : {}) }}
                        onClick={() => setActiveTab("admin")}
                    >
                        Admin
                    </button>
                </div>

                <h3 style={{ textAlign: "center", marginBottom: "20px", color: "#334155" }}>
                    {isSignup ? `Create ${activeTab === 'admin' ? 'Official' : 'Citizen'} Account` : "Login"}
                </h3>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>
                            {activeTab === "admin" ? "Official Email ID" : "Email / Mobile"}
                        </label>
                        <input
                            type={activeTab === "admin" ? "email" : "text"}
                            placeholder={activeTab === "admin" ? "official@uidai.gov.in" : "Enter your ID"}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                        />
                    </div>

                    {error && <p style={styles.error}>{error}</p>}
                    {successMsg && <p style={styles.success}>{successMsg}</p>}

                    <button type="submit" style={styles.submitBtn}>
                        {isSignup ? "Sign Up" : "Login"}
                    </button>
                </form>

                <p style={styles.footerText}>
                    {isSignup ? "Already have an account?" : "New user?"}{" "}
                    <button
                        onClick={() => {
                            setIsSignup(!isSignup);
                            setError("");
                            setSuccessMsg("");
                        }}
                        style={styles.linkBtn}
                    >
                        {isSignup ? "Login here" : "Create account"}
                    </button>
                </p>
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
        // Layered Background: Light Ombre Gradient Overlay + Aadhaar Image
        background: `
            linear-gradient(135deg, rgba(246, 179, 35, 0.85) 0%, rgba(240, 90, 40, 0.80) 50%, rgba(233, 30, 99, 0.85) 100%),
            url('https://wpblogassets.paytm.com/paytmblog/uploads/2023/08/Blog_Paytm_Aadhar-Card-Enrollment-Centers-In-Delhi.jpg')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: "'Inter', sans-serif",
        padding: "20px",
    },
    card: {
        backgroundColor: "rgba(255, 255, 255, 0.95)", // Slight translucency
        padding: "48px 40px",
        borderRadius: "24px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)", // Elevate card
        width: "100%",
        maxWidth: "440px",
        backdropFilter: "blur(10px)",
    },
    header: {
        textAlign: "center",
        marginBottom: "32px",
    },
    logo: {
        height: "56px",
        marginBottom: "16px",
        filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
    },
    title: {
        margin: 0,
        fontSize: "26px",
        color: "#1e293b",
        fontWeight: "800",
        letterSpacing: "-0.5px",
    },
    tabs: {
        display: "flex",
        marginBottom: "32px",
        backgroundColor: "#f1f5f9",
        padding: "5px",
        borderRadius: "12px",
    },
    tab: {
        flex: 1,
        padding: "12px",
        border: "none",
        background: "transparent",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        color: "#64748b",
        transition: "all 0.2s ease",
    },
    activeTab: {
        backgroundColor: "white",
        color: "#E91E63", // Brand Pink
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        fontWeight: "700"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "24px",
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    label: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#334155",
    },
    input: {
        padding: "14px",
        borderRadius: "10px",
        border: "1px solid #cbd5e1",
        fontSize: "15px",
        outline: "none",
        transition: "all 0.2s",
        backgroundColor: "#f8fafc",
    },
    submitBtn: {
        padding: "16px",
        background: "linear-gradient(90deg, #F05A28 0%, #E91E63 100%)", // Brand Gradient Button
        color: "white",
        border: "none",
        borderRadius: "10px",
        fontSize: "16px",
        fontWeight: "700",
        cursor: "pointer",
        transition: "transform 0.1s, box-shadow 0.2s",
        marginTop: "12px",
        boxShadow: "0 4px 12px rgba(233, 30, 99, 0.3)",
    },
    error: {
        color: "#ef4444",
        fontSize: "14px",
        margin: 0,
        textAlign: "center",
        background: "#fef2f2",
        padding: "10px",
        borderRadius: "8px",
    },
    success: {
        color: "#16a34a",
        fontSize: "14px",
        margin: 0,
        textAlign: "center",
        background: "#f0fdf4",
        padding: "10px",
        borderRadius: "8px",
    },
    footerText: {
        marginTop: "32px",
        textAlign: "center",
        fontSize: "14px",
        color: "#64748b",
    },
    linkBtn: {
        color: "#E91E63", // Brand color
        background: "none",
        border: "none",
        cursor: "pointer",
        fontWeight: "600",
        padding: 0,
        marginLeft: "5px",
        fontSize: "inherit"
    },
};

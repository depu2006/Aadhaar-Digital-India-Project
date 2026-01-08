import React from 'react';
import { FiChevronRight } from 'react-icons/fi';

const ServiceCard = ({ icon, title, description, color, onClick }) => {
    return (
        <div
            style={styles.card}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(0, 0, 0, 0.1)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05)";
            }}
            onClick={onClick}
        >
            <div style={styles.header}>
                <div style={{ ...styles.iconBox, color: color, backgroundColor: `${color}15` }}>
                    {icon}
                </div>
                <FiChevronRight style={{ color: "#cbd5e1", fontSize: "1.2rem" }} />
            </div>

            <h3 style={styles.title}>{title}</h3>
            <p style={styles.description}>{description}</p>

            <div style={{ ...styles.statusBar, backgroundColor: color }}></div>
        </div>
    );
};

const styles = {
    card: {
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "24px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        cursor: "pointer",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "8px",
    },
    iconBox: {
        width: "56px",
        height: "56px",
        borderRadius: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "28px",
    },
    title: {
        fontSize: "1.1rem",
        fontWeight: "700",
        color: "#1e293b",
        margin: 0,
        lineHeight: "1.3",
    },
    description: {
        fontSize: "0.9rem",
        color: "#64748b",
        margin: 0,
        lineHeight: "1.5",
    },
    statusBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "4px",
    }
};

export default ServiceCard;

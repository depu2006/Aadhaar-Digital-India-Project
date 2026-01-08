import { useState, useEffect } from "react";

export default function DocumentChecklist() {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState("");
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch available services on mount
        fetch("http://localhost:8000/services")
            .then((res) => res.json())
            .then((data) => {
                setServices(data);
                if (data.length > 0) {
                    setSelectedService(data[0].id); // Select first by default
                }
            })
            .catch((err) => console.error("Failed to load services", err));
    }, []);

    useEffect(() => {
        if (!selectedService) return;

        setLoading(true);
        fetch(`http://localhost:8000/documents?service_id=${selectedService}`)
            .then((res) => res.json())
            .then((data) => {
                setDocuments(data.documents || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load documents", err);
                setLoading(false);
            });
    }, [selectedService]);

    return (
        <div style={container}>
            <h3 style={{ marginBottom: "16px" }}>📋 Document Checklist</h3>
            <p style={{ color: "#475569", marginBottom: "20px" }}>
                Select a service to see required documents.
            </p>

            <div style={control}>
                <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    style={select}
                >
                    {services.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                    ))}
                </select>
            </div>

            <div style={listContainer}>
                {loading ? (
                    <p>Loading documents...</p>
                ) : (
                    <ul style={ul}>
                        {documents.length > 0 ? (
                            documents.map((doc, idx) => (
                                <li key={idx} style={li}>
                                    <span style={checkIcon}>✓</span> {doc}
                                </li>
                            ))
                        ) : (
                            <p>No specific documents required.</p>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
}

const container = {
    background: "white",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
};

const control = {
    marginBottom: "20px",
};

const select = {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    background: "#f8fafc",
    fontSize: "1rem",
    outline: "none",
    cursor: "pointer",
};

const listContainer = {
    background: "#f1f5f9",
    padding: "20px",
    borderRadius: "12px",
};

const ul = {
    listStyle: "none",
    padding: 0,
    margin: 0,
};

const li = {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "12px",
    color: "#334155",
    lineHeight: "1.5",
};

const checkIcon = {
    color: "#16a34a",
    fontWeight: "bold",
    fontSize: "1.1rem",
};

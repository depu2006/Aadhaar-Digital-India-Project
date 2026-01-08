import { useEffect, useState } from "react";
import { fetchSummary } from "../api/api";

export default function KPICards() {
  const [kpi, setKpi] = useState(null);

  useEffect(() => {
    fetchSummary().then(setKpi);
  }, []);

  if (!kpi) {
    return <p>Loading key indicators...</p>;
  }

  return (
    <div className="fade-up" style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>

      <div className="card red" style={{ padding: "16px", flex: 1 }}>
        <h3 style={{ fontSize: "1.1rem", margin: "0 0 8px 0" }}>High Friction</h3>
        <p style={{ fontSize: "1.8rem", fontWeight: "800", margin: "0", color: "#1e293b" }}>
          {kpi.high_lifecycle_friction_pct}%
        </p>
        <p style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "4px" }}>
          Districts with update difficulties
        </p>
      </div>

      <div className="card yellow" style={{ padding: "16px", flex: 1 }}>
        <h3 style={{ fontSize: "1.1rem", margin: "0 0 8px 0" }}>High Dependency</h3>
        <p style={{ fontSize: "1.8rem", fontWeight: "800", margin: "0", color: "#1e293b" }}>
          {kpi.high_update_dependency_pct}%
        </p>
        <p style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "4px" }}>
          Heavily dependent regions
        </p>
      </div>

      <div className="card green" style={{ padding: "16px", flex: 1 }}>
        <h3 style={{ fontSize: "1.1rem", margin: "0 0 8px 0" }}>High Demand</h3>
        <p style={{ fontSize: "1.8rem", fontWeight: "800", margin: "0", color: "#1e293b" }}>
          {kpi.high_demand_forecast_pct}%
        </p>
        <p style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "4px" }}>
          Expected high crowd districts
        </p>
      </div>

    </div>
  );
}
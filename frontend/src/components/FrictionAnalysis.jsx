import { useEffect, useState } from "react";
import { fetchFrictionAge } from "../api/api";

/* =====================================================
   ✅ CANONICAL STATE DICTIONARY (SINGLE SOURCE OF TRUTH)
===================================================== */
const CANONICAL_STATES = {
  "andaman & nicobar islands": "Andaman & Nicobar Islands",
  "andaman and nicobar islands": "Andaman & Nicobar Islands",
  "andhra pradesh": "Andhra Pradesh",
  "arunachal pradesh": "Arunachal Pradesh",
  "assam": "Assam",
  "bihar": "Bihar",
  "chandigarh": "Chandigarh",
  "chhattisgarh": "Chhattisgarh",
  "delhi": "Delhi",
  "goa": "Goa",
  "gujarat": "Gujarat",
  "haryana": "Haryana",
  "himachal pradesh": "Himachal Pradesh",
  "jharkhand": "Jharkhand",
  "karnataka": "Karnataka",
  "kerala": "Kerala",
  "ladakh": "Ladakh",
  "lakshadweep": "Lakshadweep",
  "madhya pradesh": "Madhya Pradesh",
  "maharashtra": "Maharashtra",
  "manipur": "Manipur",
  "meghalaya": "Meghalaya",
  "mizoram": "Mizoram",
  "nagaland": "Nagaland",
  "odisha": "Odisha",
  "orissa": "Odisha",
  "pondicherry": "Puducherry",
  "puducherry": "Puducherry",
  "punjab": "Punjab",
  "rajasthan": "Rajasthan",
  "sikkim": "Sikkim",
  "tamil nadu": "Tamil Nadu",
  "telangana": "Telangana",
  "tripura": "Tripura",
  "uttar pradesh": "Uttar Pradesh",
  "uttarakhand": "Uttarakhand",
  "west bengal": "West Bengal",
  "west bangal": "West Bengal",
  "westbengal": "West Bengal",
  "west  bengal": "West Bengal",
  "jammu & kashmir": "Jammu & Kashmir",
  "jammu and kashmir": "Jammu & Kashmir",
  "dadra & nagar haveli": "Dadra & Nagar Haveli and Daman & Diu",
  "dadra and nagar haveli": "Dadra & Nagar Haveli and Daman & Diu",
  "daman & diu": "Dadra & Nagar Haveli and Daman & Diu",
  "daman and diu": "Dadra & Nagar Haveli and Daman & Diu",
  "dadra & nagar haveli & daman & diu": "Dadra & Nagar Haveli and Daman & Diu",
  "dadra and nagar haveli and daman and diu": "Dadra & Nagar Haveli and Daman & Diu",
  "the dadra & nagar haveli & daman & diu": "Dadra & Nagar Haveli and Daman & Diu",
  "the dadra and nagar haveli and daman and diu": "Dadra & Nagar Haveli and Daman & Diu",
};

// 🔧 Normalize raw CSV value → canonical state
const normalizeState = (raw) => {
  if (!raw) return null;
  const key = raw.toLowerCase().trim();
  return CANONICAL_STATES[key] || null;
};

export default function FrictionAnalysis() {
  const [data, setData] = useState([]);
  const [state, setState] = useState("All");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFrictionAge()
      .then(result => {
        if (result.error) {
          setError(result.error);
        } else {
          setData(result);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="section"><p>Loading friction analysis...</p></div>;
  }

  if (error) {
    return <div className="section"><p style={{ color: "red" }}>Error: {error}</p></div>;
  }

  // Build unique states using canonical normalization
  const stateSet = new Set();
  data.forEach(row => {
    const normalized = normalizeState(row.state);
    if (normalized) stateSet.add(normalized);
  });
  const states = ["All", ...Array.from(stateSet).sort()];

  const filtered =
    state === "All" ? data : data.filter(d => normalizeState(d.state) === state);

  return (
    <div className="section">
      <h1>Citizen Lifecycle Friction Analysis (Age-Based)</h1>

      <p className="section-desc">
        This page shows which age groups update Aadhaar most often.
        It helps understand where people face repeated Aadhaar update problems.
      </p>

      {/* State Filter */}
      <select
        value={state}
        onChange={e => setState(e.target.value)}
        style={{
          marginBottom: "16px",
          padding: "8px",
          border: "1px solid #cbd5f5",
          borderRadius: "4px",
          backgroundColor: "white",
          fontSize: "0.95rem"
        }}
      >
        {states.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {filtered.length === 0 ? (
        <p style={{ color: "#666" }}>No data available for this state</p>
      ) : (
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "16px"
        }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #cbd5f5",background: "linear-gradient(90deg, #F6B323 0%, #F05A28 50%, #E91E63 100%)" }}>
              <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>State</th>
              <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Age Group</th>
              <th style={{ padding: "12px", textAlign: "right", fontWeight: "600" }}>Number of Updates</th>
              <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Friction Level</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "12px" }}>{normalizeState(row.state) || row.state}</td>
                <td style={{ padding: "12px" }}>{row.age_group}</td>
                <td style={{ padding: "12px", textAlign: "right" }}>{Number(row.num_updates).toLocaleString()}</td>
                <td style={{ padding: "12px" }}>
                  <span className={`badge ${row.friction_level === "High" ? "red" :
                    row.friction_level === "Medium" ? "yellow" : "green"
                    }`}>
                    {row.friction_level}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p className="sub-desc" style={{ marginTop: "16px" }}>
        <b>Interpretation:</b> High friction age groups indicate mandatory or
        failure-driven Aadhaar updates and should be prioritized for outreach
        or process optimization.
      </p>
    </div>
  );
}

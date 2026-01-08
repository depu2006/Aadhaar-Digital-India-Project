import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

/* =====================================================
   ✅ CANONICAL STATE MAP (DEDUPLICATION FIX)
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

  "jammu & kashmir": "Jammu & Kashmir",
  "jammu and kashmir": "Jammu & Kashmir",

  "dadra & nagar haveli": "Dadra & Nagar Haveli and Daman & Diu",
  "dadra and nagar haveli": "Dadra & Nagar Haveli and Daman & Diu",
  "daman & diu": "Dadra & Nagar Haveli and Daman & Diu",
  "daman and diu": "Dadra & Nagar Haveli and Daman & Diu",
};

/* Normalize raw state */
const normalizeState = (raw) => {
  if (!raw) return null;
  const key = raw.toLowerCase().trim();
  return CANONICAL_STATES[key] || null;
};

export default function DemandCharts({ data }) {
  const [state, setState] = useState("All");

  /* ===============================
     ✅ UNIQUE STATE DROPDOWN
  ================================ */
  const states = useMemo(() => {
    const set = new Set();
    data.forEach((row) => {
      const s = normalizeState(row.state);
      if (s) set.add(s);
    });
    return ["All", ...Array.from(set).sort()];
  }, [data]);

  /* ===============================
     ✅ FILTER DATA BY STATE
  ================================ */
  const filtered =
    state === "All"
      ? data
      : data.filter((d) => normalizeState(d.state) === state);

  if (!filtered.length) {
    return <p>No data available</p>;
  }

  /* ===============================
     ✅ DEMAND SUMMARY
  ================================ */
  const summary = [
    {
      name: "Low Demand",
      value: filtered.filter(
        (d) => d.Next_Month_Demand === "Low Demand"
      ).length,
      color: "#22c55e",
    },
    {
      name: "Medium Demand",
      value: filtered.filter(
        (d) => d.Next_Month_Demand === "Medium Demand"
      ).length,
      color: "#eab308",
    },
    {
      name: "High Demand",
      value: filtered.filter(
        (d) => d.Next_Month_Demand === "High Demand"
      ).length,
      color: "#ef4444",
    },
  ];

  return (
    <div className="section">
      <h2>📊 Demand Analysis</h2>

      <p className="section-desc">
        This chart shows Aadhaar service demand distribution.
        Select a state to view state-specific demand levels.
      </p>

      {/* STATE DROPDOWN */}
      <select
        value={state}
        onChange={(e) => setState(e.target.value)}
        style={{
          marginBottom: "16px",
          padding: "8px 12px",
          borderRadius: "6px",
          border: "1px solid #cbd5e1",
          fontSize: "0.95rem",
          background: "white",
        }}
      >
        {states.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* BAR CHART */}
      <div style={{ width: "100%", height: "320px", marginTop: "20px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={summary}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "#64748b" }}
              axisLine={{ stroke: "#cbd5e1" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "#f1f5f9" }}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {summary.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

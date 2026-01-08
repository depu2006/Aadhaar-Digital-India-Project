import { useMemo, useState } from "react";

/* ===============================
   🔴 DEMAND PRIORITY
================================ */
const DEMAND_PRIORITY = {
  "High Demand": 3,
  "Medium Demand": 2,
  "Low Demand": 1,
};

/* ===============================
   🔧 COMMON NORMALIZER
================================ */
const canonicalize = (value) =>
  value
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/\band\b/g, "&")
    .replace(/\s+/g, " ")
    .trim();

/* ===============================
   ✅ STATE NORMALIZATION
================================ */
const STATE_MAP = {
  "west bengal": "West Bengal",
  "westbengal": "West Bengal",
  "west bangal": "West Bengal",

  "andhra pradesh": "Andhra Pradesh",
  "telangana": "Telangana",

  "odisha": "Odisha",
  "orissa": "Odisha",

  "pondicherry": "Puducherry",
  "puducherry": "Puducherry",

  "andaman & nicobar islands": "Andaman & Nicobar Islands",
  "andaman and nicobar islands": "Andaman & Nicobar Islands",

  "dadra & nagar haveli": "Dadra & Nagar Haveli & Daman & Diu",
  "daman & diu": "Dadra & Nagar Haveli & Daman & Diu",
  "dadra and nagar haveli and daman and diu":
    "Dadra & Nagar Haveli & Daman & Diu",
};

const normalizeState = (state) => {
  if (!state) return null;
  if (/^\d+$/.test(state)) return null;

  const key = canonicalize(state);
  return STATE_MAP[key] || key.replace(/\b\w/g, (c) => c.toUpperCase());
};

/* ===============================
   ✅ DISTRICT NORMALIZATION
================================ */
const DISTRICT_MAP = {
  // Andhra Pradesh
  "karim nagar": "Karimnagar",
  "karimnagar": "Karimnagar",

  "k.v rangareddy": "K.V. Rangareddy",
  "k.v.rangareddy": "K.V. Rangareddy",
  "rangareddi": "K.V. Rangareddy",

  "mahabubnagar": "Mahabubnagar",
  "mahbubnagar": "Mahabubnagar",

  "spsr nellore": "SPSR Nellore",
  "sri potti sriramulu nellore": "SPSR Nellore",

  "visakhapatnam": "Visakhapatnam",

  // Telangana
  "medchal-malkajgiri": "Medchal–Malkajgiri",
  "medchal malkajgiri": "Medchal–Malkajgiri",
  "medchal?malkajgiri": "Medchal–Malkajgiri",

  "warangal urban": "Warangal Urban",
  "warangal rural": "Warangal Rural",

  "jangaon": "Jangaon",

  // West Bengal
  "hooghly": "Hooghly",
  "hugli": "Hooghly",

  "barddhaman": "Bardhaman",
  "purba bardhaman": "Bardhaman",
  "paschim bardhaman": "Bardhaman",

  "darjeeling": "Darjeeling",
  "darjiling": "Darjeeling",

  "north 24 parganas": "North 24 Parganas",
  "north twenty four parganas": "North 24 Parganas",

  "south 24 pargana": "South 24 Parganas",
  "south 24 parganas": "South 24 Parganas",
  "south twenty four parganas": "South 24 Parganas",

  "malda": "Malda",
  "maldah": "Malda",

  "medinipur": "Medinipur",
  "midnapore": "Medinipur",
  "east midnapore": "East Medinipur",
  "east midnapur": "East Medinipur",
  "west midnapore": "West Medinipur",

  "kolkata": "Kolkata",
  "calcutta": "Kolkata",

  "nadia": "Nadia",
};

const normalizeDistrict = (district) => {
  if (!district) return null;

  const key = canonicalize(district);
  const mapped = DISTRICT_MAP[key] || key;

  return mapped.replace(/\b\w/g, (c) => c.toUpperCase());
};

/* ===============================
   🟢 COMPONENT
================================ */
export default function DistrictTable({ data }) {
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("All");

  /* ===============================
     ✅ CLEAN + DEDUPE DATA
  ================================ */
  const cleanedData = useMemo(() => {
    const map = new Map();

    data.forEach((row) => {
      const state = normalizeState(row.state);
      const district = normalizeDistrict(row.district);
      const demand = row.Next_Month_Demand?.trim();

      if (!state || !district || !demand) return;

      const key = `${state}|${district}`;
      const priority = DEMAND_PRIORITY[demand] || 0;

      if (!map.has(key)) {
        map.set(key, { ...row, state, district });
      } else {
        const existing = map.get(key);
        const existingPriority =
          DEMAND_PRIORITY[existing.Next_Month_Demand] || 0;

        if (priority > existingPriority) {
          map.set(key, { ...row, state, district });
        }
      }
    });

    return Array.from(map.values());
  }, [data]);

  /* ===============================
     ✅ STATES DROPDOWN
  ================================ */
  const states = useMemo(() => {
    const set = new Set(cleanedData.map((d) => d.state));
    return ["All", ...Array.from(set).sort()];
  }, [cleanedData]);

  /* ===============================
     ✅ FILTER
  ================================ */
  const filteredData = cleanedData.filter((row) => {
    const matchState =
      stateFilter === "All" || row.state === stateFilter;

    const matchSearch =
      row.state.toLowerCase().includes(search.toLowerCase()) ||
      row.district.toLowerCase().includes(search.toLowerCase());

    return matchState && matchSearch;
  });

  const getBadgeClass = (value) => {
    if (value === "High Demand") return "badge red";
    if (value === "Medium Demand") return "badge yellow";
    return "badge green";
  };

  return (
    <div className="section">

      {/* ✅ PROFESSIONAL BANNER IMAGE */}
      <img
        src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3"
        alt="India Governance"
        style={{
          width: "100%",
          height: "180px",
          objectFit: "cover",
          borderRadius: "14px",
          marginBottom: "20px",
        }}
      />

      <h2>District-wise Action Recommendations</h2>
      <p style={{ fontSize: "1.3rem" }}>
        Each district appears only once with its highest predicted demand level.
      </p>

      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <input
          placeholder="Search district or state..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "12px 16px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            fontSize: "0.95rem",
            width: "300px",
            outline: "none",
            background: "#f8fafc",
            transition: "all 0.2s",
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
          }}
        />

        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          style={{
            padding: "12px 16px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            fontSize: "0.95rem",
            outline: "none",
            background: "#f8fafc",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
          }}
        >
          {states.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* ✅ CARD WRAPPER */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          padding: "24px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          overflow: "hidden"
        }}
      >
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0" }}>
          <thead>
            <tr>
              <th style={headerStyle}>State</th>
              <th style={headerStyle}>District</th>
              <th style={headerStyle}>Demand Level</th>
              <th style={headerStyle}>Recommended Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={cellStyle}>{row.state}</td>
                <td style={cellStyle}>{row.district}</td>
                <td style={cellStyle}>
                  <span className={getBadgeClass(row.Next_Month_Demand)}>
                    {row.Next_Month_Demand}
                  </span>
                </td>
                <td style={cellStyle}>{row.recommended_action}</td>
              </tr>
            ))}

            {/* ✅ EMPTY STATE IMAGE */}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "40px" }}>
                  <img
                    src="https://illustrations.popsy.co/gray/searching.svg"
                    alt="No data"
                    style={{ width: "160px", marginBottom: "12px", opacity: 0.8 }}
                  />
                  <div style={{ color: "#94a3b8", fontWeight: "500" }}>No matching districts found</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// STYLES
const headerStyle = {
  background: "linear-gradient(90deg, #F6B323 0%, #F05A28 50%, #E91E63 100%)",
  color: "white",
  padding: "16px 20px",
  textAlign: "left",
  fontWeight: "700",
  fontSize: "0.95rem",
  borderBottom: "none", // clean look
  first: { borderTopLeftRadius: "12px" }, // Note: requires pseudo selector or inline distinct
};

const cellStyle = {
  padding: "16px 20px",
  borderBottom: "1px solid #f1f5f9",
  color: "#334155",
  fontSize: "0.95rem",
  fontWeight: "500"
};

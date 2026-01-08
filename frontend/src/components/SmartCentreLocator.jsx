import { useState } from "react";

export default function SmartCentreLocator() {
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState("");

  const fetchCentres = async (params) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`http://localhost:8000/centers?${query}`);
      const data = await res.json();
      setCentres(data);
    } catch (err) {
      setError("Failed to fetch centres. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const findByLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchCentres({ lat: latitude, lon: longitude });
      },
      () => {
        setError("Location permission denied");
        setLoading(false);
      }
    );
  };

  const findByCity = async () => {
    if (!city.trim()) return;

    // Use OpenStreetMap Nominatim for Geocoding
    setLoading(true);
    setError(null);
    try {
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
      const geoData = await geoRes.json();

      if (geoData && geoData.length > 0) {
        const { lat, lon } = geoData[0];
        // Now search backend using these coordinates
        await fetchCentres({ lat, lon });
      } else {
        // Fallback to text search if geocoding fails (though backend text search is limited)
        await fetchCentres({ city: city });
      }
    } catch (err) {
      console.error(err);
      // Fallback
      await fetchCentres({ city: city });
    }
  };

  return (
    <div style={box}>
      <h3>📍 Smart Centre Locator</h3>
      <p style={desc}>
        Search any location (e.g., "Kukatpally", "Hyderabad") or use GPS to find the nearest centre.
      </p>

      <div style={controls}>
        <div style={inputGroup}>
          <input
            type="text"
            placeholder="Enter Location / Area"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={input}
            onKeyDown={(e) => e.key === 'Enter' && findByCity()}
          />
          <button onClick={findByCity} style={searchBtn} disabled={loading}>
            {loading ? "..." : "Search"}
          </button>
        </div>

        <span style={{ color: "#94a3b8" }}>OR</span>

        <button onClick={findByLocation} style={locationBtn} disabled={loading}>
          📍 Use My Location
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={resultsGrid}>
        {centres.map((c, i) => (
          <div key={i} style={card}>
            <div>
              <h4 style={{ margin: "0 0 8px 0", color: "#0f172a" }}>{c.name}</h4>
              <p style={{ fontSize: "0.9rem", color: "#475569", marginBottom: "8px" }}>
                {c.address}
              </p>
              {c.distance !== undefined && (
                <p style={{ color: c.distance < 0.5 ? "#16a34a" : "#2563eb", fontWeight: "600" }}>
                  Ref Distance: {c.distance < 1 ? `${(c.distance * 1000).toFixed(0)} m` : `${c.distance} km`}
                </p>
              )}
            </div>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lon}`}
              target="_blank"
              rel="noreferrer"
              style={navBtn}
            >
              Navigate ↗
            </a>
          </div>
        ))}
        {centres.length === 0 && !loading && !error && (
          <p style={{ marginTop: "20px", color: "#94a3b8" }}>
            No centres found nearby. Search for a major area name.
          </p>
        )}
      </div>
    </div>
  );
}

/* STYLES */
const box = {
  marginTop: "32px",
  padding: "24px",
  background: "#f8fafc",
  borderRadius: "16px",
};

const desc = { color: "#475569", marginBottom: "20px" };

const controls = {
  display: "flex",
  gap: "16px",
  alignItems: "center",
  flexWrap: "wrap",
  marginBottom: "24px",
};

const inputGroup = {
  display: "flex",
  gap: "8px",
};

const input = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  outline: "none",
};

const searchBtn = {
  padding: "10px 16px",
  background: "#0f172a",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const locationBtn = {
  padding: "10px 16px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const resultsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "16px",
};

const card = {
  background: "white",
  padding: "16px",
  borderRadius: "12px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const navBtn = {
  marginTop: "12px",
  display: "inline-block",
  textAlign: "center",
  padding: "8px 12px",
  background: "#eff6ff",
  color: "#2563eb",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "0.9rem",
};

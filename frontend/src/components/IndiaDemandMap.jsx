import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

/* ---------------- FIX LEAFLET ICON ---------------- */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ---------------- COLOR LOGIC ---------------- */
const getColor = (level) => {
  if (level === "High Demand") return "#dc2626";    // red
  if (level === "Medium Demand") return "#facc15";  // yellow
  return "#16a34a";                                 // green
};

/* ---------------- MAP EVENT LISTENER ---------------- */
function MapZoomHandler({ geoData }) {
  const map = useMap();

  useEffect(() => {
    const handler = (e) => {
      const { state } = e.detail;

      geoData?.features.forEach((feature) => {
        if (feature.properties.NAME_1 === state) {
          const layer = L.geoJSON(feature);
          map.fitBounds(layer.getBounds());
        }
      });
    };

    window.addEventListener("zoom-to-district", handler);
    return () => window.removeEventListener("zoom-to-district", handler);
  }, [geoData, map]);

  return null;
}

export default function IndiaDemandMap({ data }) {
  const [geoData, setGeoData] = useState(null);

  /* ---------------- LOAD GEOJSON ---------------- */
  useEffect(() => {
    fetch("/india_states.geojson")
      .then((res) => res.json())
      .then(setGeoData)
      .catch((err) => console.error("GeoJSON load error", err));
  }, []);

  /* ---------------- AGGREGATE STATE DATA ---------------- */
  const stateStats = {};

  data.forEach((row) => {
    if (!row.state) return;

    if (!stateStats[row.state]) {
      stateStats[row.state] = {
        total: 0,
        high: 0,
        medium: 0,
        low: 0,
        score: 0,
      };
    }

    stateStats[row.state].total += 1;

    if (row.Next_Month_Demand === "High Demand") {
      stateStats[row.state].high += 1;
      stateStats[row.state].score += 3;
    } else if (row.Next_Month_Demand === "Medium Demand") {
      stateStats[row.state].medium += 1;
      stateStats[row.state].score += 2;
    } else {
      stateStats[row.state].low += 1;
      stateStats[row.state].score += 1;
    }
  });

  /* ---------------- FINAL STATE DEMAND LEVEL ---------------- */
  const getStateDemandLevel = (stateName) => {
    const s = stateStats[stateName];
    if (!s) return "Low Demand";

    const avg = s.score / s.total;
    if (avg > 2.3) return "High Demand";
    if (avg > 1.6) return "Medium Demand";
    return "Low Demand";
  };

  /* ---------------- MAP STYLE ---------------- */
  const style = (feature) => {
    const stateName = feature.properties.NAME_1;
    const level = getStateDemandLevel(stateName);

    return {
      fillColor: getColor(level),
      weight: 1,
      color: "white",
      fillOpacity: 0.85,
    };
  };

  /* ---------------- STATE INTERACTIONS ---------------- */
  const onEachState = (feature, layer) => {
    const stateName = feature.properties.NAME_1;
    const stats = stateStats[stateName];
    const level = getStateDemandLevel(stateName);

    layer.bindTooltip(
      `<b>${stateName}</b><br/>
       Demand: ${level}<br/>
       Total districts: ${stats?.total || 0}<br/>
       High: ${stats?.high || 0}<br/>
       Medium: ${stats?.medium || 0}<br/>
       Low: ${stats?.low || 0}`,
      { sticky: true }
    );

    // Click → zoom state
    layer.on("click", (e) => {
      e.target._map.fitBounds(e.target.getBounds());
    });
  };

  return (
    <div className="section">
      <h3>India Aadhaar Demand Intensity Map</h3>

      <p className="section-desc">
        This map shows Aadhaar demand for each state using colors.
        Green means low demand, yellow means medium, and red means high.
        Click a state to zoom in and see more details.
      </p>

      <p style={{ fontSize: "0.9rem" }}>
        <span style={{ color: "#dc2626" }}>⬤</span> High&nbsp;&nbsp;
        <span style={{ color: "#facc15" }}>⬤</span> Medium&nbsp;&nbsp;
        <span style={{ color: "#16a34a" }}>⬤</span> Low
      </p>

      <MapContainer
        center={[22.5, 78.9]}
        zoom={5}
        style={{ height: "520px", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {geoData && (
          <>
            <GeoJSON
              data={geoData}
              style={style}
              onEachFeature={onEachState}
            />
            <MapZoomHandler geoData={geoData} />
          </>
        )}
      </MapContainer>
    </div>
  );
}
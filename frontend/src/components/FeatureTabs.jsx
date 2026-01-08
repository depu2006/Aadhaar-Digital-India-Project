export default function FeatureTabs({ active, setActive }) {
  const tabs = [
    "Overview",
    "Demand Analysis",
    "Friction Analysis",
    "India Map",
    "Action Table"
  ];

  return (
    <div className="nav">
      {tabs.map(tab => (
        <button
          key={tab}
          className={active === tab ? "active" : ""}
          onClick={() => setActive(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

import Select from "react-select";

export default function Filters({ states, setState, setDemand }) {
  return (
    <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
      <Select
        options={states.map(s => ({ label: s, value: s }))}
        onChange={e => setState(e?.value)}
        placeholder="Filter by State"
        isClearable
      />
      <Select
        options={[
          { label: "Low Demand", value: "Low Demand" },
          { label: "Medium Demand", value: "Medium Demand" },
          { label: "High Demand", value: "High Demand" },
        ]}
        onChange={e => setDemand(e?.value)}
        placeholder="Filter by Demand"
        isClearable
      />
    </div>
  );
}

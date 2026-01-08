export default function FrictionHeatmap({ data }) {
  const frictionLevels = ["Low", "Medium", "High"];
  const dependencyLevels = [
    "Low Dependency",
    "Medium Dependency",
    "High Dependency"
  ];

  const getCount = (f, d) =>
    data.filter(
      row =>
        row.Lifecycle_Friction === f &&
        row.udr_level === d
    ).length;

  return (
    <div className="section">
      <h3>Friction vs Dependency Heatmap</h3>
      <p style={{ fontSize: "0.9rem", marginBottom: "10px" }}>
        Shows districts grouped by lifecycle friction and Aadhaar update dependency.
      </p>

      <table>
        <thead>
          <tr>
            <th></th>
            {dependencyLevels.map(dep => (
              <th key={dep}>{dep}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {frictionLevels.map(fr => (
            <tr key={fr}>
              <td><b>{fr} Friction</b></td>
              {dependencyLevels.map(dep => (
                <td key={dep}>{getCount(fr, dep)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

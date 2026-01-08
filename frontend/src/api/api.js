const BASE_URL = "http://127.0.0.1:8000";

export async function fetchSummary() {
  const res = await fetch(`${BASE_URL}/summary`);
  return await res.json();
}

export async function fetchDistricts() {
  const res = await fetch(`${BASE_URL}/districts`);
  const data = await res.json();
  console.log("District data received:", data); // DEBUG
  return data;
}


export const fetchFrictionAge = async () => {
  const res = await fetch("http://127.0.0.1:8000/friction-age-analysis");
  return res.json();
};

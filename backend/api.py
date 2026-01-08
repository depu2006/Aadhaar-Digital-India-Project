from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd


# Create app
app = FastAPI(title="UIDAI Admin Analytics API")

# Allow React frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # OK for hackathon
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load analytics data (read-only)
DATA_PATH = r"C:\Users\deeps\Documents\aadhar-analytics\output\admin_decision_dashboard.csv"

df = pd.read_csv(DATA_PATH)

# -----------------------------
# 1️⃣ KPI SUMMARY ENDPOINT
# -----------------------------
@app.get("/summary")
def get_summary():
    try:
        if df.empty:
            return {"error": "Data not loaded"}

        return {
            "high_lifecycle_friction_pct": round(
                (df["Lifecycle_Friction"].astype(str).str.strip() == "High").mean() * 100, 2
            ),
            "high_update_dependency_pct": round(
                (df["udr_level"].astype(str).str.strip() == "High Dependency").mean() * 100, 2
            ),
            "high_demand_forecast_pct": round(
                (df["Next_Month_Demand"].astype(str).str.strip() == "High Demand").mean() * 100, 2
            )
        }

    except Exception as e:
        return {
            "error": "Summary calculation failed",
            "details": str(e),
            "available_columns": df.columns.tolist()
        }

# -----------------------------
# 2️⃣ ALL DISTRICT DATA
# -----------------------------
@app.get("/districts")
def get_districts():
    try:
        if df.empty:
            return []

        safe_df = df.copy()

        # Convert dates to string (JSON-safe)
        for col in safe_df.columns:
            if "date" in col.lower():
                safe_df[col] = safe_df[col].astype(str)

        # Replace NaN with None (JSON-safe)
        safe_df = safe_df.where(pd.notnull(safe_df), None)

        # Convert to list of dicts
        return safe_df.to_dict(orient="records")

    except Exception as e:
        return {
            "error": "Failed to load districts",
            "details": str(e),
            "columns": df.columns.tolist()
        }



# -----------------------------
# 3️⃣ FILTER BY STATE
# -----------------------------
@app.get("/districts/state/{state_name}")
def get_districts_by_state(state_name: str):
    filtered = df[df["state"].str.lower() == state_name.lower()]
    return filtered.to_dict(orient="records")

# -----------------------------
# 4️⃣ FILTER BY DEMAND LEVEL
# -----------------------------
@app.get("/districts/demand/{level}")
def get_districts_by_demand(level: str):
    filtered = df[df["Next_Month_Demand"].str.lower() == level.lower()]
    return filtered.to_dict(orient="records")


@app.get("/friction-age-analysis")
def friction_age_analysis():
    try:
        import pandas as pd
        from pathlib import Path

        # CANONICAL STATE MAPPING
        CANONICAL_STATES = {
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
        }

        def normalize_state(raw):
            if not raw:
                return None
            # First collapse multiple spaces, then trim
            key = ' '.join(str(raw).lower().split())
            return CANONICAL_STATES.get(key, raw)

        # Use correct path relative to backend or absolute
        base_path = Path(__file__).parent.parent / "output" / "enrol_monthly.csv"
        enrol = pd.read_csv(str(base_path))

        # Melt age columns into long format
        age_cols = [col for col in enrol.columns if col.startswith('age_')]
        melted = enrol.melt(
            id_vars=['state', 'district', 'date', 'pincode'],
            value_vars=age_cols,
            var_name='age_group',
            value_name='count'
        )

        # Remove junk rows (where state is just a number)
        melted = melted[~melted['state'].astype(str).str.isdigit()]

        # Normalize state names
        melted['state'] = melted['state'].apply(normalize_state)
        melted = melted[melted['state'].notna()]

        # Clean up age_group names (e.g., age_0_5 -> 0-5 years)
        melted['age_group'] = melted['age_group'].str.replace('age_', '')
        melted['age_group'] = melted['age_group'].str.replace('_', '-')
        melted['age_group'] = melted['age_group'].str.replace('18-greater', '18+')
        melted['age_group'] = melted['age_group'] + ' years'

        # Aggregate updates per normalized state & age group
        agg = (
            melted
            .groupby(["state", "age_group"])["count"]
            .sum()
            .reset_index()
            .rename(columns={"count": "num_updates"})
        )

        # Define friction levels based on volume
        def classify_friction(x):
            if x > 50000:
                return "High"
            elif x > 10000:
                return "Medium"
            else:
                return "Low"

        agg["friction_level"] = agg["num_updates"].apply(classify_friction)

        return agg.to_dict(orient="records")
    except Exception as e:
        import traceback
        return {"error": str(e), "traceback": traceback.format_exc()}


# -----------------------------
# 5️⃣ USER DASHBOARD API
# -----------------------------

# --- MOCK DATA ---

AADHAR_CENTRES = [
    # --- HYDERABAD ---
    {"id": 101, "name": "UIDAI Regional Office, Ameerpet", "address": "6th Floor, A Block, Swarna Jayanthi Complex, Ameerpet, Hyderabad", "city": "Hyderabad", "state": "Telangana", "lat": 17.4375, "lon": 78.4483},
    {"id": 102, "name": "Aadhar Seva Kendra, Madhapur", "address": "Opp Cyber Towers, Hitech City, Madhapur, Hyderabad", "city": "Hyderabad", "state": "Telangana", "lat": 17.4474, "lon": 78.3762},
    {"id": 103, "name": "MeeSeva Centre, Kukatpally", "address": "KPHB Colony, Near Bus Stop, Kukatpally, Hyderabad", "city": "Hyderabad", "state": "Telangana", "lat": 17.4933, "lon": 78.4017},
    {"id": 104, "name": "Post Office Aadhar Centre, Secunderabad", "address": "Head Post Office, Patny Center, Secunderabad", "city": "Secunderabad", "state": "Telangana", "lat": 17.4399, "lon": 78.4983},
    {"id": 105, "name": "Aadhar Seva Kendra, Begumpet", "address": "Prakash Nagar, Begumpet, Hyderabad", "city": "Hyderabad", "state": "Telangana", "lat": 17.4447, "lon": 78.4664},
    {"id": 106, "name": "Aadhar Centre, Mehdipatnam", "address": "Rythu Bazar Road, Mehdipatnam, Hyderabad", "city": "Hyderabad", "state": "Telangana", "lat": 17.3956, "lon": 78.4392},
    {"id": 107, "name": "MeeSeva, Dilsukhnagar", "address": "Near Mega Theatre, Dilsukhnagar, Hyderabad", "city": "Hyderabad", "state": "Telangana", "lat": 17.3685, "lon": 78.5316},
    {"id": 108, "name": "Aadhar Seva Kendra, LB Nagar", "address": "Near LB Nagar Crossroads, Hyderabad", "city": "Hyderabad", "state": "Telangana", "lat": 17.3497, "lon": 78.5524},
    {"id": 109, "name": "Post Office Aadhar, Uppal", "address": "Survey of India, Uppal, Hyderabad", "city": "Hyderabad", "state": "Telangana", "lat": 17.4018, "lon": 78.5602},
    {"id": 110, "name": "Aadhar Centre, Gachibowli", "address": "Near Stadium, Gachibowli, Hyderabad", "city": "Hyderabad", "state": "Telangana", "lat": 17.4401, "lon": 78.3489},
    {"id": 111, "name": "MeeSeva, Miyapur", "address": "Miyapur X Roads, Hyderabad", "city": "Hyderabad", "state": "Telangana", "lat": 17.4968, "lon": 78.3615},
    {"id": 112, "name": "Aadhar Centre, Kondapur", "address": "Botanical Garden Rd, Kondapur, Hyderabad", "city": "Hyderabad", "state": "Telangana", "lat": 17.4622, "lon": 78.3568},
    {"id": 113, "name": "MeeSeva, Charminar", "address": "Near Charminar, Old City, Hyderabad", "city": "Hyderabad", "state": "Telangana", "lat": 17.3616, "lon": 78.4747},
    {"id": 114, "name": "Aadhar Seva Kendra, Banjara Hills", "address": "Road No 12, Banjara Hills, Hyderabad", "city": "Hyderabad", "state": "Telangana", "lat": 17.4137, "lon": 78.4403},
    {"id": 115, "name": "Aadhar Centre, Jubilee Hills", "address": "Road No 36, Jubilee Hills, Hyderabad", "city": "Hyderabad", "state": "Telangana", "lat": 17.4326, "lon": 78.4071},

    # --- WARANGAL ---
    {"id": 201, "name": "Aadhar Seva Kendra, Hanamkonda", "address": "Nakkalagutta, Hanamkonda, Warangal", "city": "Warangal", "state": "Telangana", "lat": 18.0072, "lon": 79.5582},
    {"id": 202, "name": "Warangal Head Post Office", "address": "Station Road, Warangal", "city": "Warangal", "state": "Telangana", "lat": 17.9689, "lon": 79.5941},
    {"id": 203, "name": "MeeSeva Centre, Kazipet", "address": "Railway Station Road, Kazipet, Warangal", "city": "Warangal", "state": "Telangana", "lat": 17.9784, "lon": 79.5342},

    # --- KARIMNAGAR ---
    {"id": 301, "name": "Aadhar Seva Kendra, Karimnagar", "address": "Bus Stand Road, Karimnagar", "city": "Karimnagar", "state": "Telangana", "lat": 18.4386, "lon": 79.1288},
    {"id": 302, "name": "Head Post Office, Karimnagar", "address": "Collectorate Complex, Karimnagar", "city": "Karimnagar", "state": "Telangana", "lat": 18.4348, "lon": 79.1329},

    # --- NIZAMABAD ---
    {"id": 401, "name": "Aadhar Seva Kendra, Nizamabad", "address": "Khaleelwadi, Nizamabad", "city": "Nizamabad", "state": "Telangana", "lat": 18.6725, "lon": 78.0941},
    {"id": 402, "name": "MeeSeva, Bodhan", "address": "Main Road, Bodhan, Nizamabad", "city": "Nizamabad", "state": "Telangana", "lat": 18.6657, "lon": 77.8821},

    # --- KHAMMAM ---
    {"id": 501, "name": "Aadhar Centre, Khammam", "address": "Wyra Road, Khammam", "city": "Khammam", "state": "Telangana", "lat": 17.2473, "lon": 80.1514},
    {"id": 502, "name": "Head Post Office, Khammam", "address": "Trunk Road, Khammam", "city": "Khammam", "state": "Telangana", "lat": 17.2510, "lon": 80.1470},

    # --- NALGONDA ---
    {"id": 601, "name": "Aadhar Seva Kendra, Nalgonda", "address": "Clock Tower Center, Nalgonda", "city": "Nalgonda", "state": "Telangana", "lat": 17.0575, "lon": 79.2684},
    {"id": 602, "name": "MeeSeva, Miryalaguda", "address": "Sagar Road, Miryalaguda", "city": "Miryalaguda", "state": "Telangana", "lat": 16.8687, "lon": 79.5694},

    # --- MAHABUBNAGAR ---
    {"id": 701, "name": "Aadhar Centre, Mahabubnagar", "address": "New Town, Mahabubnagar", "city": "Mahabubnagar", "state": "Telangana", "lat": 16.7488, "lon": 78.0035},

    # --- ADILABAD ---
    {"id": 801, "name": "Head Post Office, Adilabad", "address": "Cinema Road, Adilabad", "city": "Adilabad", "state": "Telangana", "lat": 19.6759, "lon": 78.5320},

    # --- OTHER DISTRICTS (SAMPLES) ---
    {"id": 901, "name": "MeeSeva, Siddipet", "address": "Medak Road, Siddipet", "city": "Siddipet", "state": "Telangana", "lat": 18.1010, "lon": 78.8521},
    {"id": 902, "name": "Aadhar Centre, Mancherial", "address": "Bellampalli Road, Mancherial", "city": "Mancherial", "state": "Telangana", "lat": 18.8679, "lon": 79.4639},
    {"id": 903, "name": "Post Office, Suryapet", "address": "Kudakuda Road, Suryapet", "city": "Suryapet", "state": "Telangana", "lat": 17.1439, "lon": 79.6239}
]

# (Previously Service Docs were here, kept unchanged if not replaced. 
# But since I'm replacing lines 224 to 383 which included SERVICE_DOCUMENTS 
# in the view above, I must include them or be careful. 
# Looking at line numbers in view_file: 
# AADHAR_CENTRES starts line 224. 
# SERVICE_DOCUMENTS starts line 299.
# ENDPOINTS start line 322.
# get_centers ends at 383.
# I will supply the full replacement for this block to be safe and clean.)

SERVICE_DOCUMENTS = {
    "new_enrollment": [
        "Proof of Identity (POI) - e.g., PAN Card, Passport, Voter ID",
        "Proof of Address (POA) - e.g., Passport, Voter ID, Ration Card",
        "Proof of Date of Birth (DOB) - e.g., Birth Certificate, SSLC Book/Certificate"
    ],
    "address_update": [
        "Proof of Address (POA) - e.g., Rent Agreement, Passport, Voter ID",
        "Registered Mobile Number (for OTP)"
    ],
    "biometric_update": [
        "Aadhar Letter/Card (Original)",
        "Proof of Identity (optional based on officer discretion)"
    ],
    "mobile_update": [
        "Aadhar Card",
        "Physical presence for biometric authentication (Iris/Fingerprint)"
    ],
    "dob_update": [
        "Proof of Date of Birth (DOB) - e.g., Birth Certificate (Mandatory for name/DOB corection)"
    ]
}

# --- ENDPOINTS ---

from pydantic import BaseModel
from typing import Optional
import math

class LoginRequest(BaseModel):
    type: str # 'user' or 'admin'
    email: str
    password: Optional[str] = None

class SignupRequest(BaseModel):
    type: str
    email: str
    password: str

@app.post("/signup")
def signup(request: SignupRequest):
    # Mock signup logic
    if request.type == "admin" and not request.email.endswith("@uidai.gov.in"):
        return {"success": False, "message": "Admin signup restricted to @uidai.gov.in"}
    return {"success": True, "message": "Account created successfully! Please login."}

@app.post("/login")
def login(request: LoginRequest):
    if request.type == "admin":
        if request.email.endswith("@uidai.gov.in"):
            return {"success": True, "message": "Admin Login Successful", "role": "admin"}
        else:
            return {"success": False, "message": "Access Denied: UIDAI Officials Only"}
    elif request.type == "user":
        return {"success": True, "message": "User Login Successful", "role": "user"}
    
    return {"success": False, "message": "Invalid login type"}

@app.get("/centers")
def get_centers(city: Optional[str] = None, lat: Optional[float] = None, lon: Optional[float] = None):
    # Start with a copy
    results = [c.copy() for c in AADHAR_CENTRES]

    # Manual Filter by City/State (Case insensitive partial match)
    # Kept as fallback if simple text search is needed, but Geo search is preferred
    if city:
        query = city.lower().strip()
        results = [
            c for c in results 
            if query in c['city'].lower() or query in c['state'].lower()
        ]
        return results

    # Geo Filter (Sort by distance) + Distance Injection
    if lat is not None and lon is not None:
        def haversine_km(lat1, lon1, lat2, lon2):
            R = 6371  # Earth radius in km
            d_lat = math.radians(lat2 - lat1)
            d_lon = math.radians(lon2 - lon1)
            a = (math.sin(d_lat / 2) * math.sin(d_lat / 2) +
                 math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
                 math.sin(d_lon / 2) * math.sin(d_lon / 2))
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
            return R * c

        # Calculate distance for ALL items first
        for c in results:
            c['distance'] = round(haversine_km(lat, lon, c['lat'], c['lon']), 2)

        # Sort by distance
        results.sort(key=lambda x: x['distance'])
        
        # Return top 5 nearest
        return results[:5]

    return results

@app.get("/services")
def get_services():
    # Return friendly names mapping keys to readable text
    friendly_names = {
        "new_enrollment": "New Aadhar Enrollment",
        "address_update": "Address Update",
        "biometric_update": "Biometric Update (Photo/Fingerprint/Iris)",
        "mobile_update": "Mobile Number Linking/Update",
        "dob_update": "Date of Birth Correction"
    }
    return [{"id": k, "name": v} for k, v in friendly_names.items()]

@app.get("/documents")
def get_documents(service_id: Optional[str] = None):
    if service_id:
        return {"service_id": service_id, "documents": SERVICE_DOCUMENTS.get(service_id, [])}
    return SERVICE_DOCUMENTS

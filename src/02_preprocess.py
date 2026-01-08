import pandas as pd

# Load datasets
enrol = pd.read_csv("data/api_data_aadhar_enrolment_0_500000.csv")
demo = pd.read_csv("data/api_data_aadhar_demographic_0_500000.csv")
bio = pd.read_csv("data/api_data_aadhar_biometric_0_500000.csv")

# Convert date column
for df in [enrol, demo, bio]:
    df['date'] = pd.to_datetime(df['date'], dayfirst=True)

# Monthly aggregation
enrol_monthly = enrol.groupby(
    ['state', 'district', pd.Grouper(key='date', freq='M')]
).sum().reset_index()

demo_monthly = demo.groupby(
    ['state', 'district', pd.Grouper(key='date', freq='M')]
).sum().reset_index()

bio_monthly = bio.groupby(
    ['state', 'district', pd.Grouper(key='date', freq='M')]
).sum().reset_index()

# Save intermediate files
enrol_monthly.to_csv("output/enrol_monthly.csv", index=False)
demo_monthly.to_csv("output/demo_monthly.csv", index=False)
bio_monthly.to_csv("output/bio_monthly.csv", index=False)

print("Preprocessing completed")
import pandas as pd
import numpy as np

# Load monthly aggregated data
enrol = pd.read_csv("output/enrol_monthly.csv")
demo = pd.read_csv("output/demo_monthly.csv")
bio = pd.read_csv("output/bio_monthly.csv")

# Compute total updates
demo['demo_total'] = demo['demo_age_5_17'] + demo['demo_age_17_']
bio['bio_total'] = bio['bio_age_5_17'] + bio['bio_age_17_']

# Merge datasets
merged = enrol.merge(
    demo[['state', 'district', 'date', 'demo_total']],
    on=['state', 'district', 'date'],
    how='left'
)

merged = merged.merge(
    bio[['state', 'district', 'date', 'bio_total']],
    on=['state', 'district', 'date'],
    how='left'
)

merged.fillna(0, inplace=True)

# Total enrolment
merged['total_enrolment'] = (
    merged['age_0_5'] +
    merged['age_5_17'] +
    merged['age_18_greater']
)

# Update Dependency Ratio
merged['udr'] = (
    (merged['demo_total'] + merged['bio_total']) /
    merged['total_enrolment']
)

# Categorize dependency levels
conditions = [
    merged['udr'] < 0.5,
    merged['udr'].between(0.5, 1.5),
    merged['udr'] > 1.5
]

labels = ['Low Dependency', 'Medium Dependency', 'High Dependency']

merged['udr_level'] = np.select(
    conditions,
    labels,
    default='Low Dependency'
)

# Final output
udr_output = merged[['state', 'district', 'date', 'udr', 'udr_level']]
udr_output.to_csv("output/update_dependency_ratio.csv", index=False)

print("Update Dependency Ratio computed successfully")
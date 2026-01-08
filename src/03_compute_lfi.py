import pandas as pd
import numpy as np

# Load monthly data
enrol = pd.read_csv("output/enrol_monthly.csv")
demo = pd.read_csv("output/demo_monthly.csv")
bio = pd.read_csv("output/bio_monthly.csv")

# Total updates
demo['demo_total'] = demo['demo_age_5_17'] + demo['demo_age_17_']
bio['bio_total'] = bio['bio_age_5_17'] + bio['bio_age_17_']

# Merge datasets
merged = enrol.merge(
    demo[['state','district','date','demo_total']],
    on=['state','district','date'],
    how='left'
)

merged = merged.merge(
    bio[['state','district','date','bio_total']],
    on=['state','district','date'],
    how='left'
)

merged.fillna(0, inplace=True)

# Total enrolment
merged['total_enrolment'] = (
    merged['age_0_5'] +
    merged['age_5_17'] +
    merged['age_18_greater']
)

# Normalize pressure
merged['demo_pressure'] = merged['demo_total'] / merged['total_enrolment']
merged['bio_pressure'] = merged['bio_total'] / merged['total_enrolment']

# Lifecycle Friction Index
merged['lifecycle_friction_score'] = (
    0.6 * merged['bio_pressure'] +
    0.4 * merged['demo_pressure']
)

# Categorize friction
conditions = [
    merged['lifecycle_friction_score'] < 0.01,
    merged['lifecycle_friction_score'].between(0.01, 0.03),
    merged['lifecycle_friction_score'] > 0.03
]

labels = ['Low', 'Medium', 'High']
merged['friction_level'] = np.select(
    conditions,
    labels,
    default='Low'   # explicit string default
)

# Save output
final = merged[['state','district','date',
                'lifecycle_friction_score','friction_level']]

final.to_csv("output/lifecycle_friction_index.csv", index=False)

print("Lifecycle Friction Index computed successfully")
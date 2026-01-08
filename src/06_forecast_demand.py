import pandas as pd
import numpy as np

# Load monthly aggregated data
demo = pd.read_csv("output/demo_monthly.csv")
bio = pd.read_csv("output/bio_monthly.csv")

# Convert date
demo['date'] = pd.to_datetime(demo['date'])
bio['date'] = pd.to_datetime(bio['date'])

# Total updates per month
demo['demo_total'] = demo['demo_age_5_17'] + demo['demo_age_17_']
bio['bio_total'] = bio['bio_age_5_17'] + bio['bio_age_17_']

# Merge update datasets
updates = demo.merge(
    bio[['state','district','date','bio_total']],
    on=['state','district','date'],
    how='left'
)

updates.fillna(0, inplace=True)

updates['total_updates'] = (
    updates['demo_total'] + updates['bio_total']
)

# Sort for rolling calculation
updates = updates.sort_values(['state','district','date'])

# 3-month rolling average forecast
updates['forecast_next_month'] = (
    updates.groupby(['state','district'])['total_updates']
    .transform(lambda x: x.rolling(3, min_periods=1).mean())
)

# Demand level classification
conditions = [
    updates['forecast_next_month'] < 500,
    updates['forecast_next_month'].between(500, 2000),
    updates['forecast_next_month'] > 2000
]

labels = ['Low Demand', 'Medium Demand', 'High Demand']

updates['forecast_level'] = np.select(
    conditions,
    labels,
    default='Low Demand'
)

# Action recommendations
def recommend_action(level):
    if level == 'High Demand':
        return 'Deploy mobile Aadhaar van / add staff'
    elif level == 'Medium Demand':
        return 'Extend working hours'
    else:
        return 'No action required'

updates['recommended_action'] = updates['forecast_level'].apply(recommend_action)

# Save output
forecast_output = updates[
    ['state','district','date',
     'forecast_next_month','forecast_level','recommended_action']
]

forecast_output.to_csv("output/demand_forecast_actions.csv", index=False)

print("Demand forecasting and action plan generated successfully")
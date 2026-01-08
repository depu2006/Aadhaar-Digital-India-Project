import pandas as pd

# Load analytics outputs (USE ACTUAL FILENAMES)
lfi = pd.read_csv("output/lifecycle_friction_index.csv")
udr = pd.read_csv("output/update_dependency_ratio.csv")
forecast = pd.read_csv("output/demand_forecast_actions.csv")

# Ensure date is datetime
forecast['date'] = pd.to_datetime(forecast['date'])

# Keep latest forecast per district
latest_forecast = (
    forecast.sort_values('date')
    .groupby(['state', 'district'])
    .tail(1)
)

# Merge datasets
admin_view = (
    lfi.merge(udr, on=['state', 'district'], how='left')
       .merge(
           latest_forecast[
               ['state', 'district', 'forecast_level', 'recommended_action']
           ],
           on=['state', 'district'],
           how='left'
       )
)

# Rename columns for clarity
admin_view.rename(columns={
    'friction_level': 'Lifecycle_Friction',
    'dependency_level': 'Update_Dependency_Pressure',
    'forecast_level': 'Next_Month_Demand'
}, inplace=True)

# Save final admin dataset
admin_view.to_csv("output/admin_decision_dashboard.csv", index=False)

print("✅ Admin master decision dataset created successfully")
import pandas as pd

df = pd.read_csv("output/lifecycle_friction_index.csv")

print(df.head())
print("\nFriction Level Distribution:")
print(df['friction_level'].value_counts())

print("\nMax friction score:", df['lifecycle_friction_score'].max())
print("Min friction score:", df['lifecycle_friction_score'].min())
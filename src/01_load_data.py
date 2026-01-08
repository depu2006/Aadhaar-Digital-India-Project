import pandas as pd

# Load datasets
enrol = pd.read_csv("data/api_data_aadhar_enrolment_0_500000.csv")
demo = pd.read_csv("data/api_data_aadhar_demographic_0_500000.csv")
bio = pd.read_csv("data/api_data_aadhar_biometric_0_500000.csv")

print("Datasets loaded successfully")
print("Enrolment shape:", enrol.shape)
print("Demographic shape:", demo.shape)
print("Biometric shape:", bio.shape)
from DataExtraction.drugs_extraction import drug_df1,drug_ids
import pandas as pd


se_df = pd.read_csv('side_effects_data.csv')

for index, row in se_df.iterrows():
    if row['urlDrugName'] == 'neurontin' :
        print(row)
import pandas as pd


drug_df1 = pd.read_table('drugs.tsv')
drug_df_train = pd.read_table('train.tsv')
drug_df_test = pd.read_table('test.tsv')
drug_df2 = drug_df_train.append(drug_df_test)

drug_set2 = list()
for index, row in drug_df2.iterrows():
    row['urlDrugName'] = row['urlDrugName'].lower()
    drug_set2.append(row['urlDrugName'])

drug_set2 = set(drug_set2)

drugs_df = pd.DataFrame(drug_df1.iloc[0])
drug_ids = []
for index, row in drug_df1.iterrows():
    if row['drugName'].lower() in drug_set2:
        drug_ids.append(index)

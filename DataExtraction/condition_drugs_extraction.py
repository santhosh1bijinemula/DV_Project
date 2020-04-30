from DataExtraction.drugs_extraction import drug_ids, drug_df1

condition_drug_map = {}

for index in drug_ids:
    condition = str(drug_df1.iloc[index]['condition']).lower()
    drug = drug_df1.iloc[index]['drugName'].lower()
    if condition in condition_drug_map:
        if drug not in condition_drug_map[str(condition)]:
            condition_drug_map[str(condition)].append(drug)
    else:
        drug_list = list()
        drug_list.append(drug)
        condition_drug_map[str(condition)] = drug_list

conditions_list_df1 = list(condition_drug_map.keys())
print(condition_drug_map)
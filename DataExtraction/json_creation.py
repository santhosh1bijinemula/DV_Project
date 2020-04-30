import json
from DataExtraction.condition_drugs_extraction import condition_drug_map
from DataExtraction.conditions_extraction import symptom_conditions_map

final_map = {"name": "symptoms"}
symptoms_list = list()

for symptom, conditions in symptom_conditions_map.items():
    if len(conditions) <= 5:
        continue

    symptom_map = dict()
    symptom_map["name"] = symptom
    conditions_list = list()
    cond = []
    for key, val in condition_drug_map.items():
        if key in conditions:
            cond += [key]
            condition_map = dict()
            condition_map["name"] = key
            drug_list = list()

            for drug in val:
                drug_map = dict()
                drug_map["name"] = drug
                drug_map["size"] = 50
                drug_list.append(drug_map)

            condition_map["children"] = drug_list
            conditions_list.append(condition_map)
    symptom_map["children"] = conditions_list

    print(symptom,cond)
    if len(cond) < 4:
        continue
    symptoms_list.append(symptom_map)

final_map["children"] = symptoms_list
with open('final_map.json', 'w') as outfile:
    json.dump(final_map, outfile)
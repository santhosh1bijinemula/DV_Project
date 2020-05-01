import nltk
from nltk.corpus import stopwords
import pandas as pd
import json

se_df = pd.read_csv('side_effects_data.csv')
se_reviews = se_df['sideEffectsReview']

drug_side_effects_reviews = []

drug_list = []
for index, row in se_df.iterrows():
    drug_list.append(row['urlDrugName'])
    drug_side_effects_reviews.append(row['sideEffectsReview'])

drug_list = list(set(drug_list))
drug_list.sort()

stopWords = set(stopwords.words('english'))
drug_side_effects_reviews_split = []

for review in drug_side_effects_reviews:
    temp = review.split(' ')
    drug_side_effects_reviews_split.append(temp)


drug_side_effects_reviews_split_cleaned = []
for se_review in drug_side_effects_reviews_split:
    final_keywords_list = []
    for word in se_review:
        final_word = ''.join(c for c in word if c.isalnum())
        final_word = final_word.lower()
        if final_word != '' and final_word not in stopWords:
            tag = nltk.pos_tag([final_word])

            if tag[0][1] == 'NN' or tag[0][1] == 'NNS' or tag[0][1] == 'NNP' or tag[0][1] == 'NNPS':
                final_keywords_list.append(final_word)

    drug_side_effects_reviews_split_cleaned.append(set(final_keywords_list))


side_effects_list = set([line.rstrip('\n') for line in open("side_effects.txt")])


table_side_effects = []
for row in drug_side_effects_reviews_split_cleaned:
    row_side_effects = set()
    for side_effect in row:
        if side_effect in side_effects_list:
            row_side_effects.add(side_effect)
    table_side_effects.append(row_side_effects)


for ind in range(len(table_side_effects)):
    if len(table_side_effects[ind]) == 0:
        table_side_effects[ind].add('x')

count_0 = 0
count_not_0 = 0
drug_side_effects_map = {}

for ind in range(len(table_side_effects)):
    drug_name = se_df.iloc[ind]['urlDrugName'].lower()
    if drug_name in drug_side_effects_map:
        drug_side_effects_map[drug_name].union(table_side_effects[ind])
    else:
        drug_side_effects_map[drug_name] = table_side_effects[ind]

print(drug_side_effects_map)

for drug, side_effects in drug_side_effects_map.items():
    drug_side_effects_map[drug]=list(side_effects)

with open('final_map.json', 'w') as outfile:
    json.dump(drug_side_effects_map, outfile)
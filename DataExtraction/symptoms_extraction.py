import json
from nltk.corpus import stopwords
from DataExtraction.conditions_extraction import symptoms_list

d_file = open('drugs.txt', 'r')
drugs = d_file.readlines()
for index in range(len(drugs)):
    drugs[index] = drugs[index].strip()
d_file.close()

drug_in_answer = set()
for drug in drugs:
    drug_in_answer.add(drug.split(' ')[0])

drug_list = list(drug_in_answer)
drug_list.sort()


symptomList = [line.rstrip('\n') for line in open("symptoms.txt")]

stopWords = set(stopwords.words('english'))

q_answers = []
with open('question&answer.json') as json_file:
    json_data = json.load(json_file, strict=False,)
    for row in json_data:
        q_answers.append(row['answerContent'].lower())


answers_split = []
for answer in q_answers:
    temp = answer.split(' ')
    answers_split.append(temp)


answers_split_cleaned = []
for answer in answers_split:
    final_keywords_list = []
    for word in answer:
        final_word = ''.join(c for c in word if c.isalnum())
        final_word = final_word.lower()
        if final_word != '' and final_word not in stopWords:
            final_keywords_list.append(final_word)

        answers_split_cleaned.append(set(final_keywords_list))

count_0 = 0
count_not_0 = 0
for symptom in symptoms_list:

    answer_ids = list(range(len(q_answers)))
    temp_ids = []
    for ind in answer_ids:
        if symptom in q_answers[ind]:
            temp_ids.append(ind)

    answer_ids = temp_ids

    symptom_drugs = []
    for index in answer_ids:
        for drug in drug_list:
            if drug in q_answers[index]:
                symptom_drugs.append(drug)

    if len(set(symptom_drugs)) == 0:
        count_0 += 1
    elif len(set(symptom_drugs)) != 10:
        count_not_0 +=1
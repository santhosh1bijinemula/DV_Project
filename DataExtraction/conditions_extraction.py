import json
from nltk.corpus import stopwords
from bs4 import BeautifulSoup
import io

with io.open('conditions_symptoms.html', encoding="ISO-8859-1") as fp:
    soup = BeautifulSoup(fp,'html.parser')

columns = soup.findAll('td')
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

conditions_list = []
symptoms_list = []

for index in range(0,len(columns),3):
    condition = columns[index].find('span').contents
    symptom = columns[index + 2].find('span').contents
    if len(condition) > 1:
        condition = condition[0].replace('\n ', '')
        condition = condition.split('^')
        condition = condition[0].split('_')
        conditions_list.append(condition[-1])
        symptom = symptom[0].replace('\n ', '')
        symptom = symptom.split('^')
        symptom = symptom[0].split('_')
        symptoms_list.append(symptom[-1])
        continue
    symptom = symptom[0].replace('\n ', '')
    symptom = symptom.split('^')
    symptom = symptom[0].split('_')
    symptoms_list.append(symptom[-1])
    conditions_list.append(conditions_list[-1])

symptoms_list.sort()
conditions_list.sort()
conditions_list = set(conditions_list)
symptoms_list = set(symptoms_list)
symptomList = [line.rstrip('\n') for line in open("symptoms.txt")]
from DataExtraction.condition_drugs_extraction import conditions_list_df1

symptom_conditions_map = {}
for symptom in symptomList:

    answer_ids = list(range(len(q_answers)))
    temp_ids = []
    for ind in answer_ids:
        if symptom in q_answers[ind]:
            temp_ids.append(ind)

    answer_ids = temp_ids

    symptom_conditions = []
    for index in answer_ids:
        for condition in conditions_list_df1:
            if condition in q_answers[index]:
                symptom_conditions.append(condition)
    symptom_conditions = list(set(symptom_conditions))
    symptom_conditions_map[symptom] = symptom_conditions

print(symptom_conditions_map['vomiting'])
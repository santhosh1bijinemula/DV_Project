import numpy as np


se = open('side_effects', 'r')
se_d = se.readlines()
print("se_d_count", len(se_d))

side_effects = list()
for i in range(len(se_d)):
    side_effects.append(se_d[i].lower())

side_effects = np.unique(np.array(side_effects))
side_effects.sort()
print(side_effects)
print(len(side_effects))


with open("new_side_effects.txt","w") as side_effects_file:
    for val in side_effects:
        side_effects_file.write(val)
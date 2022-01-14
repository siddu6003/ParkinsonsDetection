import pandas as pd
import os
from skimage.transform import resize
from skimage.io import imread
import numpy as np
import matplotlib.pyplot as plt
from sklearn import svm
from sklearn.svm import SVC
from sklearn.model_selection import GridSearchCV
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pickle

Categories=['healthy','parkinson']

with open('model_spiral','rb') as f:
	model=pickle.load(f)

print("Model loaded")
print("\n")
path=os.getcwd()
url=path+'\\uploads\\image.png'
img=imread(url)
img_resize=resize(img,(150,150,3))
l=[img_resize.flatten()]
probability=model.predict_proba(l)
for ind,val in enumerate(Categories):
    print(f'{val} = {probability[0][ind]*100}%')
    print("\n")
print("The predicted image is : "+Categories[model.predict(l)[0]])

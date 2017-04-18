#!/usr/bin/python

import sys
import pickle
sys.path.append("../tools/")

from feature_format import featureFormat, targetFeatureSplit
from tester import test_classifier
from tester import dump_classifier_and_data
import outlier_cleaner
import numpy as np

### Task 1: Select what features you'll use.
### features_list is a list of strings, each of which is a feature name.
### The first feature must be "poi".
features_list = ['poi', 'shared_receipt_with_poi', 'in_over_out', 'from_poi_to_this_person',
                 'loan_advances', 'from_this_person_to_poi']

### Load the dictionary containing the dataset
from collections import defaultdict
with open("final_project_dataset.pkl", "r") as data_file:
    data_dict = pickle.load(data_file)

newdata = {}
for item, value in data_dict.iteritems():
    invalid = False
    for feature in ["to_messages", "from_messages", 'shared_receipt_with_poi',
                    'from_poi_to_this_person', 'from_this_person_to_poi']:
        if value[feature] == 'NaN':
            invalid = True
            break
    if invalid:
        continue
    newdata[item] = value
data_dict = newdata
for name, info in data_dict.iteritems():
    data_dict[name]["in_over_out"] = float(data_dict[name]["to_messages"])/float(data_dict[name]["from_messages"])
for item, value in data_dict.iteritems():
    print(item, value)
# data = featureFormat(data_dict, features_list)
# labels, features = targetFeatureSplit(data)
# print(labels)
#
# data = featureFormat(data_dict, features_list, sort_keys = True)
# labels, features = targetFeatureSplit(data)
# from sklearn.feature_selection import SelectKBest
# selector = SelectKBest(k = 5)
# selector.fit(features, labels)
# for i, a in enumerate(selector.scores_):
#     print(features_list[i+1] + ": " + str(float(a)))
    # Highest 5 scores are for shared_receipt_with_poi, in_over_out, from_poi_to_this_person,
# #                         loan_advances, from_this_person_to_poi. I have edited the features_list to reflect this.
# # deferral_payments
# print selector.pvalues_
# features = selector.transform(features)

# ### Task 2: Remove outliers
# from sklearn.linear_model import LinearRegression
# reg = LinearRegression()
# reg.fit(features, labels)
# predictions = reg.predict(features)
#
# ##The following based on the outlier_cleaner from the outliers lesson
# outliers = []
# errors = []
# for i, prediction in enumerate(predictions):
#     errors.append(pow(prediction-labels[i], 2))
# errormax = np.percentile(errors, 90)
# for i, value in enumerate(errors):
#     if value > errormax:
#         print(features[i])
#         print(labels[i])

# I saw that the outliers were entirely comprised of poi's, which I suppose are outliers, but I decided not to
# remove them for this reason.

# Task 3: Create new feature(s)
# Store to my_dataset for easy export below.

my_dataset = data_dict
# I used PCA here but it significantly decreased performance
# from sklearn.decomposition import PCA
# analyzer = PCA(3)
# features = analyzer.fit_transform(features)
# remover = OneClassSVM()
# remover.fit(features)


### Extract features and labels from dataset for local testing

### Task 4: Try a varity of classifiers
### Please name your classifier clf for easy export below.
### Note that if you want to do PCA or other multi-stage operations,
### you'll need to use Pipelines. For more info:
### http://scikit-learn.org/stable/modules/pipeline.html

# Provided to give you a starting point. Try a variety of classifiers.
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import AdaBoostClassifier

base_clf = DecisionTreeClassifier(max_features="auto", min_samples_split=2, class_weight="balanced")
clf = AdaBoostClassifier(base_estimator = base_clf, n_estimators=66)

# Here I used GridSearchCV to tune the parameters

### Task 5: Tune your classifier to achieve better than .3 precision and recall 
### using our testing script. Check the tester.py script in the final project
### folder for details on the evaluation method, especially the test_classifier
### function. Because of the small size of the dataset, the script uses
### stratified shuffle split cross validation. For more info: 
### http://scikit-learn.org/stable/modules/generated/sklearn.cross_validation.StratifiedShuffleSplit.html

# Example starting point. Try investigating other evaluation techniques!
#from sklearn.metrics import precision_recall_fscore_support
# The following I used for testing nd finding the best parameters
# clf.fit(features, labels)
# print(clf.best_params_)
# predictions = clf.predict(features_test)
# print(predictions)
# print(precision_recall_fscore_support(np.array(labels_test), predictions, average="binary"))



# TESTING RESULTS #
#   NAME                        PRECISION RECALL F1 SCORE    NOTES
# Gaussian NB                   0         0       0          No positive predictions
# SVM (SVC)                     0         0       0          No positive predictions
# DecisionTreeClassifier        0.316     0.367   0.337
# RandomForestClassifier        0.296     0.298   0.297
# Adaboost with DecisionTree    0.317     0.380   0.345
# GradientBoostingClassifier    0.183     0.183   0.183

### Task 6: Dump your classifier, dataset, and features_list so anyone can
### check your results. You do not need to change anything below, but make sure
### that the version of poi_id.py that you submit can be run on its own and
### generates the necessary .pkl files for validating your results.

test_classifier(clf, data_dict, features_list)
dump_classifier_and_data(clf, my_dataset, features_list)

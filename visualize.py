# # Import Libraries
# import pandas as pd
# import numpy as np
# import matplotlib.pyplot as plt

# from sklearn.preprocessing import StandardScaler
# from sklearn.decomposition import PCA
# from sklearn.svm import SVC
# from sklearn.model_selection import train_test_split

# # Load Dataset
# # Replace with your file path
# data = pd.read_csv("diabetes.csv")

# # Features and Label
# X = data.drop("Outcome", axis=1)
# y = data["Outcome"]

# # Split Data
# X_train, X_test, y_train, y_test = train_test_split(
#     X, y, test_size=0.2, random_state=42
# )

# # Standardize Features
# scaler = StandardScaler()
# X_train_scaled = scaler.fit_transform(X_train)
# X_test_scaled = scaler.transform(X_test)

# # Apply PCA (Reduce 8 Features → 2 Components)
# pca = PCA(n_components=2)
# X_train_pca = pca.fit_transform(X_train_scaled)
# X_test_pca = pca.transform(X_test_scaled)

# # Train SVM
# svm_model = SVC(kernel='rbf')
# svm_model.fit(X_train_pca, y_train)

# # Create Mesh Grid for Decision Boundary
# x_min, x_max = X_train_pca[:, 0].min() - 1, X_train_pca[:, 0].max() + 1
# y_min, y_max = X_train_pca[:, 1].min() - 1, X_train_pca[:, 1].max() + 1

# xx, yy = np.meshgrid(
#     np.arange(x_min, x_max, 0.02),
#     np.arange(y_min, y_max, 0.02)
# )

# Z = svm_model.predict(np.c_[xx.ravel(), yy.ravel()])
# Z = Z.reshape(xx.shape)

# # Plot
# plt.figure(figsize=(8,6))
# plt.contourf(xx, yy, Z, alpha=0.3)

# plt.scatter(
#     X_train_pca[:, 0],
#     X_train_pca[:, 1],
#     c=y_train
# )

# plt.xlabel("PCA Component 1")
# plt.ylabel("PCA Component 2")
# plt.title("SVM Decision Boundary (PCA Reduced Data)")
# plt.show()

# plt.scatter(data["Glucose"], data["BMI"], c=data["Outcome"])
# plt.xlabel("Glucose")
# plt.ylabel("BMI")
# plt.title("Glucose vs BMI Scatter Plot")
# plt.show()


# Import Libraries
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix, roc_auc_score

# Load Dataset
data = pd.read_csv("diabetes.csv")

# Features and Label
X = data.drop("Outcome", axis=1)
y = data["Outcome"]

# Split Data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Standardize Features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train SVM on FULL FEATURES (No PCA)
svm_model = SVC(kernel='rbf', probability=True)
svm_model.fit(X_train_scaled, y_train)

# ================= PERFORMANCE METRICS ================= #

# Predictions
y_pred = svm_model.predict(X_test_scaled)

# Probabilities
y_prob = svm_model.predict_proba(X_test_scaled)[:, 1]

print("\n===== MODEL PERFORMANCE (NO PCA) =====")
print("Accuracy Score:", accuracy_score(y_test, y_pred))
print("\nConfusion Matrix:\n", confusion_matrix(y_test, y_pred))
print("\nROC AUC Score:", roc_auc_score(y_test, y_prob))

import joblib

joblib.dump(svm_model, "svm_model.pkl")
joblib.dump(scaler, "scaler.pkl")
joblib.dump(X_test, "X_test.pkl")
joblib.dump(y_test, "y_test.pkl")

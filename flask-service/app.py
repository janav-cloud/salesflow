from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import joblib
from io import StringIO
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Load model and scaler
model = joblib.load("lead_scoring_model.pkl")
scaler = joblib.load("scaler.pkl")

def categorize_prediction(prediction, lead_score):
    if prediction == 1:
        if lead_score > 95:
            return "Most Likely to Convert"
        elif lead_score <= 95 and lead_score >= 75:
            return "Good Scope"
        else:
            return "Future Scope"
    else:
        return "No Scope"

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    contents = file.read().decode("utf-8")
    df = pd.read_csv(StringIO(contents))
    original_df = df.copy()

    # Drop non-feature columns
    df.drop(columns=["Lead_ID", "Company_Name", "Company_Client_Email"], inplace=True)

    # Fill missing values
    df.fillna({
        "Email_Open_Rate": df["Email_Open_Rate"].median(),
        "Click_Through_Rate": df["Click_Through_Rate"].median(),
        "Past_Purchases": df["Past_Purchases"].median(),
        "Response_Time": df["Response_Time"].median(),
        "Marketing_Spend": df["Marketing_Spend"].median(),
        "Lead_Score": df["Lead_Score"].median(),
        "Demo_Scheduled": 0
    }, inplace=True)

    # One-hot encoding
    df = pd.get_dummies(df, columns=["Lead_Source", "Industry"], drop_first=True)

    # Ensure all required columns exist
    for col in scaler.feature_names_in_:
        if col not in df.columns:
            df[col] = 0

    df = df[scaler.feature_names_in_]

    # Feature engineering
    df["Engagement_Level"] = (
        df["Email_Open_Rate"] * 0.4 +
        df["Click_Through_Rate"] * 0.3 +
        df["Past_Purchases"] * 0.3
    )
    df["Marketing_Spend"] = np.log1p(df["Marketing_Spend"])

    df["Response_Bin"] = pd.cut(
        df["Response_Time"],
        bins=[0, 12, 24, 48, 72, 200],
        labels=[4, 3, 2, 1, 0],
        include_lowest=True
    ).astype(int)

    scaled_data = scaler.transform(df)
    predictions = model.predict(scaled_data)

    original_df["Prediction"] = predictions
    original_df["Category"] = [
        categorize_prediction(pred, score)
        for pred, score in zip(predictions, original_df["Lead_Score"])
    ]

    result = original_df[["Lead_ID", "Company_Name", "Company_Client_Email", "Category"]].to_dict(orient="records")
    return jsonify({"leads": result})

@app.route('/insights', methods=['POST'])
def insights():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    contents = file.read().decode("utf-8")
    df = pd.read_csv(StringIO(contents))
    original_df = df.copy()

    # Drop non-feature columns
    df.drop(columns=["Lead_ID", "Company_Name", "Company_Client_Email"], inplace=True)

    # Fill missing values
    df.fillna({
        "Email_Open_Rate": df["Email_Open_Rate"].median(),
        "Click_Through_Rate": df["Click_Through_Rate"].median(),
        "Past_Purchases": df["Past_Purchases"].median(),
        "Response_Time": df["Response_Time"].median(),
        "Marketing_Spend": df["Marketing_Spend"].median(),
        "Lead_Score": df["Lead_Score"].median(),
        "Demo_Scheduled": 0
    }, inplace=True)

    # One-hot encoding
    df = pd.get_dummies(df, columns=["Lead_Source", "Industry"], drop_first=True)

    # Ensure all required columns exist
    for col in scaler.feature_names_in_:
        if col not in df.columns:
            df[col] = 0

    df = df[scaler.feature_names_in_]

    # Feature engineering
    df["Engagement_Level"] = (
        df["Email_Open_Rate"] * 0.4 +
        df["Click_Through_Rate"] * 0.3 +
        df["Past_Purchases"] * 0.3
    )
    df["Marketing_Spend"] = np.log1p(df["Marketing_Spend"])

    df["Response_Bin"] = pd.cut(
        df["Response_Time"],
        bins=[0, 12, 24, 48, 72, 200],
        labels=[4, 3, 2, 1, 0],
        include_lowest=True
    ).astype(int)

    scaled_data = scaler.transform(df)
    predictions = model.predict(scaled_data)

    original_df["Prediction"] = predictions
    original_df["Category"] = [
        categorize_prediction(pred, score)
        for pred, score in zip(predictions, original_df["Lead_Score"])
    ]

    full_df = original_df.to_dict(orient="records")
    return jsonify({"full_dataframe": full_df})

if __name__ == "__main__":
    app.run(port=8000, debug=True)
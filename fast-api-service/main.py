import pandas as pd
import numpy as np
import joblib
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from io import StringIO

app = FastAPI()

# Optional CORS - allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    print("Received /predict request")
    try:
        contents = await file.read()
        df = pd.read_csv(StringIO(contents.decode("utf-8")))
        original_df = df.copy()

        # Drop non-feature columns if they exist
        for col in ["Lead_ID", "Company_Name", "Company_Client_Email"]:
            if col in df.columns:
                df.drop(columns=[col], inplace=True)

        # Fill missing values for expected columns
        for col in ["Email_Open_Rate", "Click_Through_Rate", "Past_Purchases", "Response_Time", "Marketing_Spend", "Lead_Score"]:
            if col in df.columns:
                df[col].fillna(df[col].median(), inplace=True)
        if "Demo_Scheduled" in df.columns:
            df["Demo_Scheduled"].fillna(0, inplace=True)

        # One-hot encoding for categorical columns if they exist
        for cat_col in ["Lead_Source", "Industry"]:
            if cat_col in df.columns:
                df = pd.get_dummies(df, columns=[cat_col], drop_first=True)

        # Ensure all required columns exist
        for col in scaler.feature_names_in_:
            if col not in df.columns:
                df[col] = 0

        df = df[scaler.feature_names_in_]

        # Feature engineering
        if all(c in df.columns for c in ["Email_Open_Rate", "Click_Through_Rate", "Past_Purchases"]):
            df["Engagement_Level"] = (
                df["Email_Open_Rate"] * 0.4 +
                df["Click_Through_Rate"] * 0.3 +
                df["Past_Purchases"] * 0.3
            )
        if "Marketing_Spend" in df.columns:
            df["Marketing_Spend"] = np.log1p(df["Marketing_Spend"])
        if "Response_Time" in df.columns:
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
        return {"leads": result}

    except Exception as e:
        print("Error in /predict:", str(e))
        return {"error": str(e)}

@app.post("/insights")
async def insights(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        df = pd.read_csv(StringIO(contents.decode("utf-8")))

        # Process the data similarly to the /predict endpoint
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
        # Return the full DataFrame for insights
        return {"full_dataframe": full_df}

    except Exception as e:
        return {"error": str(e)}
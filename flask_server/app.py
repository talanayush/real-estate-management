from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes (you can restrict to specific domains later)

# Load the trained model
with open('housePrice_model.pkl', 'rb') as file:
    rf = pickle.load(file)

with open('model1.pkl', 'rb') as file:
    rl = pickle.load(file)

# Define the earliest date in your dataset (adjust as needed)
mn = pd.to_datetime('2001-01-01')  # Replace with the actual earliest date in your dataset


@app.route("/api/predict", methods=["POST"])
def predict_price():
    try:
        # Get data from the React frontend
        data = request.get_json()

        # Extract data from the received JSON
        longitude = float(data["longitude"])
        latitude = float(data["latitude"])
        square_footage = float(data["squareFootage"])
        building_type = data["buildingType"]
        trade_time = data["tradeTime"]
        input_data1 = pd.DataFrame({'price': [square_footage]})

        # Convert tradeTime (string) to datetime and extract components
        trade_time = pd.to_datetime(trade_time)
        year = trade_time.year
        month = trade_time.month
        day = trade_time.day

        # Calculate the number of days since the earliest date (mn)
        day_since = (trade_time - mn).days

        # Prepare the input data for prediction (same order as the model was trained with)
        input_data = pd.DataFrame({
            'Lng': [longitude],
            'Lat': [latitude],
            'square': [square_footage],
            'buildingType': [building_type],
            'year': [year],
            'month': [month],
            'day': [day],
            'days_since': [day_since]
        })

        # Ensure the input data columns match the model's expectations
        expected_columns1 = ['price']
        expected_columns = ['Lng', 'Lat', 'square', 'buildingType', 'year', 'month', 'day', 'days_since']
        input_data1 = input_data1[expected_columns1]
        input_data = input_data[expected_columns]
        # Make the prediction using the model
        predicted_price = rl.predict(input_data1)
        predicted_price1 = rf.predict(input_data)
        # Check if the prediction is valid
        if predicted_price is not None and len(predicted_price) > 0:
            predicted_price_value = float(predicted_price[0])*1000
        else:
            predicted_price_value = "Prediction Error"
        if predicted_price1 is not None and len(predicted_price1) > 0:
            predicted_price_value1 = predicted_price1[0]*100
        else:
            predicted_price_value1 = "Prediction Error"
        predicted_price_value = predicted_price_value*0.4 + predicted_price_value1*0.6
        # Return the prediction as a JSON response
        return jsonify({"result": f"₹{predicted_price_value:,.2f}"})

    except Exception as e:
        # Handle any exceptions that occur and return the error message
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

MODEL_PATH = "rul_model.pkl"

def train_dummy_model():
    """
    Trains a mock Random Forest model to predict Remaining Useful Life (RUL) 
    based on engine temperature and vibration.
    """
    print("Training synthetic RUL prediction model...")
    # Generate synthetic training data
    np.random.seed(42)
    n_samples = 1000
    
    # Healthy states
    temp_healthy = np.random.normal(90, 5, int(n_samples * 0.8))
    vib_healthy = np.random.normal(20, 3, int(n_samples * 0.8))
    rul_healthy = np.random.uniform(500, 1000, int(n_samples * 0.8)) # High RUL
    
    # Degrading states
    temp_degrading = np.random.normal(105, 5, int(n_samples * 0.2))
    vib_degrading = np.random.normal(40, 5, int(n_samples * 0.2))
    rul_degrading = np.random.uniform(0, 100, int(n_samples * 0.2)) # Low RUL
    
    temp = np.concatenate([temp_healthy, temp_degrading])
    vib = np.concatenate([vib_healthy, vib_degrading])
    rul = np.concatenate([rul_healthy, rul_degrading])
    
    X = pd.DataFrame({'temperature': temp, 'vibration': vib})
    y = rul
    
    # Train model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    # Save model
    joblib.dump(model, MODEL_PATH)
    print(f"Model saved to {MODEL_PATH}")
    return model

def predict_rul(temperature: float, vibration: float) -> float:
    """Predicts RUL for given sensor readings."""
    if not os.path.exists(MODEL_PATH):
        model = train_dummy_model()
    else:
        model = joblib.load(MODEL_PATH)
        
    X_new = pd.DataFrame({'temperature': [temperature], 'vibration': [vibration]})
    prediction = model.predict(X_new)[0]
    return round(prediction, 2)

if __name__ == "__main__":
    train_dummy_model()
    print("Test prediction (Temp: 92, Vib: 21) -> RUL:", predict_rul(92, 21))
    print("Test prediction (Temp: 108, Vib: 45) -> RUL:", predict_rul(108, 45))

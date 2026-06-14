"""
AegisCare ML API — Flask service that serves all 4 trained models.
Runs on port 5001 alongside the Express backend (port 5000).
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib
import os
import logging

# ── Setup ─────────────────────────────────────────────────────

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, 'models')

# ── Load Models ───────────────────────────────────────────────

def load(name):
    path = os.path.join(MODEL_DIR, name)
    if not os.path.exists(path):
        logging.error(f"Model file not found: {path}")
        return None
    return joblib.load(path)

anomaly_model   = load('anomaly_detector.pkl')
anomaly_scaler  = load('anomaly_scaler.pkl')
risk_model      = load('health_risk_model.pkl')
risk_scaler     = load('health_risk_scaler.pkl')
cognitive_model = load('cognitive_model.pkl')
cognitive_scaler = load('cognitive_scaler.pkl')
nutrition_artifacts = load('nutrition_recommender.pkl')

RISK_LABELS = ['Low', 'Medium', 'High']
COGNITIVE_LABELS = ['Stable', 'Mild Decline', 'Significant Decline']

logging.info("All ML models loaded successfully.")


# ── Health Check ──────────────────────────────────────────────

@app.route('/ml/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'OK',
        'models_loaded': {
            'anomaly_detection': anomaly_model is not None,
            'health_risk': risk_model is not None,
            'cognitive_decline': cognitive_model is not None,
            'nutrition': nutrition_artifacts is not None,
        }
    })


# ── 1. Vital Signs Anomaly Detection ─────────────────────────

ANOMALY_FEATURES = [
    'heart_rate', 'systolic_bp', 'diastolic_bp', 'glucose',
    'spo2', 'temperature', 'age', 'hour_of_day',
    'pulse_pressure', 'map', 'hr_bp_ratio'
]

@app.route('/ml/anomaly-detection', methods=['POST'])
def detect_anomaly():
    """
    Input JSON:
    {
      "heart_rate": 110,
      "systolic_bp": 180,
      "diastolic_bp": 110,
      "glucose": 200,
      "spo2": 91,
      "temperature": 38.5,
      "age": 75,
      "hour_of_day": 14    (optional, defaults to current hour)
    }
    Derived features (pulse_pressure, map, hr_bp_ratio) are computed automatically.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON body provided'}), 400

        hr   = float(data.get('heart_rate', 72))
        sbp  = float(data.get('systolic_bp', 120))
        dbp  = float(data.get('diastolic_bp', 80))
        glu  = float(data.get('glucose', 100))
        spo2 = float(data.get('spo2', 97))
        temp = float(data.get('temperature', 36.6))
        age  = float(data.get('age', 75))
        hour = float(data.get('hour_of_day', __import__('datetime').datetime.now().hour))

        # Derived features
        pp  = sbp - dbp
        map_val = (sbp + 2 * dbp) / 3
        hr_bp = hr / sbp if sbp > 0 else 0

        features = [hr, sbp, dbp, glu, spo2, temp, age, hour, pp, map_val, hr_bp]
        X = np.array([features], dtype=float)
        X_scaled = anomaly_scaler.transform(X)

        raw_pred = anomaly_model.predict(X_scaled)[0]
        score = float(anomaly_model.decision_function(X_scaled)[0])

        is_anomaly = raw_pred == -1
        severity = 'normal'
        if is_anomaly:
            if score < -0.2:
                severity = 'critical'
            elif score < -0.1:
                severity = 'high'
            else:
                severity = 'moderate'

        # Build alert messages for specific vitals
        alerts = []
        if hr > 100 or hr < 50:
            alerts.append({'vital': 'heart_rate', 'value': hr, 'message': f'Heart rate {"elevated" if hr > 100 else "low"}: {hr} BPM'})
        if sbp > 160 or sbp < 90:
            alerts.append({'vital': 'systolic_bp', 'value': sbp, 'message': f'Blood pressure {"high" if sbp > 160 else "low"}: {sbp}/{dbp} mmHg'})
        if glu > 180 or glu < 60:
            alerts.append({'vital': 'glucose', 'value': glu, 'message': f'Glucose {"high" if glu > 180 else "critically low"}: {glu} mg/dL'})
        if spo2 < 92:
            alerts.append({'vital': 'spo2', 'value': spo2, 'message': f'Low oxygen saturation: {spo2}%'})
        if temp > 38.0 or temp < 35.5:
            alerts.append({'vital': 'temperature', 'value': temp, 'message': f'Temperature {"elevated" if temp > 38.0 else "low"}: {temp}°C'})

        return jsonify({
            'is_anomaly': bool(is_anomaly),
            'severity': severity,
            'anomaly_score': round(score, 4),
            'alerts': alerts,
            'vitals_analyzed': dict(zip(ANOMALY_FEATURES[:6], [hr, sbp, dbp, glu, spo2, temp])),
        })

    except Exception as e:
        logging.error(f"Anomaly detection error: {e}")
        return jsonify({'error': str(e)}), 500


# ── 2. Health Risk Prediction ─────────────────────────────────

RISK_FEATURES = [
    'age', 'gender', 'bmi',
    'has_diabetes', 'has_hypertension', 'has_heart_disease', 'has_copd', 'has_arthritis',
    'num_conditions',
    'avg_hr_7d', 'avg_sbp_7d', 'avg_dbp_7d', 'avg_glucose_7d', 'avg_spo2_7d', 'avg_temp_7d',
    'hr_variability', 'bp_variability', 'glucose_variability',
    'anomaly_count_30d',
    'num_medications', 'adherence_rate_30d', 'missed_doses_7d',
    'avg_calories', 'avg_protein', 'avg_carbs', 'avg_fats', 'meals_per_day',
    'consultations_90d', 'missed_appointments_90d', 'er_visits_180d',
    'cognitive_score', 'days_since_checkup'
]

@app.route('/ml/health-risk', methods=['POST'])
def predict_health_risk():
    """
    Input: JSON with all 32 features, or a simplified profile that fills defaults.
    Returns risk level (Low/Medium/High) with probabilities.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON body provided'}), 400

        # Build feature vector with sensible defaults
        features = []
        defaults = {
            'age': 75, 'gender': 0, 'bmi': 25,
            'has_diabetes': 0, 'has_hypertension': 0, 'has_heart_disease': 0,
            'has_copd': 0, 'has_arthritis': 0, 'num_conditions': 0,
            'avg_hr_7d': 75, 'avg_sbp_7d': 130, 'avg_dbp_7d': 80,
            'avg_glucose_7d': 105, 'avg_spo2_7d': 96, 'avg_temp_7d': 36.6,
            'hr_variability': 8, 'bp_variability': 12, 'glucose_variability': 15,
            'anomaly_count_30d': 0,
            'num_medications': 2, 'adherence_rate_30d': 0.9, 'missed_doses_7d': 1,
            'avg_calories': 1700, 'avg_protein': 55, 'avg_carbs': 200,
            'avg_fats': 55, 'meals_per_day': 3,
            'consultations_90d': 2, 'missed_appointments_90d': 0, 'er_visits_180d': 0,
            'cognitive_score': 80, 'days_since_checkup': 30,
        }

        for feat in RISK_FEATURES:
            features.append(float(data.get(feat, defaults.get(feat, 0))))

        X = np.array([features], dtype=float)
        X_scaled = risk_scaler.transform(X)
        pred = int(risk_model.predict(X_scaled)[0])
        proba = risk_model.predict_proba(X_scaled)[0].tolist()

        # Top risk factors
        risk_factors = []
        if data.get('missed_doses_7d', 0) > 3:
            risk_factors.append('Missed medication doses')
        if data.get('anomaly_count_30d', 0) > 5:
            risk_factors.append('Frequent vitals anomalies')
        if data.get('num_conditions', 0) >= 3:
            risk_factors.append('Multiple chronic conditions')
        if data.get('adherence_rate_30d', 1) < 0.7:
            risk_factors.append('Low medication adherence')
        if data.get('er_visits_180d', 0) >= 2:
            risk_factors.append('Recent ER visits')

        return jsonify({
            'risk_level': RISK_LABELS[pred],
            'risk_score': pred,
            'probabilities': {
                'low': round(proba[0], 4),
                'medium': round(proba[1], 4),
                'high': round(proba[2], 4),
            },
            'risk_factors': risk_factors,
        })

    except Exception as e:
        logging.error(f"Health risk error: {e}")
        return jsonify({'error': str(e)}), 500


# ── 3. Nutritional Recommendation ─────────────────────────────

@app.route('/ml/nutrition-recommend', methods=['POST'])
def recommend_nutrition():
    """
    Input JSON:
    {
      "user_id": 5,              (for collaborative filtering, 0-999)
      "has_diabetes": 1,
      "has_heart_disease": 0,
      "needs_low_sodium": 0,
      "needs_low_carb": 1,
      "needs_soft_food": 0,
      "is_vegetarian": 0,
      "is_gluten_free": 0,
      "calorie_target": 1600,
      "protein_target": 55,
      "carbs_target": 150,
      "fats_target": 55,
      "meal_type": "lunch"       (optional: breakfast/lunch/dinner/snack)
    }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON body provided'}), 400

        from sklearn.metrics.pairwise import cosine_similarity

        scaler = nutrition_artifacts['nutrition_scaler']
        meal_features = nutrition_artifacts['meal_features']
        meals_df = nutrition_artifacts['meals_data']
        predicted_ratings = nutrition_artifacts['collab_predicted_ratings']

        # Build user preference vector
        ideal_nutrition = np.array([
            data.get('calorie_target', 1800) / 3,
            data.get('protein_target', 55) / 3,
            data.get('carbs_target', 220) / 3,
            data.get('fats_target', 60) / 3,
            5.0, 350, 8.0,
        ]).reshape(1, -1)
        nutrition_scaled = scaler.transform(ideal_nutrition).flatten()

        health_tags = np.array([
            1 if data.get('has_diabetes') else 0.5,
            1 if data.get('has_heart_disease') else 0.5,
            1 if data.get('needs_low_sodium') else 0.3,
            1 if data.get('needs_low_carb') else 0.3,
            0.7,
            0.5 if data.get('has_heart_disease') else 0.3,
            1 if data.get('needs_soft_food') else 0.3,
            1 if data.get('is_vegetarian') else 0.0,
            1 if data.get('is_gluten_free') else 0.0,
        ])
        user_vec = np.hstack([nutrition_scaled * 0.4, health_tags * 0.6])

        # Content-based similarity
        sims = cosine_similarity([user_vec], meal_features)[0]

        # Hard constraints
        mask = np.ones(len(meals_df), dtype=bool)
        if data.get('is_vegetarian'):
            mask &= meals_df['is_vegetarian'].values == 1
        if data.get('is_gluten_free'):
            mask &= meals_df['is_gluten_free'].values == 1
        if data.get('needs_soft_food'):
            mask &= meals_df['is_soft_food'].values == 1
        if data.get('meal_type'):
            mask &= meals_df['meal_type'].values == data['meal_type']
        sims[~mask] = -1

        top50 = np.argsort(sims)[::-1][:50]

        # Hybrid scoring
        user_id = int(data.get('user_id', 0))
        results = []
        for idx in top50:
            mid = int(meals_df.iloc[idx]['meal_id'])
            c_score = sims[idx]
            if user_id < predicted_ratings.shape[0] and mid < predicted_ratings.shape[1]:
                r_score = predicted_ratings[user_id, mid]
            else:
                r_score = 3.0
            results.append((idx, mid, c_score, r_score))

        c_vals = np.array([r[2] for r in results])
        r_vals = np.array([r[3] for r in results])
        c_min, c_max = c_vals.min(), c_vals.max()
        r_min, r_max = r_vals.min(), r_vals.max()

        scored = []
        for idx, mid, cs, rs in results:
            cn = (cs - c_min) / (c_max - c_min) if c_max > c_min else 0.5
            rn = (rs - r_min) / (r_max - r_min) if r_max > r_min else 0.5
            scored.append((idx, 0.6 * cn + 0.4 * rn))
        scored.sort(key=lambda x: x[1], reverse=True)

        n = int(data.get('count', 5))
        recommendations = []
        for idx, score in scored[:n]:
            meal = meals_df.iloc[idx]
            recommendations.append({
                'meal_id': int(meal['meal_id']),
                'name': str(meal['name']),
                'meal_type': str(meal['meal_type']),
                'calories': int(meal['calories']),
                'protein_g': round(float(meal['protein_g']), 1),
                'carbs_g': round(float(meal['carbs_g']), 1),
                'fats_g': round(float(meal['fats_g']), 1),
                'fiber_g': round(float(meal['fiber_g']), 1),
                'score': round(score, 4),
                'tags': {
                    'diabetic_friendly': bool(meal.get('is_diabetic_friendly', 0)),
                    'heart_healthy': bool(meal.get('is_heart_healthy', 0)),
                    'low_sodium': bool(meal.get('is_low_sodium', 0)),
                    'high_protein': bool(meal.get('is_high_protein', 0)),
                    'vegetarian': bool(meal.get('is_vegetarian', 0)),
                },
            })

        return jsonify({'recommendations': recommendations})

    except Exception as e:
        logging.error(f"Nutrition recommendation error: {e}")
        return jsonify({'error': str(e)}), 500


# ── 4. Cognitive Decline Detection ─────────────────────────────

COGNITIVE_FEATURES = [
    'age', 'gender', 'education_years', 'session_number',
    'memory_game_score', 'pattern_puzzle_score',
    'reaction_test_avg_ms', 'word_recall_correct',
    'memory_avg_7', 'pattern_avg_7', 'reaction_avg_7', 'word_recall_avg_7',
    'memory_trend_10', 'pattern_trend_10', 'reaction_trend_10', 'word_recall_trend_10',
    'memory_std_14', 'reaction_std_14',
    'composite_cognitive', 'reaction_ratio'
]

@app.route('/ml/cognitive-assessment', methods=['POST'])
def assess_cognitive():
    """
    Input: JSON with current game scores and historical rolling averages/trends.
    Returns cognitive status prediction.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON body provided'}), 400

        defaults = {
            'age': 75, 'gender': 0, 'education_years': 12, 'session_number': 1,
            'memory_game_score': 80, 'pattern_puzzle_score': 75,
            'reaction_test_avg_ms': 400, 'word_recall_correct': 7,
            'memory_avg_7': 80, 'pattern_avg_7': 75, 'reaction_avg_7': 400, 'word_recall_avg_7': 7,
            'memory_trend_10': 0, 'pattern_trend_10': 0, 'reaction_trend_10': 0, 'word_recall_trend_10': 0,
            'memory_std_14': 5, 'reaction_std_14': 20,
            'composite_cognitive': 78, 'reaction_ratio': 1.0,
        }

        features = [float(data.get(f, defaults[f])) for f in COGNITIVE_FEATURES]

        X = np.array([features], dtype=float)
        X_scaled = cognitive_scaler.transform(X)
        pred = int(cognitive_model.predict(X_scaled)[0])
        proba = cognitive_model.predict_proba(X_scaled)[0].tolist()

        # Compute a composite cognitive score from probabilities
        # Higher = more concern (0 = stable, 100 = significant decline)
        concern_score = round(proba[1] * 40 + proba[2] * 100, 1)

        return jsonify({
            'status': COGNITIVE_LABELS[pred],
            'status_code': pred,
            'probabilities': {
                'stable': round(proba[0], 4),
                'mild_decline': round(proba[1], 4),
                'significant_decline': round(proba[2], 4),
            },
            'concern_score': concern_score,
            'recommendation': (
                'Continue regular activities. Cognitive health is good.'
                if pred == 0 else
                'Monitor closely. Consider scheduling a professional assessment.'
                if pred == 1 else
                'Immediate professional evaluation recommended. Notify caregiver and doctor.'
            ),
        })

    except Exception as e:
        logging.error(f"Cognitive assessment error: {e}")
        return jsonify({'error': str(e)}), 500


# ── Run ───────────────────────────────────────────────────────

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=False)

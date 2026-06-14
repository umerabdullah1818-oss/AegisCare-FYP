"""
AegisCare ML - Comprehensive Model Testing
============================================
Tests all 4 trained models with realistic elderly patient scenarios.
Run: python test_all_models.py
"""

import numpy as np
import pandas as pd
import joblib
import os
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, 'models')
DATA_DIR = os.path.join(BASE_DIR, 'data')

# ─────────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────────

def separator(title):
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70)


def load_model(name):
    path = os.path.join(MODEL_DIR, name)
    if not os.path.exists(path):
        print(f"  [ERROR] {name} not found at {path}")
        return None
    return joblib.load(path)


# ─────────────────────────────────────────────────────────────
# MODEL 1: VITAL SIGNS ANOMALY DETECTION
# ─────────────────────────────────────────────────────────────

ANOMALY_FEATURES = [
    'heart_rate', 'systolic_bp', 'diastolic_bp', 'glucose',
    'spo2', 'temperature', 'age', 'hour_of_day',
    'pulse_pressure', 'map', 'hr_bp_ratio'
]

def test_anomaly_detection():
    separator("MODEL 1: VITAL SIGNS ANOMALY DETECTION")

    model = load_model('anomaly_detector.pkl')
    scaler = load_model('anomaly_scaler.pkl')
    if model is None or scaler is None:
        return

    # Test scenarios: realistic elderly vital sign readings
    scenarios = [
        {
            'name': 'Normal resting elderly (72yo, morning)',
            'expected': 'Normal',
            'values': [72, 128, 78, 105, 97, 36.6, 72, 8, 50, 94.7, 0.76],
            #          HR  SBP  DBP  GLU  SpO2 TEMP AGE HOUR PP   MAP  HR/BP
        },
        {
            'name': 'Normal active elderly (68yo, afternoon)',
            'expected': 'Normal',
            'values': [88, 135, 82, 110, 96, 36.8, 68, 14, 53, 99.7, 0.88],
        },
        {
            'name': 'Slightly elevated BP (80yo)',
            'expected': 'Normal',
            'values': [78, 145, 88, 98, 96, 36.5, 80, 10, 57, 107.0, 0.73],
        },
        {
            'name': 'CRITICAL: Hypertensive crisis (75yo)',
            'expected': 'Anomaly',
            'values': [110, 200, 120, 130, 93, 37.2, 75, 15, 80, 146.7, 0.75],
        },
        {
            'name': 'CRITICAL: Severe bradycardia (82yo)',
            'expected': 'Anomaly',
            'values': [38, 90, 55, 85, 94, 35.8, 82, 3, 35, 66.7, 0.57],
        },
        {
            'name': 'CRITICAL: Hypoglycemia (78yo)',
            'expected': 'Anomaly',
            'values': [105, 150, 90, 40, 95, 36.0, 78, 6, 60, 110.0, 0.95],
        },
        {
            'name': 'CRITICAL: Respiratory failure (85yo)',
            'expected': 'Anomaly',
            'values': [120, 160, 95, 115, 82, 37.5, 85, 22, 65, 116.7, 1.03],
        },
        {
            'name': 'CRITICAL: Sepsis pattern (77yo)',
            'expected': 'Anomaly',
            'values': [125, 85, 50, 180, 88, 39.5, 77, 2, 35, 61.7, 2.03],
        },
        {
            'name': 'Post-exercise normal (65yo)',
            'expected': 'Normal',
            'values': [95, 140, 85, 100, 96, 37.0, 65, 17, 55, 103.3, 0.92],
        },
        {
            'name': 'Sleeping elderly (73yo, night)',
            'expected': 'Normal',
            'values': [58, 115, 70, 95, 97, 36.2, 73, 3, 45, 85.0, 0.68],
        },
    ]

    print(f"\n  {'Scenario':<50s} {'Expected':<10s} {'Predicted':<10s} {'Score':>8s} {'Result'}")
    print("  " + "-" * 95)

    correct = 0
    total = len(scenarios)

    for s in scenarios:
        X = np.array([s['values']], dtype=float)
        X_scaled = scaler.transform(X)

        # Raw prediction (-1 = anomaly, 1 = normal)
        raw_pred = model.predict(X_scaled)[0]
        score = model.decision_function(X_scaled)[0]

        # Use optimized threshold from training (0.55 mapped to decision function)
        predicted = 'Anomaly' if raw_pred == -1 else 'Normal'
        match = predicted == s['expected']
        correct += int(match)
        flag = "PASS" if match else "FAIL"

        print(f"  {s['name']:<50s} {s['expected']:<10s} {predicted:<10s} {score:>+8.4f} {flag}")

    print(f"\n  Result: {correct}/{total} correct ({correct/total*100:.0f}%)")


# ─────────────────────────────────────────────────────────────
# MODEL 2: HEALTH RISK PREDICTION
# ─────────────────────────────────────────────────────────────

HEALTH_RISK_FEATURES = [
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
RISK_LABELS = ['Low', 'Medium', 'High']

def test_health_risk():
    separator("MODEL 2: HEALTH RISK PREDICTION")

    model = load_model('health_risk_model.pkl')
    scaler = load_model('health_risk_scaler.pkl')
    if model is None or scaler is None:
        return

    scenarios = [
        {
            'name': 'Healthy active 68yo female',
            'expected': 'Low',
            # age gender bmi  diab hyp  hrt  copd arth ncond  hr   sbp  dbp  glu  spo2 temp
            # hr_v bp_v glu_v anom_30 nmed adh_30 miss_7 cal  prot carbs fats meals cons miss_apt er_180 cog days
            'values': [68, 0, 24.5,
                       0, 0, 0, 0, 0, 0,
                       72, 125, 78, 95, 97, 36.6,
                       5, 8, 10,
                       0,
                       1, 0.98, 0,
                       1800, 60, 220, 55, 3,
                       2, 0, 0,
                       88, 14],
        },
        {
            'name': 'Diabetic 75yo male, moderate risk',
            'expected': 'Medium',
            'values': [75, 1, 28.5,
                       1, 1, 0, 0, 0, 2,
                       80, 142, 88, 145, 95, 36.7,
                       10, 15, 25,
                       3,
                       4, 0.82, 3,
                       1700, 50, 200, 50, 3,
                       3, 1, 0,
                       78, 35],
        },
        {
            'name': 'Multi-morbid 88yo, poor adherence',
            'expected': 'High',
            'values': [88, 1, 22.0,
                       1, 1, 1, 1, 1, 5,
                       90, 165, 95, 180, 91, 37.2,
                       18, 22, 40,
                       12,
                       8, 0.45, 10,
                       1400, 35, 180, 45, 2,
                       5, 3, 3,
                       55, 90],
        },
        {
            'name': 'Very old 92yo, stable but fragile',
            'expected': 'Medium/High',
            'values': [92, 0, 21.0,
                       0, 1, 1, 0, 1, 3,
                       68, 150, 85, 110, 94, 36.4,
                       12, 18, 15,
                       5,
                       5, 0.70, 5,
                       1500, 45, 190, 50, 2,
                       4, 2, 2,
                       65, 60],
        },
        {
            'name': 'Fit 70yo jogger, no conditions',
            'expected': 'Low',
            'values': [70, 1, 23.0,
                       0, 0, 0, 0, 0, 0,
                       65, 120, 75, 90, 98, 36.5,
                       4, 6, 8,
                       0,
                       0, 1.0, 0,
                       2000, 70, 250, 60, 3,
                       1, 0, 0,
                       92, 7],
        },
        {
            'name': 'COPD + heart disease 82yo, ER visits',
            'expected': 'High',
            'values': [82, 0, 26.0,
                       0, 1, 1, 1, 0, 3,
                       85, 155, 92, 120, 90, 37.0,
                       15, 20, 18,
                       8,
                       6, 0.55, 8,
                       1500, 40, 190, 48, 2,
                       6, 2, 4,
                       60, 75],
        },
    ]

    print(f"\n  {'Scenario':<45s} {'Expected':<15s} {'Predicted':<10s} {'Probabilities':<30s} {'Result'}")
    print("  " + "-" * 110)

    correct = 0
    for s in scenarios:
        X = np.array([s['values']], dtype=float)
        X_scaled = scaler.transform(X)
        pred = int(model.predict(X_scaled)[0])
        proba = model.predict_proba(X_scaled)[0]
        pred_label = RISK_LABELS[pred]

        prob_str = f"L={proba[0]:.3f} M={proba[1]:.3f} H={proba[2]:.3f}"
        match = pred_label in s['expected']
        correct += int(match)
        flag = "PASS" if match else "FAIL"

        print(f"  {s['name']:<45s} {s['expected']:<15s} {pred_label:<10s} {prob_str:<30s} {flag}")

    print(f"\n  Result: {correct}/{len(scenarios)} correct ({correct/len(scenarios)*100:.0f}%)")


# ─────────────────────────────────────────────────────────────
# MODEL 3: NUTRITIONAL RECOMMENDATION
# ─────────────────────────────────────────────────────────────

NUTRITION_FEATURES = ['calories', 'protein_g', 'carbs_g', 'fats_g', 'fiber_g', 'sodium_mg', 'sugar_g']
HEALTH_TAG_FEATURES = [
    'is_diabetic_friendly', 'is_heart_healthy', 'is_low_sodium',
    'is_low_carb', 'is_high_protein', 'is_low_fat', 'is_soft_food',
    'is_vegetarian', 'is_gluten_free'
]

def test_nutrition_recommendation():
    separator("MODEL 3: NUTRITIONAL RECOMMENDATION")

    artifacts = load_model('nutrition_recommender.pkl')
    if artifacts is None:
        return

    scaler = artifacts['nutrition_scaler']
    meal_features = artifacts['meal_features']
    meals_df = artifacts['meals_data']
    predicted_ratings = artifacts['collab_predicted_ratings']
    user_means = artifacts['collab_user_means']

    from sklearn.metrics.pairwise import cosine_similarity

    def build_user_vector(profile):
        ideal_nutrition = np.array([
            profile.get('calorie_target', 1800) / 3,
            profile.get('protein_target', 55) / 3,
            profile.get('carbs_target', 220) / 3,
            profile.get('fats_target', 60) / 3,
            5.0, 350, 8.0,
        ]).reshape(1, -1)
        nutrition_scaled = scaler.transform(ideal_nutrition).flatten()
        health_tags = np.array([
            1 if profile.get('has_diabetes', 0) else 0.5,
            1 if profile.get('has_heart_disease', 0) else 0.5,
            1 if profile.get('needs_low_sodium', 0) else 0.3,
            1 if profile.get('needs_low_carb', 0) else 0.3,
            0.7,
            0.5 if profile.get('has_heart_disease', 0) else 0.3,
            1 if profile.get('needs_soft_food', 0) else 0.3,
            1 if profile.get('is_vegetarian', 0) else 0.0,
            1 if profile.get('is_gluten_free', 0) else 0.0,
        ])
        return np.hstack([nutrition_scaled * 0.4, health_tags * 0.6])

    def recommend(user_id, profile, n=5):
        user_vec = build_user_vector(profile)
        content_sims = cosine_similarity([user_vec], meal_features)[0]

        # Apply hard constraints
        mask = np.ones(len(meals_df), dtype=bool)
        if profile.get('is_vegetarian', 0):
            mask &= meals_df['is_vegetarian'].values == 1
        if profile.get('is_gluten_free', 0):
            mask &= meals_df['is_gluten_free'].values == 1
        if profile.get('needs_soft_food', 0):
            mask &= meals_df['is_soft_food'].values == 1
        content_sims[~mask] = -1

        top50 = np.argsort(content_sims)[::-1][:50]

        # Hybrid: 60% content + 40% collaborative
        results = []
        for idx in top50:
            mid = int(meals_df.iloc[idx]['meal_id'])
            c_score = content_sims[idx]
            if user_id < predicted_ratings.shape[0] and mid < predicted_ratings.shape[1]:
                r_score = predicted_ratings[user_id, mid]
            else:
                r_score = 3.0
            results.append((idx, mid, c_score, r_score))

        # Normalize
        c_vals = np.array([r[2] for r in results])
        r_vals = np.array([r[3] for r in results])
        c_min, c_max = c_vals.min(), c_vals.max()
        r_min, r_max = r_vals.min(), r_vals.max()

        scored = []
        for idx, mid, cs, rs in results:
            cn = (cs - c_min) / (c_max - c_min) if c_max > c_min else 0.5
            rn = (rs - r_min) / (r_max - r_min) if r_max > r_min else 0.5
            hybrid = 0.6 * cn + 0.4 * rn
            scored.append((idx, mid, hybrid))

        scored.sort(key=lambda x: x[2], reverse=True)
        return scored[:n]

    # Test scenarios
    profiles = [
        {
            'name': 'Diabetic 72yo, needs low-carb meals',
            'user_id': 5,
            'profile': {
                'has_diabetes': 1, 'has_heart_disease': 0,
                'needs_low_sodium': 0, 'needs_low_carb': 1,
                'needs_soft_food': 0, 'is_vegetarian': 0, 'is_gluten_free': 0,
                'calorie_target': 1600, 'protein_target': 55,
                'carbs_target': 150, 'fats_target': 55,
            },
            'check_tag': 'is_diabetic_friendly',
        },
        {
            'name': 'Heart disease + hypertension 80yo, low sodium',
            'user_id': 10,
            'profile': {
                'has_diabetes': 0, 'has_heart_disease': 1,
                'needs_low_sodium': 1, 'needs_low_carb': 0,
                'needs_soft_food': 0, 'is_vegetarian': 0, 'is_gluten_free': 0,
                'calorie_target': 1700, 'protein_target': 50,
                'carbs_target': 200, 'fats_target': 50,
            },
            'check_tag': 'is_heart_healthy',
        },
        {
            'name': 'Vegetarian 85yo, needs soft food',
            'user_id': 20,
            'profile': {
                'has_diabetes': 0, 'has_heart_disease': 0,
                'needs_low_sodium': 0, 'needs_low_carb': 0,
                'needs_soft_food': 1, 'is_vegetarian': 1, 'is_gluten_free': 0,
                'calorie_target': 1500, 'protein_target': 45,
                'carbs_target': 180, 'fats_target': 50,
            },
            'check_tag': 'is_vegetarian',
        },
    ]

    for p in profiles:
        print(f"\n  Patient: {p['name']}")
        print(f"  {'Rank':<6s} {'Meal Name':<40s} {'Cal':>5s} {'Protein':>8s} {'Carbs':>7s} {'Tag':>5s} {'Score':>7s}")
        print("  " + "-" * 80)

        recs = recommend(p['user_id'], p['profile'], n=5)
        suited = 0
        for rank, (idx, mid, score) in enumerate(recs, 1):
            meal = meals_df.iloc[idx]
            tag_ok = int(meal[p['check_tag']]) if p['check_tag'] in meal else 0
            suited += tag_ok
            flag = "Y" if tag_ok else "N"
            print(f"  {rank:<6d} {meal['name']:<40s} {meal['calories']:>5.0f} {meal['protein_g']:>7.1f}g {meal['carbs_g']:>6.1f}g {flag:>5s} {score:>7.3f}")

        print(f"  Constraint satisfaction: {suited}/5 ({suited/5*100:.0f}%)")


# ─────────────────────────────────────────────────────────────
# MODEL 4: COGNITIVE DECLINE DETECTION
# ─────────────────────────────────────────────────────────────

COGNITIVE_FEATURES = [
    'age', 'gender', 'education_years', 'session_number',
    'memory_game_score', 'pattern_puzzle_score',
    'reaction_test_avg_ms', 'word_recall_correct',
    'memory_avg_7', 'pattern_avg_7', 'reaction_avg_7', 'word_recall_avg_7',
    'memory_trend_10', 'pattern_trend_10', 'reaction_trend_10', 'word_recall_trend_10',
    'memory_std_14', 'reaction_std_14',
    'composite_cognitive', 'reaction_ratio'
]
COGNITIVE_LABELS = ['Stable', 'Mild Decline', 'Significant Decline']

def test_cognitive_decline():
    separator("MODEL 4: COGNITIVE DECLINE DETECTION")

    model = load_model('cognitive_model.pkl')
    scaler = load_model('cognitive_scaler.pkl')
    if model is None or scaler is None:
        return

    scenarios = [
        {
            'name': 'Cognitively sharp 70yo, high scores',
            'expected': 'Stable',
            #          age gen edu sess mem  pat  react word m_a7  p_a7  r_a7  w_a7
            #          m_t10 p_t10 r_t10 w_t10  m_s14 r_s14  comp  r_ratio
            'values': [70, 1, 16, 25,
                       88, 85, 340, 9,
                       87, 84, 345, 8.8,
                       0.3, 0.2, -2.0, 0.1,
                       3.0, 15.0,
                       85.0, 1.01],
        },
        {
            'name': 'Stable 75yo female, consistent performance',
            'expected': 'Stable',
            'values': [75, 0, 14, 40,
                       82, 80, 380, 8,
                       81, 79, 385, 7.9,
                       0.1, 0.0, 1.0, 0.0,
                       2.5, 12.0,
                       80.0, 0.99],
        },
        {
            'name': 'Mild decline 78yo, scores dipping',
            'expected': 'Mild Decline',
            'values': [78, 1, 12, 35,
                       68, 65, 450, 6,
                       72, 68, 430, 6.5,
                       -1.5, -1.2, 8.0, -0.8,
                       6.0, 25.0,
                       65.0, 1.10],
        },
        {
            'name': 'Significant decline 85yo, major drops',
            'expected': 'Significant Decline',
            'values': [85, 0, 10, 55,
                       45, 40, 650, 3,
                       50, 45, 620, 3.5,
                       -4.0, -3.5, 20.0, -2.5,
                       12.0, 50.0,
                       40.0, 1.35],
        },
        {
            'name': 'Early subtle decline 72yo, educated',
            'expected': 'Stable/Mild',
            'values': [72, 1, 18, 15,
                       78, 75, 400, 7,
                       80, 77, 390, 7.2,
                       -0.5, -0.3, 3.0, -0.2,
                       4.0, 18.0,
                       76.0, 1.04],
        },
        {
            'name': 'Advanced decline 90yo, very low scores',
            'expected': 'Significant Decline',
            'values': [90, 0, 8, 60,
                       30, 25, 850, 2,
                       35, 30, 800, 2.2,
                       -6.0, -5.0, 35.0, -3.0,
                       15.0, 60.0,
                       28.0, 1.55],
        },
    ]

    print(f"\n  {'Scenario':<50s} {'Expected':<20s} {'Predicted':<20s} {'Probabilities':<35s} {'Result'}")
    print("  " + "-" * 130)

    correct = 0
    for s in scenarios:
        X = np.array([s['values']], dtype=float)
        X_scaled = scaler.transform(X)
        pred = int(model.predict(X_scaled)[0])
        proba = model.predict_proba(X_scaled)[0]
        pred_label = COGNITIVE_LABELS[pred]

        prob_str = f"Stb={proba[0]:.3f} Mld={proba[1]:.3f} Sig={proba[2]:.3f}"
        match = pred_label in s['expected'] or ('/' in s['expected'] and pred_label in s['expected'].replace('/', ' '))
        correct += int(match)
        flag = "PASS" if match else "FAIL"

        print(f"  {s['name']:<50s} {s['expected']:<20s} {pred_label:<20s} {prob_str:<35s} {flag}")

    print(f"\n  Result: {correct}/{len(scenarios)} correct ({correct/len(scenarios)*100:.0f}%)")


# ─────────────────────────────────────────────────────────────
# TEST WITH REAL DATA (random samples from datasets)
# ─────────────────────────────────────────────────────────────

def test_on_real_data():
    separator("REAL DATA VALIDATION (random samples from datasets)")

    # --- Anomaly Detection on real vitals ---
    print("\n  [Anomaly Detection] Testing on 20 random samples from vitals_dataset.csv...")
    model = load_model('anomaly_detector.pkl')
    scaler = load_model('anomaly_scaler.pkl')
    df = pd.read_csv(os.path.join(DATA_DIR, 'vitals_dataset.csv'))

    sample = df.sample(20, random_state=42)
    X = sample[ANOMALY_FEATURES].values
    y_true = sample['is_anomaly'].values
    X_scaled = scaler.transform(X)
    raw_preds = model.predict(X_scaled)
    y_pred = (raw_preds == -1).astype(int)

    correct = (y_pred == y_true).sum()
    print(f"  Accuracy: {correct}/20 ({correct/20*100:.0f}%)")
    print(f"  True labels:  {y_true.tolist()}")
    print(f"  Predictions:  {y_pred.tolist()}")

    # --- Health Risk on real data ---
    print("\n  [Health Risk] Testing on 20 random samples from health_risk_dataset.csv...")
    model = load_model('health_risk_model.pkl')
    scaler = load_model('health_risk_scaler.pkl')
    df = pd.read_csv(os.path.join(DATA_DIR, 'health_risk_dataset.csv'))

    sample = df.sample(20, random_state=42)
    X = sample[HEALTH_RISK_FEATURES].values
    y_true = sample['risk_level'].values
    X_scaled = scaler.transform(X)
    y_pred = model.predict(X_scaled).astype(int)

    correct = (y_pred == y_true).sum()
    print(f"  Accuracy: {correct}/20 ({correct/20*100:.0f}%)")
    for i in range(20):
        t = RISK_LABELS[int(y_true[i])]
        p = RISK_LABELS[int(y_pred[i])]
        flag = "OK" if y_true[i] == y_pred[i] else "MISS"
        print(f"    Sample {i+1:>2d}: True={t:<8s} Pred={p:<8s} {flag}")

    # --- Cognitive on real data ---
    print("\n  [Cognitive Decline] Testing on 20 random samples from cognitive_dataset.csv...")
    model = load_model('cognitive_model.pkl')
    scaler = load_model('cognitive_scaler.pkl')
    df = pd.read_csv(os.path.join(DATA_DIR, 'cognitive_dataset.csv'))

    sample = df.sample(20, random_state=42)
    X = sample[COGNITIVE_FEATURES].values
    y_true = sample['cognitive_status'].values
    X_scaled = scaler.transform(X)
    y_pred = model.predict(X_scaled).astype(int)

    correct = (y_pred == y_true).sum()
    print(f"  Accuracy: {correct}/20 ({correct/20*100:.0f}%)")
    for i in range(20):
        t = COGNITIVE_LABELS[int(y_true[i])]
        p = COGNITIVE_LABELS[int(y_pred[i])]
        flag = "OK" if y_true[i] == y_pred[i] else "MISS"
        print(f"    Sample {i+1:>2d}: True={t:<25s} Pred={p:<25s} {flag}")


# ─────────────────────────────────────────────────────────────
# SUMMARY
# ─────────────────────────────────────────────────────────────

def print_summary():
    separator("EVALUATION REPORTS SUMMARY")

    for name in ['anomaly_eval_report.json', 'health_risk_eval_report.json',
                 'nutrition_eval_report.json', 'cognitive_eval_report.json']:
        path = os.path.join(BASE_DIR, 'evaluation', name)
        if os.path.exists(path):
            with open(path) as f:
                report = json.load(f)
            print(f"\n  {name}:")
            for key, val in report.items():
                if isinstance(val, dict):
                    print(f"    {key}:")
                    for k2, v2 in val.items():
                        print(f"      {k2}: {v2}")
                else:
                    print(f"    {key}: {val}")


# ─────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────

if __name__ == '__main__':
    print("\n" + "#" * 70)
    print("#" + " " * 18 + "AegisCare ML — Full Model Test" + " " * 19 + "#")
    print("#" * 70)

    test_anomaly_detection()
    test_health_risk()
    test_nutrition_recommendation()
    test_cognitive_decline()
    test_on_real_data()
    print_summary()

    print("\n" + "=" * 70)
    print("  ALL TESTS COMPLETE")
    print("=" * 70 + "\n")

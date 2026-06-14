"""
AegisCare ML Models - Real-Time Data Simulation & Validation Test
=================================================================
Simulates realistic patient data (as if from a smartwatch/sensors) and tests
all 4 ML models to prove they work correctly on real-world data without
runtime errors.

Usage:
  python test_realtime_simulation.py              Run ALL tests
  python test_realtime_simulation.py anomaly      Run only Anomaly Detection
  python test_realtime_simulation.py risk          Run only Health Risk
  python test_realtime_simulation.py nutrition     Run only Nutrition
  python test_realtime_simulation.py cognitive     Run only Cognitive Decline
  python test_realtime_simulation.py anomaly risk  Run Anomaly + Risk together

Output is shown directly in the terminal where you run the command.
"""

import requests
import json
import sys
import argparse
from datetime import datetime

BASE_URL = "http://localhost:5001/ml"

PASS = 0
FAIL = 0

def test(name, endpoint, payload, validators):
    """Send request and validate response."""
    global PASS, FAIL
    url = f"{BASE_URL}/{endpoint}"
    print(f"\n{'='*70}")
    print(f"  TEST: {name}")
    print(f"  POST {url}")
    print(f"  Input: {json.dumps(payload, indent=2)}")

    try:
        r = requests.post(url, json=payload, timeout=10)
        data = r.json()
        print(f"  Status: {r.status_code}")
        print(f"  Output: {json.dumps(data, indent=2)}")

        if r.status_code != 200:
            print(f"  [FAIL] HTTP {r.status_code}")
            FAIL += 1
            return

        all_ok = True
        for desc, check_fn in validators:
            result = check_fn(data)
            symbol = "[PASS]" if result else "[FAIL]"
            print(f"  {symbol} {desc}")
            if not result:
                all_ok = False

        if all_ok:
            PASS += 1
        else:
            FAIL += 1

    except Exception as e:
        print(f"  [FAIL] Exception: {e}")
        FAIL += 1


# ======================================================================
# MODEL 1: ANOMALY DETECTION TESTS
# ======================================================================

def run_anomaly_tests():
    print("\n\n" + "#" * 70)
    print("  MODEL 1: VITAL SIGNS ANOMALY DETECTION (IsolationForest)")
    print("#" * 70)

    test(
        "Healthy 65-year-old - Normal vitals",
        "anomaly-detection",
        {
            "heart_rate": 72, "systolic_bp": 118, "diastolic_bp": 76,
            "glucose": 95, "spo2": 98, "temperature": 36.6, "age": 65
        },
        [
            ("No anomaly detected", lambda d: d['is_anomaly'] == False),
            ("Severity is normal", lambda d: d['severity'] == 'normal'),
            ("No alerts fired", lambda d: len(d['alerts']) == 0),
        ]
    )

    test(
        "70-year-old - Slightly elevated BP (borderline)",
        "anomaly-detection",
        {
            "heart_rate": 82, "systolic_bp": 142, "diastolic_bp": 88,
            "glucose": 125, "spo2": 96, "temperature": 36.8, "age": 70
        },
        [
            ("Response has is_anomaly field", lambda d: 'is_anomaly' in d),
            ("Severity field exists", lambda d: 'severity' in d),
            ("No runtime error", lambda d: 'error' not in d),
        ]
    )

    test(
        "78-year-old - Tachycardia + High BP",
        "anomaly-detection",
        {
            "heart_rate": 115, "systolic_bp": 175, "diastolic_bp": 105,
            "glucose": 160, "spo2": 94, "temperature": 37.2, "age": 78
        },
        [
            ("Anomaly detected", lambda d: d['is_anomaly'] == True),
            ("Heart rate alert present", lambda d: any(a['vital'] == 'heart_rate' for a in d['alerts'])),
            ("BP alert present", lambda d: any(a['vital'] == 'systolic_bp' for a in d['alerts'])),
        ]
    )

    test(
        "80-year-old - Hypoglycemia (glucose=45)",
        "anomaly-detection",
        {
            "heart_rate": 105, "systolic_bp": 100, "diastolic_bp": 65,
            "glucose": 45, "spo2": 95, "temperature": 36.3, "age": 80
        },
        [
            ("Anomaly detected", lambda d: d['is_anomaly'] == True),
            ("Glucose alert present", lambda d: any(a['vital'] == 'glucose' for a in d['alerts'])),
            ("Alert mentions critically low", lambda d: any('critically low' in a['message'] for a in d['alerts'])),
        ]
    )

    test(
        "75-year-old - Low SpO2 (88%) + Fever (39.2C)",
        "anomaly-detection",
        {
            "heart_rate": 98, "systolic_bp": 135, "diastolic_bp": 85,
            "glucose": 130, "spo2": 88, "temperature": 39.2, "age": 75
        },
        [
            ("Anomaly detected", lambda d: d['is_anomaly'] == True),
            ("SpO2 alert present", lambda d: any(a['vital'] == 'spo2' for a in d['alerts'])),
            ("Temperature alert present", lambda d: any(a['vital'] == 'temperature' for a in d['alerts'])),
        ]
    )

    test(
        "82-year-old - CRITICAL: Multi-organ emergency",
        "anomaly-detection",
        {
            "heart_rate": 150, "systolic_bp": 210, "diastolic_bp": 130,
            "glucose": 350, "spo2": 82, "temperature": 40.1, "age": 82
        },
        [
            ("Anomaly detected", lambda d: d['is_anomaly'] == True),
            ("Severity is critical or high", lambda d: d['severity'] in ['critical', 'high']),
            ("Multiple alerts (>=3)", lambda d: len(d['alerts']) >= 3),
        ]
    )


# ======================================================================
# MODEL 2: HEALTH RISK TESTS
# ======================================================================

def run_risk_tests():
    print("\n\n" + "#" * 70)
    print("  MODEL 2: HEALTH RISK PREDICTION (HistGradientBoosting)")
    print("#" * 70)

    test(
        "Healthy 65-year-old - No conditions, good adherence",
        "health-risk",
        {
            "age": 65, "gender": 1, "bmi": 23.5,
            "has_diabetes": 0, "has_hypertension": 0, "has_heart_disease": 0,
            "has_copd": 0, "has_arthritis": 0, "num_conditions": 0,
            "avg_hr_7d": 70, "avg_sbp_7d": 118, "avg_dbp_7d": 75,
            "avg_glucose_7d": 92, "avg_spo2_7d": 98, "avg_temp_7d": 36.6,
            "hr_variability": 5, "bp_variability": 8, "glucose_variability": 10,
            "anomaly_count_30d": 0,
            "num_medications": 1, "adherence_rate_30d": 0.95, "missed_doses_7d": 0,
            "avg_calories": 1800, "avg_protein": 60, "avg_carbs": 200,
            "avg_fats": 55, "meals_per_day": 3,
            "consultations_90d": 1, "missed_appointments_90d": 0, "er_visits_180d": 0,
            "cognitive_score": 90, "days_since_checkup": 20
        },
        [
            ("Risk level is Low", lambda d: d['risk_level'] == 'Low'),
            ("Low probability > 0.5", lambda d: d['probabilities']['low'] > 0.5),
            ("No risk factors", lambda d: len(d['risk_factors']) == 0),
        ]
    )

    test(
        "72-year-old - Diabetic + Hypertensive, moderate control",
        "health-risk",
        {
            "age": 72, "gender": 0, "bmi": 28.3,
            "has_diabetes": 1, "has_hypertension": 1, "has_heart_disease": 0,
            "has_copd": 0, "has_arthritis": 1, "num_conditions": 3,
            "avg_hr_7d": 78, "avg_sbp_7d": 145, "avg_dbp_7d": 90,
            "avg_glucose_7d": 155, "avg_spo2_7d": 96, "avg_temp_7d": 36.7,
            "hr_variability": 10, "bp_variability": 15, "glucose_variability": 25,
            "anomaly_count_30d": 3,
            "num_medications": 4, "adherence_rate_30d": 0.82, "missed_doses_7d": 2,
            "avg_calories": 2100, "avg_protein": 50, "avg_carbs": 260,
            "avg_fats": 70, "meals_per_day": 3,
            "consultations_90d": 2, "missed_appointments_90d": 1, "er_visits_180d": 0,
            "cognitive_score": 75, "days_since_checkup": 45
        },
        [
            ("Risk level exists", lambda d: d['risk_level'] in ['Low', 'Medium', 'High']),
            ("Probabilities sum ~ 1.0", lambda d: abs(sum(d['probabilities'].values()) - 1.0) < 0.01),
            ("Risk factors flagged (multiple conditions)", lambda d: 'Multiple chronic conditions' in d['risk_factors']),
        ]
    )

    test(
        "80-year-old - High risk: Non-compliant, ER visits, anomalies",
        "health-risk",
        {
            "age": 80, "gender": 1, "bmi": 32.1,
            "has_diabetes": 1, "has_hypertension": 1, "has_heart_disease": 1,
            "has_copd": 1, "has_arthritis": 1, "num_conditions": 5,
            "avg_hr_7d": 92, "avg_sbp_7d": 165, "avg_dbp_7d": 100,
            "avg_glucose_7d": 220, "avg_spo2_7d": 93, "avg_temp_7d": 37.1,
            "hr_variability": 18, "bp_variability": 25, "glucose_variability": 40,
            "anomaly_count_30d": 12,
            "num_medications": 8, "adherence_rate_30d": 0.55, "missed_doses_7d": 6,
            "avg_calories": 2500, "avg_protein": 40, "avg_carbs": 320,
            "avg_fats": 90, "meals_per_day": 2,
            "consultations_90d": 0, "missed_appointments_90d": 3, "er_visits_180d": 3,
            "cognitive_score": 55, "days_since_checkup": 120
        },
        [
            ("Risk level is Medium or High", lambda d: d['risk_level'] in ['Medium', 'High']),
            ("High probability > 0.3", lambda d: d['probabilities']['high'] > 0.3),
            ("Multiple risk factors detected", lambda d: len(d['risk_factors']) >= 3),
        ]
    )

    test(
        "60-year-old - Edge case: youngest elderly, perfect stats",
        "health-risk",
        {
            "age": 60, "gender": 0, "bmi": 22.0,
            "has_diabetes": 0, "has_hypertension": 0, "has_heart_disease": 0,
            "has_copd": 0, "has_arthritis": 0, "num_conditions": 0,
            "avg_hr_7d": 65, "avg_sbp_7d": 112, "avg_dbp_7d": 72,
            "avg_glucose_7d": 88, "avg_spo2_7d": 99, "avg_temp_7d": 36.5,
            "hr_variability": 4, "bp_variability": 6, "glucose_variability": 8,
            "anomaly_count_30d": 0,
            "num_medications": 0, "adherence_rate_30d": 1.0, "missed_doses_7d": 0,
            "avg_calories": 1900, "avg_protein": 65, "avg_carbs": 200,
            "avg_fats": 50, "meals_per_day": 3,
            "consultations_90d": 1, "missed_appointments_90d": 0, "er_visits_180d": 0,
            "cognitive_score": 95, "days_since_checkup": 10
        },
        [
            ("Risk level is Low", lambda d: d['risk_level'] == 'Low'),
            ("No risk factors", lambda d: len(d['risk_factors']) == 0),
            ("No runtime error", lambda d: 'error' not in d),
        ]
    )

    test(
        "95-year-old - Edge case: very old, minimal input (uses defaults)",
        "health-risk",
        {
            "age": 95, "gender": 1, "bmi": 20.0,
            "num_conditions": 2, "has_diabetes": 1, "has_arthritis": 1,
            "avg_spo2_7d": 92, "er_visits_180d": 1
        },
        [
            ("Response has risk_level", lambda d: 'risk_level' in d),
            ("Probabilities present", lambda d: 'probabilities' in d),
            ("No runtime error (defaults worked)", lambda d: 'error' not in d),
        ]
    )


# ======================================================================
# MODEL 3: NUTRITION TESTS
# ======================================================================

def run_nutrition_tests():
    print("\n\n" + "#" * 70)
    print("  MODEL 3: NUTRITIONAL RECOMMENDATION (Hybrid Content+Collaborative)")
    print("#" * 70)

    test(
        "Diabetic patient - Low-carb breakfast",
        "nutrition-recommend",
        {
            "user_id": 42,
            "has_diabetes": 1, "has_heart_disease": 0,
            "needs_low_sodium": 0, "needs_low_carb": 1,
            "needs_soft_food": 0, "is_vegetarian": 0, "is_gluten_free": 0,
            "calorie_target": 1600, "protein_target": 55,
            "carbs_target": 130, "fats_target": 50,
            "meal_type": "breakfast", "count": 5
        },
        [
            ("Returns recommendations array", lambda d: 'recommendations' in d and len(d['recommendations']) > 0),
            ("Got 5 recommendations", lambda d: len(d['recommendations']) == 5),
            ("All are breakfast type", lambda d: all(m['meal_type'] == 'breakfast' for m in d['recommendations'])),
            ("Each has nutrition info", lambda d: all('calories' in m and 'protein_g' in m for m in d['recommendations'])),
            ("Diabetic-friendly meals prioritized", lambda d: any(m['tags']['diabetic_friendly'] for m in d['recommendations'])),
        ]
    )

    test(
        "Heart disease patient - Low-sodium lunch",
        "nutrition-recommend",
        {
            "user_id": 100,
            "has_diabetes": 0, "has_heart_disease": 1,
            "needs_low_sodium": 1, "needs_low_carb": 0,
            "needs_soft_food": 0, "is_vegetarian": 0, "is_gluten_free": 0,
            "calorie_target": 1800, "protein_target": 60,
            "carbs_target": 200, "fats_target": 55,
            "meal_type": "lunch", "count": 5
        },
        [
            ("Returns recommendations", lambda d: len(d.get('recommendations', [])) > 0),
            ("All are lunch type", lambda d: all(m['meal_type'] == 'lunch' for m in d['recommendations'])),
            ("Has score field", lambda d: all('score' in m for m in d['recommendations'])),
            ("No runtime error", lambda d: 'error' not in d),
        ]
    )

    test(
        "Vegetarian elderly - Dinner options",
        "nutrition-recommend",
        {
            "user_id": 200,
            "has_diabetes": 0, "has_heart_disease": 0,
            "needs_low_sodium": 0, "needs_low_carb": 0,
            "needs_soft_food": 0, "is_vegetarian": 1, "is_gluten_free": 0,
            "calorie_target": 1700, "protein_target": 50,
            "carbs_target": 220, "fats_target": 55,
            "meal_type": "dinner", "count": 5
        },
        [
            ("Returns recommendations", lambda d: len(d.get('recommendations', [])) > 0),
            ("All marked vegetarian", lambda d: all(m['tags']['vegetarian'] for m in d['recommendations'])),
            ("All are dinner type", lambda d: all(m['meal_type'] == 'dinner' for m in d['recommendations'])),
        ]
    )

    test(
        "Complex dietary needs - Diabetic, soft food, gluten-free snack",
        "nutrition-recommend",
        {
            "user_id": 350,
            "has_diabetes": 1, "has_heart_disease": 0,
            "needs_low_sodium": 1, "needs_low_carb": 1,
            "needs_soft_food": 1, "is_vegetarian": 0, "is_gluten_free": 1,
            "calorie_target": 1400, "protein_target": 45,
            "carbs_target": 120, "fats_target": 45,
            "meal_type": "snack", "count": 3
        },
        [
            ("Returns without error", lambda d: 'error' not in d),
            ("Returns list (may be empty if constraints too strict)", lambda d: 'recommendations' in d),
            ("No runtime error on strict filters", lambda d: isinstance(d.get('recommendations'), list)),
        ]
    )


# ======================================================================
# MODEL 4: COGNITIVE DECLINE TESTS
# ======================================================================

def run_cognitive_tests():
    print("\n\n" + "#" * 70)
    print("  MODEL 4: COGNITIVE DECLINE DETECTION (HistGradientBoosting)")
    print("#" * 70)

    test(
        "Sharp 68-year-old - High game scores, fast reactions",
        "cognitive-assessment",
        {
            "age": 68, "gender": 0, "education_years": 16, "session_number": 25,
            "memory_game_score": 92, "pattern_puzzle_score": 88,
            "reaction_test_avg_ms": 320, "word_recall_correct": 9,
            "memory_avg_7": 90, "pattern_avg_7": 86, "reaction_avg_7": 330, "word_recall_avg_7": 9,
            "memory_trend_10": 2.0, "pattern_trend_10": 1.5, "reaction_trend_10": -5, "word_recall_trend_10": 0.5,
            "memory_std_14": 3, "reaction_std_14": 15,
            "composite_cognitive": 88, "reaction_ratio": 0.97
        },
        [
            ("Status is Stable", lambda d: d['status'] == 'Stable'),
            ("Stable probability > 0.5", lambda d: d['probabilities']['stable'] > 0.5),
            ("Low concern score", lambda d: d['concern_score'] < 30),
            ("Positive recommendation", lambda d: 'good' in d['recommendation'].lower() or 'continue' in d['recommendation'].lower()),
        ]
    )

    test(
        "76-year-old - Declining scores, slower reactions",
        "cognitive-assessment",
        {
            "age": 76, "gender": 1, "education_years": 8, "session_number": 55,
            "memory_game_score": 45, "pattern_puzzle_score": 38,
            "reaction_test_avg_ms": 720, "word_recall_correct": 3,
            "memory_avg_7": 50, "pattern_avg_7": 42, "reaction_avg_7": 680, "word_recall_avg_7": 3.5,
            "memory_trend_10": -6.0, "pattern_trend_10": -5.5, "reaction_trend_10": 45, "word_recall_trend_10": -2.0,
            "memory_std_14": 11, "reaction_std_14": 45,
            "composite_cognitive": 42, "reaction_ratio": 1.10
        },
        [
            ("Status is not Stable (decline detected)", lambda d: d['status'] != 'Stable'),
            ("Concern score > 20", lambda d: d['concern_score'] > 20),
            ("Recommendation mentions monitor or evaluation", lambda d: 'monitor' in d['recommendation'].lower() or 'evaluation' in d['recommendation'].lower()),
        ]
    )

    test(
        "84-year-old - Significant decline: very low scores, slow reactions",
        "cognitive-assessment",
        {
            "age": 84, "gender": 0, "education_years": 8, "session_number": 60,
            "memory_game_score": 35, "pattern_puzzle_score": 28,
            "reaction_test_avg_ms": 850, "word_recall_correct": 2,
            "memory_avg_7": 40, "pattern_avg_7": 32, "reaction_avg_7": 800, "word_recall_avg_7": 2.5,
            "memory_trend_10": -8.0, "pattern_trend_10": -7.5, "reaction_trend_10": 60, "word_recall_trend_10": -2.5,
            "memory_std_14": 12, "reaction_std_14": 55,
            "composite_cognitive": 32, "reaction_ratio": 1.15
        },
        [
            ("Status is Significant Decline", lambda d: d['status'] == 'Significant Decline'),
            ("Significant decline probability > 0.4", lambda d: d['probabilities']['significant_decline'] > 0.4),
            ("High concern score (>50)", lambda d: d['concern_score'] > 50),
            ("Urgent recommendation", lambda d: 'immediate' in d['recommendation'].lower() or 'evaluation' in d['recommendation'].lower()),
        ]
    )

    test(
        "70-year-old - First game session (session_number=1)",
        "cognitive-assessment",
        {
            "age": 70, "gender": 1, "education_years": 12, "session_number": 1,
            "memory_game_score": 75, "pattern_puzzle_score": 70,
            "reaction_test_avg_ms": 420, "word_recall_correct": 7
        },
        [
            ("Response has status", lambda d: 'status' in d),
            ("Response has probabilities", lambda d: 'probabilities' in d),
            ("Defaults filled without error", lambda d: 'error' not in d),
            ("Recommendation provided", lambda d: len(d.get('recommendation', '')) > 10),
        ]
    )


# ======================================================================
# MAIN
# ======================================================================

def main():
    global PASS, FAIL

    parser = argparse.ArgumentParser(
        description="AegisCare ML Models - Real-Time Data Simulation Test",
        formatter_class=argparse.RawTextHelpFormatter,
        epilog="""
Examples:
  python test_realtime_simulation.py              Run ALL tests
  python test_realtime_simulation.py anomaly      Run only Anomaly Detection tests
  python test_realtime_simulation.py risk          Run only Health Risk tests
  python test_realtime_simulation.py nutrition     Run only Nutrition tests
  python test_realtime_simulation.py cognitive     Run only Cognitive Decline tests
  python test_realtime_simulation.py anomaly risk  Run Anomaly + Risk tests
"""
    )
    parser.add_argument(
        'models', nargs='*', default=['all'],
        choices=['all', 'anomaly', 'risk', 'nutrition', 'cognitive'],
        help="Which model(s) to test (default: all)"
    )
    args = parser.parse_args()

    run_all = 'all' in args.models

    selected = []
    if run_all or 'anomaly'   in args.models: selected.append("Anomaly Detection")
    if run_all or 'risk'      in args.models: selected.append("Health Risk")
    if run_all or 'nutrition' in args.models: selected.append("Nutrition")
    if run_all or 'cognitive' in args.models: selected.append("Cognitive Decline")

    print("=" * 70)
    print("  AegisCare ML Models - Real-Time Data Simulation Test")
    print(f"  Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"  Running: {', '.join(selected)}")
    print("=" * 70)

    # Check ML service health
    print("\n  Checking ML Service Health...")
    try:
        r = requests.get(f"{BASE_URL}/health", timeout=5)
        health = r.json()
        print(f"  Status: {health['status']}")
        for model, loaded in health['models_loaded'].items():
            tag = "[OK]" if loaded else "[MISSING]"
            print(f"    {tag} {model}: {'Loaded' if loaded else 'NOT LOADED'}")
        if not all(health['models_loaded'].values()):
            print("\n  [ERROR] Not all models loaded. Aborting.")
            sys.exit(1)
    except Exception as e:
        print(f"  [ERROR] ML Service not reachable: {e}")
        print("  Start it with: cd ml-service && python app.py")
        sys.exit(1)

    # Run selected tests
    if run_all or 'anomaly'   in args.models: run_anomaly_tests()
    if run_all or 'risk'      in args.models: run_risk_tests()
    if run_all or 'nutrition' in args.models: run_nutrition_tests()
    if run_all or 'cognitive' in args.models: run_cognitive_tests()

    # Summary
    total = PASS + FAIL
    print("\n\n" + "=" * 70)
    print(f"  RESULTS: {PASS}/{total} tests passed, {FAIL} failed")
    print("=" * 70)

    if FAIL == 0:
        print("\n  [PASS] ALL MODELS WORKING PERFECTLY - Ready for real-time data!")
        print("  [PASS] No runtime errors on any input scenario.")
        print("  [PASS] Models correctly distinguish normal vs abnormal patients.")
        print("  [PASS] Edge cases handled (minimal input, extreme values, first session).")
    else:
        print(f"\n  [WARNING] {FAIL} test(s) need investigation.")

    print()
    return 0 if FAIL == 0 else 1


if __name__ == '__main__':
    sys.exit(main())

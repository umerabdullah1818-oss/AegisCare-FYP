"""
AegisCare ML - Health Risk Prediction Dataset Generation
==========================================================
Generates 50,000 rows of elderly health risk data combining:
- Vital sign aggregates (7-day and 30-day windows)
- Medication adherence metrics
- Nutritional data
- Demographic & condition data
- Consultation/appointment frequency

Target: risk_level (0=Low, 1=Medium, 2=High)
"""

import numpy as np
import pandas as pd
import os

np.random.seed(42)

TOTAL_SAMPLES = 50000


def generate_demographics(n):
    ages = np.random.normal(77, 6, n).clip(65, 95).astype(int)
    gender = np.random.choice([0, 1], n, p=[0.45, 0.55])  # 0=male, 1=female
    bmi = np.random.normal(26.5, 4.5, n).clip(16, 45).round(1)
    return ages, gender, bmi


def generate_conditions(n, ages):
    """Generate chronic conditions correlated with age."""
    age_factor = (ages - 65) / 30  # 0 to 1

    has_diabetes = (np.random.random(n) < (0.25 + age_factor * 0.15)).astype(int)
    has_hypertension = (np.random.random(n) < (0.40 + age_factor * 0.20)).astype(int)
    has_heart_disease = (np.random.random(n) < (0.15 + age_factor * 0.15)).astype(int)
    has_copd = (np.random.random(n) < (0.08 + age_factor * 0.10)).astype(int)
    has_arthritis = (np.random.random(n) < (0.30 + age_factor * 0.10)).astype(int)

    num_conditions = has_diabetes + has_hypertension + has_heart_disease + has_copd + has_arthritis

    return has_diabetes, has_hypertension, has_heart_disease, has_copd, has_arthritis, num_conditions


def generate_vitals(n, ages, has_hypertension, has_diabetes, has_copd):
    """Generate 7-day and 30-day vital aggregates influenced by conditions."""
    age_factor = (ages - 75) / 10

    # Base vitals
    hr_7d = np.random.normal(75, 8, n)
    sbp_7d = np.random.normal(132, 12, n)
    dbp_7d = np.random.normal(78, 8, n)
    glucose_7d = np.random.normal(110, 18, n)
    spo2_7d = np.random.normal(96, 1.5, n)
    temp_7d = np.random.normal(36.6, 0.3, n)

    # Condition effects
    sbp_7d += has_hypertension * np.random.normal(15, 5, n)
    dbp_7d += has_hypertension * np.random.normal(8, 3, n)
    glucose_7d += has_diabetes * np.random.normal(40, 15, n)
    spo2_7d -= has_copd * np.random.normal(3, 1, n)
    hr_7d += has_copd * np.random.normal(8, 3, n)

    # Age adjustments
    sbp_7d += age_factor * 4
    spo2_7d -= age_factor * 0.5

    # Variability (higher = less stable = more risk)
    hr_variability = np.abs(np.random.normal(5, 3, n))
    bp_variability = np.abs(np.random.normal(8, 4, n))
    glucose_variability = np.abs(np.random.normal(12, 8, n))

    # Anomaly counts (from Model 1)
    anomaly_count_30d = np.random.poisson(0.5, n)

    return (hr_7d.clip(40, 150).round(1),
            sbp_7d.clip(70, 200).round(0).astype(int),
            dbp_7d.clip(40, 120).round(0).astype(int),
            glucose_7d.clip(40, 350).round(0).astype(int),
            spo2_7d.clip(80, 100).round(1),
            temp_7d.clip(34, 41).round(1),
            hr_variability.round(1),
            bp_variability.round(1),
            glucose_variability.round(1),
            anomaly_count_30d)


def generate_adherence(n, num_conditions):
    """Medication adherence: lower with more medications."""
    num_medications = (num_conditions * np.random.uniform(1, 2.5, n)).clip(0, 12).astype(int)

    # Base adherence rate (0-1)
    base_adherence = np.random.beta(8, 2, n)  # skewed toward high adherence
    # More medications → lower adherence
    medication_penalty = num_medications * 0.02
    adherence_rate_30d = (base_adherence - medication_penalty).clip(0.1, 1.0).round(3)

    missed_doses_7d = ((1 - adherence_rate_30d) * num_medications * 7 * np.random.uniform(0.5, 1.5, n)).clip(0, 30).astype(int)

    return num_medications, adherence_rate_30d, missed_doses_7d


def generate_nutrition(n, has_diabetes):
    """Daily nutritional averages."""
    avg_calories = np.random.normal(1800, 300, n)
    avg_protein = np.random.normal(55, 12, n)
    avg_carbs = np.random.normal(220, 40, n)
    avg_fats = np.random.normal(65, 15, n)

    # Diabetics may have different nutrition patterns
    avg_carbs -= has_diabetes * np.random.normal(30, 10, n)
    avg_calories -= has_diabetes * np.random.normal(100, 50, n)

    meals_per_day = np.random.choice([2, 3, 4], n, p=[0.15, 0.65, 0.20])

    return (avg_calories.clip(800, 3000).round(0).astype(int),
            avg_protein.clip(10, 120).round(1),
            avg_carbs.clip(50, 400).round(1),
            avg_fats.clip(15, 120).round(1),
            meals_per_day)


def generate_activity(n, ages):
    """Consultation and appointment activity."""
    consultations_90d = np.random.poisson(1.5, n)
    missed_appointments_90d = np.random.poisson(0.5, n)
    er_visits_180d = np.random.poisson(0.2, n)

    # Cognitive score (0-100)
    cognitive_score = np.random.normal(80, 12, n)
    cognitive_score -= (ages - 75) * 0.5
    cognitive_score = cognitive_score.clip(20, 100).round(1)

    # Days since last checkup
    days_since_checkup = np.random.exponential(30, n).clip(1, 180).astype(int)

    return consultations_90d, missed_appointments_90d, er_visits_180d, cognitive_score, days_since_checkup


def compute_risk_labels(df):
    """Compute risk levels using a clinical scoring system."""
    risk_score = np.zeros(len(df))

    # Vital signs risk factors
    risk_score += (df['avg_hr_7d'] > 100).astype(float) * 3
    risk_score += (df['avg_hr_7d'] < 55).astype(float) * 4
    risk_score += (df['avg_sbp_7d'] > 160).astype(float) * 4
    risk_score += (df['avg_sbp_7d'] < 90).astype(float) * 5
    risk_score += (df['avg_glucose_7d'] > 200).astype(float) * 4
    risk_score += (df['avg_glucose_7d'] < 60).astype(float) * 5
    risk_score += (df['avg_spo2_7d'] < 92).astype(float) * 5
    risk_score += (df['avg_spo2_7d'] < 88).astype(float) * 5  # additional for very low
    risk_score += (df['avg_temp_7d'] > 38.0).astype(float) * 3

    # Variability risk
    risk_score += (df['hr_variability'] > 12).astype(float) * 2
    risk_score += (df['bp_variability'] > 15).astype(float) * 2
    risk_score += (df['glucose_variability'] > 25).astype(float) * 2

    # Anomaly count
    risk_score += df['anomaly_count_30d'].clip(0, 5) * 2

    # Adherence risk
    risk_score += (df['adherence_rate_30d'] < 0.6).astype(float) * 4
    risk_score += (df['adherence_rate_30d'] < 0.4).astype(float) * 4  # additional
    risk_score += (df['missed_doses_7d'] > 5).astype(float) * 3

    # Condition burden
    risk_score += df['num_conditions'] * 1.5

    # Activity risk
    risk_score += (df['missed_appointments_90d'] > 2).astype(float) * 2
    risk_score += df['er_visits_180d'].clip(0, 3) * 3
    risk_score += (df['cognitive_score'] < 60).astype(float) * 3
    risk_score += (df['days_since_checkup'] > 90).astype(float) * 2

    # Age factor
    risk_score += (df['age'] > 85).astype(float) * 2

    # Nutrition risk
    risk_score += (df['avg_calories'] < 1200).astype(float) * 2
    risk_score += (df['avg_protein'] < 35).astype(float) * 2

    # Add noise to prevent deterministic boundaries
    risk_score += np.random.normal(0, 1.5, len(df))

    # Classify into Low / Medium / High
    risk_level = np.zeros(len(df), dtype=int)
    risk_level[risk_score >= 8] = 1   # Medium
    risk_level[risk_score >= 16] = 2  # High

    return risk_level, risk_score


def main():
    print("=" * 60)
    print("AegisCare - Health Risk Dataset Generation")
    print("=" * 60)

    n = TOTAL_SAMPLES

    # Generate all feature groups
    ages, gender, bmi = generate_demographics(n)
    has_diabetes, has_hypertension, has_heart_disease, has_copd, has_arthritis, num_conditions = generate_conditions(n, ages)
    (hr_7d, sbp_7d, dbp_7d, glucose_7d, spo2_7d, temp_7d,
     hr_var, bp_var, glucose_var, anomaly_count) = generate_vitals(n, ages, has_hypertension, has_diabetes, has_copd)
    num_meds, adherence, missed_doses = generate_adherence(n, num_conditions)
    calories, protein, carbs, fats, meals_per_day = generate_nutrition(n, has_diabetes)
    consults, missed_appts, er_visits, cog_score, days_checkup = generate_activity(n, ages)

    # Build dataframe
    df = pd.DataFrame({
        'age': ages,
        'gender': gender,
        'bmi': bmi,
        'has_diabetes': has_diabetes,
        'has_hypertension': has_hypertension,
        'has_heart_disease': has_heart_disease,
        'has_copd': has_copd,
        'has_arthritis': has_arthritis,
        'num_conditions': num_conditions,
        'avg_hr_7d': hr_7d,
        'avg_sbp_7d': sbp_7d,
        'avg_dbp_7d': dbp_7d,
        'avg_glucose_7d': glucose_7d,
        'avg_spo2_7d': spo2_7d,
        'avg_temp_7d': temp_7d,
        'hr_variability': hr_var,
        'bp_variability': bp_var,
        'glucose_variability': glucose_var,
        'anomaly_count_30d': anomaly_count,
        'num_medications': num_meds,
        'adherence_rate_30d': adherence,
        'missed_doses_7d': missed_doses,
        'avg_calories': calories,
        'avg_protein': protein,
        'avg_carbs': carbs,
        'avg_fats': fats,
        'meals_per_day': meals_per_day,
        'consultations_90d': consults,
        'missed_appointments_90d': missed_appts,
        'er_visits_180d': er_visits,
        'cognitive_score': cog_score,
        'days_since_checkup': days_checkup,
    })

    # Compute labels
    risk_level, risk_score = compute_risk_labels(df)
    df['risk_level'] = risk_level
    df['risk_score_raw'] = risk_score.round(2)

    # Shuffle
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)

    # Save
    output_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'health_risk_dataset.csv')
    df.to_csv(output_path, index=False)

    print(f"\n--- Dataset Summary ---")
    print(f"Total samples: {len(df)}")
    print(f"\nRisk Level Distribution:")
    for level, label in enumerate(['Low', 'Medium', 'High']):
        count = (df['risk_level'] == level).sum()
        print(f"  {label}: {count} ({count/len(df)*100:.1f}%)")
    print(f"\nFeatures: {len(df.columns) - 2} (excluding labels)")
    print(f"Saved to: {output_path}")

    print(f"\n--- Feature Statistics ---")
    print(df.describe().round(2).to_string())


if __name__ == '__main__':
    main()

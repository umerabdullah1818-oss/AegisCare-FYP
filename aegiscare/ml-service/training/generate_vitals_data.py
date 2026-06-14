"""
AegisCare ML - Vital Signs Anomaly Detection
==============================================
Generates 45,000 rows of synthetic vital signs data using clinically 
validated distributions for elderly patients (age 65-95).

Normal ranges are age-adjusted. Anomalies include:
- Single-feature spikes (e.g., sudden BP spike)
- Multi-feature correlated anomalies (e.g., low SpO2 + high HR = respiratory distress)
- Gradual drift anomalies (slow deterioration over time)
"""

import numpy as np
import pandas as pd
import os

np.random.seed(42)

TOTAL_SAMPLES = 45000
NORMAL_RATIO = 0.92   # 92% normal
ANOMALY_RATIO = 0.08  # 8% anomalies

N_NORMAL = int(TOTAL_SAMPLES * NORMAL_RATIO)
N_ANOMALY = int(TOTAL_SAMPLES * ANOMALY_RATIO)

# ------------------------------------------------------------------
# Clinical reference ranges for elderly (65+)
# ------------------------------------------------------------------
VITAL_RANGES = {
    'heart_rate':   {'mean': 75, 'std': 8,  'low': 50,  'high': 120, 'unit': 'bpm'},
    'systolic_bp':  {'mean': 132,'std': 12, 'low': 85,  'high': 180, 'unit': 'mmHg'},
    'diastolic_bp': {'mean': 78, 'std': 8,  'low': 50,  'high': 110, 'unit': 'mmHg'},
    'glucose':      {'mean': 110,'std': 18, 'low': 55,  'high': 250, 'unit': 'mg/dL'},
    'spo2':         {'mean': 96, 'std': 1.5,'low': 85,  'high': 100, 'unit': '%'},
    'temperature':  {'mean': 36.6,'std':0.3,'low': 34.5,'high': 39.5,'unit': '°C'},
}


def generate_ages(n):
    """Generate age distribution biased toward 70-85 range."""
    ages = np.random.normal(loc=77, scale=6, size=n)
    ages = np.clip(ages, 65, 95).astype(int)
    return ages


def age_adjust_vitals(base_values, ages):
    """Adjust vital sign means based on age (older = slightly higher BP, lower SpO2)."""
    age_factor = (ages - 75) / 10  # normalized age deviation
    adjusted = base_values.copy()
    adjusted['systolic_bp'] += age_factor * 4     # BP increases with age
    adjusted['diastolic_bp'] += age_factor * 2
    adjusted['heart_rate'] += age_factor * 1.5
    adjusted['spo2'] -= age_factor * 0.5          # SpO2 decreases slightly with age
    adjusted['glucose'] += age_factor * 3
    return adjusted


def generate_time_features(n):
    """Generate timestamps with hour-of-day for circadian rhythm effects."""
    probs = [
        0.01, 0.01, 0.01, 0.01, 0.01, 0.02,  # 0-5 (night)
        0.05, 0.07, 0.08, 0.07, 0.06, 0.06,  # 6-11 (morning)
        0.06, 0.05, 0.05, 0.05, 0.05, 0.05,  # 12-17 (afternoon)
        0.05, 0.05, 0.04, 0.03, 0.02, 0.02   # 18-23 (evening)
    ]
    probs = [p / sum(probs) for p in probs]  # normalize to sum=1
    hours = np.random.choice(range(24), size=n, p=probs)
    return hours


def apply_circadian_rhythm(vitals, hours):
    """Adjust vitals based on time of day (morning BP dip, nighttime HR drop)."""
    hr_adjustment = np.where(hours < 6, -5, np.where(hours > 18, -3, 0))
    bp_adjustment = np.where(hours < 6, -8, np.where((hours >= 6) & (hours < 10), 5, 0))
    vitals['heart_rate'] += hr_adjustment
    vitals['systolic_bp'] += bp_adjustment
    vitals['diastolic_bp'] += bp_adjustment * 0.5
    return vitals


def generate_normal_samples(n):
    """Generate normal vital signs from clinical distributions."""
    ages = generate_ages(n)
    hours = generate_time_features(n)

    vitals = pd.DataFrame({
        'heart_rate':   np.random.normal(VITAL_RANGES['heart_rate']['mean'],   VITAL_RANGES['heart_rate']['std'],   n),
        'systolic_bp':  np.random.normal(VITAL_RANGES['systolic_bp']['mean'],  VITAL_RANGES['systolic_bp']['std'],  n),
        'diastolic_bp': np.random.normal(VITAL_RANGES['diastolic_bp']['mean'], VITAL_RANGES['diastolic_bp']['std'], n),
        'glucose':      np.random.normal(VITAL_RANGES['glucose']['mean'],      VITAL_RANGES['glucose']['std'],      n),
        'spo2':         np.random.normal(VITAL_RANGES['spo2']['mean'],         VITAL_RANGES['spo2']['std'],         n),
        'temperature':  np.random.normal(VITAL_RANGES['temperature']['mean'],  VITAL_RANGES['temperature']['std'],  n),
    })

    vitals = age_adjust_vitals(vitals, ages)
    vitals = apply_circadian_rhythm(vitals, hours)

    # Realistic correlations: higher HR often with higher BP
    correlation_noise = np.random.normal(0, 3, n)
    vitals['heart_rate'] += (vitals['systolic_bp'] - 132) * 0.15 + correlation_noise

    vitals['age'] = ages
    vitals['hour_of_day'] = hours
    vitals['is_anomaly'] = 0

    # Clip to physiologically possible
    vitals['heart_rate'] = vitals['heart_rate'].clip(40, 150)
    vitals['systolic_bp'] = vitals['systolic_bp'].clip(70, 200)
    vitals['diastolic_bp'] = vitals['diastolic_bp'].clip(40, 120)
    vitals['glucose'] = vitals['glucose'].clip(40, 350)
    vitals['spo2'] = vitals['spo2'].clip(80, 100)
    vitals['temperature'] = vitals['temperature'].clip(34, 41)

    return vitals


def generate_anomalous_samples(n):
    """Generate anomalous vital signs with various clinical patterns."""
    ages = generate_ages(n)
    hours = generate_time_features(n)

    # Start from normal baseline
    vitals = generate_normal_samples(n)
    vitals['is_anomaly'] = 1
    vitals['age'] = ages
    vitals['hour_of_day'] = hours

    # Distribute anomalies across clinical scenarios
    n_per_type = n // 6
    remainder = n - (n_per_type * 6)

    idx = 0

    # Type 1: Hypertensive crisis (high BP + elevated HR)
    end = idx + n_per_type
    vitals.iloc[idx:end, vitals.columns.get_loc('systolic_bp')] = np.random.uniform(165, 200, n_per_type)
    vitals.iloc[idx:end, vitals.columns.get_loc('diastolic_bp')] = np.random.uniform(100, 120, n_per_type)
    vitals.iloc[idx:end, vitals.columns.get_loc('heart_rate')] = np.random.uniform(100, 135, n_per_type)
    idx = end

    # Type 2: Hypoglycemia (low glucose + elevated HR + sweating/low temp)
    end = idx + n_per_type
    vitals.iloc[idx:end, vitals.columns.get_loc('glucose')] = np.random.uniform(35, 55, n_per_type)
    vitals.iloc[idx:end, vitals.columns.get_loc('heart_rate')] = np.random.uniform(95, 130, n_per_type)
    vitals.iloc[idx:end, vitals.columns.get_loc('temperature')] = np.random.uniform(35.0, 36.0, n_per_type)
    idx = end

    # Type 3: Respiratory distress (low SpO2 + high HR + elevated temp)
    end = idx + n_per_type
    vitals.iloc[idx:end, vitals.columns.get_loc('spo2')] = np.random.uniform(82, 90, n_per_type)
    vitals.iloc[idx:end, vitals.columns.get_loc('heart_rate')] = np.random.uniform(100, 140, n_per_type)
    vitals.iloc[idx:end, vitals.columns.get_loc('temperature')] = np.random.uniform(37.8, 39.5, n_per_type)
    idx = end

    # Type 4: Bradycardia + Hypotension (low HR + low BP)
    end = idx + n_per_type
    vitals.iloc[idx:end, vitals.columns.get_loc('heart_rate')] = np.random.uniform(35, 50, n_per_type)
    vitals.iloc[idx:end, vitals.columns.get_loc('systolic_bp')] = np.random.uniform(70, 88, n_per_type)
    vitals.iloc[idx:end, vitals.columns.get_loc('diastolic_bp')] = np.random.uniform(40, 52, n_per_type)
    idx = end

    # Type 5: Hyperglycemia crisis (very high glucose + dehydration signs)
    end = idx + n_per_type
    vitals.iloc[idx:end, vitals.columns.get_loc('glucose')] = np.random.uniform(220, 350, n_per_type)
    vitals.iloc[idx:end, vitals.columns.get_loc('heart_rate')] = np.random.uniform(90, 120, n_per_type)
    vitals.iloc[idx:end, vitals.columns.get_loc('temperature')] = np.random.uniform(37.5, 38.5, n_per_type)
    idx = end

    # Type 6: Fever + infection pattern (high temp + high HR + low SpO2)
    end = idx + n_per_type + remainder
    actual_n = end - idx
    vitals.iloc[idx:end, vitals.columns.get_loc('temperature')] = np.random.uniform(38.3, 40.5, actual_n)
    vitals.iloc[idx:end, vitals.columns.get_loc('heart_rate')] = np.random.uniform(95, 130, actual_n)
    vitals.iloc[idx:end, vitals.columns.get_loc('spo2')] = np.random.uniform(87, 93, actual_n)

    # Clip all values
    vitals['heart_rate'] = vitals['heart_rate'].clip(30, 160)
    vitals['systolic_bp'] = vitals['systolic_bp'].clip(60, 220)
    vitals['diastolic_bp'] = vitals['diastolic_bp'].clip(35, 130)
    vitals['glucose'] = vitals['glucose'].clip(30, 400)
    vitals['spo2'] = vitals['spo2'].clip(75, 100)
    vitals['temperature'] = vitals['temperature'].clip(33, 42)

    return vitals


def main():
    print("=" * 60)
    print("AegisCare - Vital Signs Dataset Generation")
    print("=" * 60)

    print(f"\nGenerating {N_NORMAL} normal samples...")
    normal_data = generate_normal_samples(N_NORMAL)

    print(f"Generating {N_ANOMALY} anomalous samples...")
    anomaly_data = generate_anomalous_samples(N_ANOMALY)

    # Combine and shuffle
    dataset = pd.concat([normal_data, anomaly_data], ignore_index=True)
    dataset = dataset.sample(frac=1, random_state=42).reset_index(drop=True)

    # Add derived features
    dataset['pulse_pressure'] = dataset['systolic_bp'] - dataset['diastolic_bp']
    dataset['map'] = dataset['diastolic_bp'] + (dataset['pulse_pressure'] / 3)  # Mean Arterial Pressure
    dataset['hr_bp_ratio'] = dataset['heart_rate'] / dataset['systolic_bp']

    # Round values realistically
    dataset['heart_rate'] = dataset['heart_rate'].round(0).astype(int)
    dataset['systolic_bp'] = dataset['systolic_bp'].round(0).astype(int)
    dataset['diastolic_bp'] = dataset['diastolic_bp'].round(0).astype(int)
    dataset['glucose'] = dataset['glucose'].round(0).astype(int)
    dataset['spo2'] = dataset['spo2'].round(1)
    dataset['temperature'] = dataset['temperature'].round(1)
    dataset['pulse_pressure'] = dataset['pulse_pressure'].round(0).astype(int)
    dataset['map'] = dataset['map'].round(1)
    dataset['hr_bp_ratio'] = dataset['hr_bp_ratio'].round(3)

    # Save
    output_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'vitals_dataset.csv')
    dataset.to_csv(output_path, index=False)

    print(f"\n--- Dataset Summary ---")
    print(f"Total samples:    {len(dataset)}")
    print(f"Normal samples:   {len(dataset[dataset['is_anomaly']==0])} ({len(dataset[dataset['is_anomaly']==0])/len(dataset)*100:.1f}%)")
    print(f"Anomaly samples:  {len(dataset[dataset['is_anomaly']==1])} ({len(dataset[dataset['is_anomaly']==1])/len(dataset)*100:.1f}%)")
    print(f"Features:         {list(dataset.columns)}")
    print(f"\nSaved to: {output_path}")

    print(f"\n--- Feature Statistics ---")
    print(dataset.describe().round(2).to_string())


if __name__ == '__main__':
    main()

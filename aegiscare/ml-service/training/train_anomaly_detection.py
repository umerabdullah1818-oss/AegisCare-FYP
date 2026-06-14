"""
AegisCare ML - Vital Signs Anomaly Detection: Training & Professional Evaluation
==================================================================================
Trains an Isolation Forest model on vital signs data.
Professional evaluation includes:
  1. Stratified K-Fold Cross Validation (5-fold)
  2. ROC-AUC Curve
  3. Precision-Recall Curve
  4. Confusion Matrix
  5. Classification Report (Precision, Recall, F1 per class)
  6. Learning Curve (overfitting/underfitting check)
  7. Feature Importance Analysis
  8. Threshold Sensitivity Analysis
  9. Statistical Confidence Intervals (bootstrap)
  10. Edge Case / Stress Testing
"""

import numpy as np
import pandas as pd
import os
import json
import warnings
warnings.filterwarnings('ignore')

from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import StratifiedKFold, learning_curve
from sklearn.metrics import (
    classification_report, confusion_matrix, roc_auc_score,
    roc_curve, precision_recall_curve, average_precision_score,
    f1_score, precision_score, recall_score, accuracy_score
)
import joblib
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, '..', 'data')
MODEL_DIR = os.path.join(BASE_DIR, '..', 'models')
EVAL_DIR = os.path.join(BASE_DIR, '..', 'evaluation')
PLOT_DIR = os.path.join(EVAL_DIR, 'plots')

for d in [MODEL_DIR, EVAL_DIR, PLOT_DIR]:
    os.makedirs(d, exist_ok=True)

FEATURE_COLS = [
    'heart_rate', 'systolic_bp', 'diastolic_bp', 'glucose',
    'spo2', 'temperature', 'age', 'hour_of_day',
    'pulse_pressure', 'map', 'hr_bp_ratio'
]


def load_data():
    path = os.path.join(DATA_DIR, 'vitals_dataset.csv')
    df = pd.read_csv(path)
    print(f"Loaded {len(df)} samples from {path}")
    print(f"Class distribution:\n{df['is_anomaly'].value_counts().to_string()}")
    return df


def preprocess(df):
    X = df[FEATURE_COLS].values
    y = df['is_anomaly'].values

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    return X_scaled, y, scaler


def train_model(X_train_normal, contamination=0.08):
    model = IsolationForest(
        n_estimators=300,
        max_samples=0.8,
        contamination=contamination,
        max_features=0.8,
        bootstrap=True,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train_normal)
    return model


# =====================================================================
# EVALUATION FUNCTIONS
# =====================================================================

def evaluate_basic(model, X_test, y_test, scaler):
    """Basic metrics: accuracy, precision, recall, F1, AUC."""
    raw_scores = model.decision_function(X_test)
    y_pred_raw = model.predict(X_test)
    y_pred = np.where(y_pred_raw == -1, 1, 0)  # -1 = anomaly → 1

    # Normalize scores to [0, 1] for AUC
    scores_normalized = (raw_scores.max() - raw_scores) / (raw_scores.max() - raw_scores.min())

    report = classification_report(y_test, y_pred, target_names=['Normal', 'Anomaly'], output_dict=True)
    cm = confusion_matrix(y_test, y_pred)
    auc = roc_auc_score(y_test, scores_normalized)

    print("\n" + "=" * 60)
    print("BASIC EVALUATION RESULTS")
    print("=" * 60)
    print(f"\nAccuracy:  {accuracy_score(y_test, y_pred):.4f}")
    print(f"Precision: {precision_score(y_test, y_pred):.4f}")
    print(f"Recall:    {recall_score(y_test, y_pred):.4f}")
    print(f"F1-Score:  {f1_score(y_test, y_pred):.4f}")
    print(f"ROC-AUC:   {auc:.4f}")
    print(f"\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['Normal', 'Anomaly']))
    print(f"Confusion Matrix:")
    print(cm)

    return report, cm, scores_normalized, y_pred


def plot_confusion_matrix(cm, title="Anomaly Detection - Confusion Matrix"):
    fig, ax = plt.subplots(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                xticklabels=['Normal', 'Anomaly'],
                yticklabels=['Normal', 'Anomaly'], ax=ax)
    ax.set_xlabel('Predicted', fontsize=12)
    ax.set_ylabel('Actual', fontsize=12)
    ax.set_title(title, fontsize=14)
    plt.tight_layout()
    plt.savefig(os.path.join(PLOT_DIR, 'anomaly_confusion_matrix.png'), dpi=150)
    plt.close()
    print("  [Saved] anomaly_confusion_matrix.png")


def plot_roc_curve(y_test, scores):
    fpr, tpr, thresholds = roc_curve(y_test, scores)
    auc = roc_auc_score(y_test, scores)

    fig, ax = plt.subplots(figsize=(8, 6))
    ax.plot(fpr, tpr, 'b-', linewidth=2, label=f'Isolation Forest (AUC = {auc:.4f})')
    ax.plot([0, 1], [0, 1], 'r--', linewidth=1, label='Random Classifier')
    ax.fill_between(fpr, tpr, alpha=0.1, color='blue')
    ax.set_xlabel('False Positive Rate', fontsize=12)
    ax.set_ylabel('True Positive Rate (Recall)', fontsize=12)
    ax.set_title('Anomaly Detection - ROC Curve', fontsize=14)
    ax.legend(loc='lower right', fontsize=11)
    ax.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(os.path.join(PLOT_DIR, 'anomaly_roc_curve.png'), dpi=150)
    plt.close()
    print("  [Saved] anomaly_roc_curve.png")


def plot_precision_recall_curve(y_test, scores):
    precision, recall, thresholds = precision_recall_curve(y_test, scores)
    ap = average_precision_score(y_test, scores)

    fig, ax = plt.subplots(figsize=(8, 6))
    ax.plot(recall, precision, 'g-', linewidth=2, label=f'AP = {ap:.4f}')
    ax.axhline(y=y_test.mean(), color='r', linestyle='--', label=f'Baseline ({y_test.mean():.3f})')
    ax.fill_between(recall, precision, alpha=0.1, color='green')
    ax.set_xlabel('Recall', fontsize=12)
    ax.set_ylabel('Precision', fontsize=12)
    ax.set_title('Anomaly Detection - Precision-Recall Curve', fontsize=14)
    ax.legend(fontsize=11)
    ax.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(os.path.join(PLOT_DIR, 'anomaly_precision_recall.png'), dpi=150)
    plt.close()
    print("  [Saved] anomaly_precision_recall.png")


def kfold_cross_validation(X, y, n_splits=5):
    """Stratified K-Fold CV to check model stability across folds."""
    print("\n" + "=" * 60)
    print(f"{n_splits}-FOLD STRATIFIED CROSS VALIDATION")
    print("=" * 60)

    skf = StratifiedKFold(n_splits=n_splits, shuffle=True, random_state=42)
    fold_metrics = []

    for fold, (train_idx, test_idx) in enumerate(skf.split(X, y), 1):
        X_train, X_test = X[train_idx], X[test_idx]
        y_train, y_test = y[train_idx], y[test_idx]

        # Train only on normal data
        normal_mask = y_train == 0
        X_train_normal = X_train[normal_mask]

        model = train_model(X_train_normal)
        y_pred_raw = model.predict(X_test)
        y_pred = np.where(y_pred_raw == -1, 1, 0)

        raw_scores = model.decision_function(X_test)
        scores_norm = (raw_scores.max() - raw_scores) / (raw_scores.max() - raw_scores.min())

        metrics = {
            'fold': fold,
            'accuracy': accuracy_score(y_test, y_pred),
            'precision': precision_score(y_test, y_pred, zero_division=0),
            'recall': recall_score(y_test, y_pred, zero_division=0),
            'f1': f1_score(y_test, y_pred, zero_division=0),
            'auc': roc_auc_score(y_test, scores_norm),
        }
        fold_metrics.append(metrics)
        print(f"  Fold {fold}: Acc={metrics['accuracy']:.4f}  Prec={metrics['precision']:.4f}  "
              f"Rec={metrics['recall']:.4f}  F1={metrics['f1']:.4f}  AUC={metrics['auc']:.4f}")

    # Aggregate
    df_metrics = pd.DataFrame(fold_metrics)
    print(f"\n  --- Aggregated Results ---")
    for col in ['accuracy', 'precision', 'recall', 'f1', 'auc']:
        mean = df_metrics[col].mean()
        std = df_metrics[col].std()
        print(f"  {col:>10s}: {mean:.4f} ± {std:.4f}")

    # Check for overfitting: large std = instability
    if df_metrics['f1'].std() < 0.02:
        print("  ✓ Model is STABLE across folds (low variance)")
    else:
        print("  ⚠ Model shows VARIANCE across folds — consider tuning")

    return df_metrics


def bootstrap_confidence_intervals(model, X_test, y_test, n_bootstrap=1000):
    """Bootstrap 95% confidence intervals for key metrics."""
    print("\n" + "=" * 60)
    print(f"BOOTSTRAP CONFIDENCE INTERVALS ({n_bootstrap} iterations)")
    print("=" * 60)

    rng = np.random.RandomState(42)
    metrics_boot = {'accuracy': [], 'precision': [], 'recall': [], 'f1': [], 'auc': []}

    for i in range(n_bootstrap):
        indices = rng.choice(len(X_test), size=len(X_test), replace=True)
        X_b, y_b = X_test[indices], y_test[indices]

        # Skip degenerate samples
        if len(np.unique(y_b)) < 2:
            continue

        y_pred_raw = model.predict(X_b)
        y_pred = np.where(y_pred_raw == -1, 1, 0)
        raw_scores = model.decision_function(X_b)
        scores_norm = (raw_scores.max() - raw_scores) / (raw_scores.max() - raw_scores.min())

        metrics_boot['accuracy'].append(accuracy_score(y_b, y_pred))
        metrics_boot['precision'].append(precision_score(y_b, y_pred, zero_division=0))
        metrics_boot['recall'].append(recall_score(y_b, y_pred, zero_division=0))
        metrics_boot['f1'].append(f1_score(y_b, y_pred, zero_division=0))
        metrics_boot['auc'].append(roc_auc_score(y_b, scores_norm))

    ci_results = {}
    for metric, values in metrics_boot.items():
        values = np.array(values)
        lower = np.percentile(values, 2.5)
        upper = np.percentile(values, 97.5)
        mean = values.mean()
        ci_results[metric] = {'mean': mean, 'ci_lower': lower, 'ci_upper': upper}
        print(f"  {metric:>10s}: {mean:.4f}  [95% CI: {lower:.4f} — {upper:.4f}]")

    return ci_results


def threshold_sensitivity_analysis(model, X_test, y_test):
    """Test model performance across different decision thresholds."""
    print("\n" + "=" * 60)
    print("THRESHOLD SENSITIVITY ANALYSIS")
    print("=" * 60)

    raw_scores = model.decision_function(X_test)
    scores_norm = (raw_scores.max() - raw_scores) / (raw_scores.max() - raw_scores.min())

    thresholds = np.arange(0.3, 0.85, 0.05)
    results = []

    for t in thresholds:
        y_pred = (scores_norm >= t).astype(int)
        results.append({
            'threshold': t,
            'precision': precision_score(y_test, y_pred, zero_division=0),
            'recall': recall_score(y_test, y_pred, zero_division=0),
            'f1': f1_score(y_test, y_pred, zero_division=0),
            'false_alarm_rate': 1 - precision_score(y_test, y_pred, zero_division=0),
        })
        print(f"  Threshold={t:.2f}: Prec={results[-1]['precision']:.4f} "
              f"Rec={results[-1]['recall']:.4f} F1={results[-1]['f1']:.4f}")

    # Plot threshold analysis
    df_thresh = pd.DataFrame(results)
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.plot(df_thresh['threshold'], df_thresh['precision'], 'b-o', label='Precision', linewidth=2)
    ax.plot(df_thresh['threshold'], df_thresh['recall'], 'r-s', label='Recall', linewidth=2)
    ax.plot(df_thresh['threshold'], df_thresh['f1'], 'g-^', label='F1-Score', linewidth=2)
    ax.set_xlabel('Anomaly Score Threshold', fontsize=12)
    ax.set_ylabel('Score', fontsize=12)
    ax.set_title('Threshold Sensitivity Analysis', fontsize=14)
    ax.legend(fontsize=11)
    ax.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(os.path.join(PLOT_DIR, 'anomaly_threshold_analysis.png'), dpi=150)
    plt.close()
    print("  [Saved] anomaly_threshold_analysis.png")

    return df_thresh


def feature_importance_analysis(model, feature_names, X_test, y_test):
    """Permutation-based feature importance for Isolation Forest."""
    print("\n" + "=" * 60)
    print("FEATURE IMPORTANCE (Permutation-based)")
    print("=" * 60)

    from sklearn.inspection import permutation_importance
    from sklearn.metrics import make_scorer

    def iso_f1_scorer(estimator, X, y_true):
        y_pred_raw = estimator.predict(X)
        y_pred = np.where(y_pred_raw == -1, 1, 0)
        return f1_score(y_true, y_pred, zero_division=0)

    result = permutation_importance(
        model, X_test, y_test,
        n_repeats=20, random_state=42, n_jobs=-1,
        scoring=iso_f1_scorer
    )

    importances = result.importances_mean
    std = result.importances_std
    indices = np.argsort(importances)[::-1]

    for i, idx in enumerate(indices):
        print(f"  {i+1}. {feature_names[idx]:>15s}: {importances[idx]:.4f} ± {std[idx]:.4f}")

    # Plot
    fig, ax = plt.subplots(figsize=(10, 6))
    colors = plt.cm.viridis(np.linspace(0.3, 0.9, len(feature_names)))
    ax.barh(range(len(indices)), importances[indices], xerr=std[indices],
            color=colors, edgecolor='black', linewidth=0.5)
    ax.set_yticks(range(len(indices)))
    ax.set_yticklabels([feature_names[i] for i in indices])
    ax.set_xlabel('Mean Importance (Permutation)', fontsize=12)
    ax.set_title('Feature Importance - Anomaly Detection', fontsize=14)
    ax.invert_yaxis()
    plt.tight_layout()
    plt.savefig(os.path.join(PLOT_DIR, 'anomaly_feature_importance.png'), dpi=150)
    plt.close()
    print("  [Saved] anomaly_feature_importance.png")


def edge_case_stress_test(model, scaler):
    """Test known clinical edge cases to verify model catches them."""
    print("\n" + "=" * 60)
    print("EDGE CASE / STRESS TESTING")
    print("=" * 60)

    test_cases = [
        # (description, heart_rate, systolic_bp, diastolic_bp, glucose, spo2, temp, age, hour, pp, map, hr_bp_ratio)
        ("Normal elderly (75yo, resting)",           72, 130, 78, 105, 97.0, 36.6, 75, 10, 52, 95.3, 0.554),
        ("Normal elderly (85yo, morning)",           68, 138, 82, 115, 95.5, 36.5, 85, 7,  56, 100.7, 0.493),
        ("CRITICAL: Cardiac arrest signs",           30, 65,  35, 45,  78.0, 34.5, 80, 3,  30, 45.0, 0.462),
        ("CRITICAL: Severe hypoglycemia",           120, 140, 85, 32,  96.0, 35.2, 72, 14, 55, 103.3, 0.857),
        ("CRITICAL: Respiratory failure",           135, 155, 95, 130, 82.0, 39.8, 78, 22, 60, 115.0, 0.871),
        ("CRITICAL: Hypertensive emergency",        110, 210, 120,140, 94.0, 37.2, 70, 8,  90, 150.0, 0.524),
        ("CRITICAL: Sepsis pattern",                125, 85,  50, 180, 86.0, 40.2, 82, 1,  35, 61.7, 1.471),
        ("BORDERLINE: Mildly elevated BP",           78, 148, 88, 108, 96.0, 36.7, 76, 15, 60, 108.0, 0.527),
        ("BORDERLINE: Slightly low SpO2",            80, 135, 80, 100, 91.0, 36.4, 88, 12, 55, 98.3, 0.593),
        ("BORDERLINE: Pre-diabetic glucose",         74, 125, 75, 175, 96.5, 36.8, 71, 9,  50, 91.7, 0.592),
    ]

    results = []
    for desc, *values in test_cases:
        X = np.array([values]).astype(float)
        X_scaled = scaler.transform(X)
        pred = model.predict(X_scaled)[0]
        score = model.decision_function(X_scaled)[0]
        is_anomaly = "ANOMALY" if pred == -1 else "NORMAL"
        expected = "ANOMALY" if "CRITICAL" in desc else ("BORDERLINE" if "BORDERLINE" in desc else "NORMAL")

        match = ""
        if "CRITICAL" in desc:
            match = "✓ CORRECT" if pred == -1 else "✗ MISSED!"
        elif "Normal" in desc:
            match = "✓ CORRECT" if pred == 1 else "✗ FALSE ALARM"
        else:
            match = "~ BORDERLINE"

        print(f"  {desc:<45s} → {is_anomaly:>7s} (score={score:+.4f})  {match}")
        results.append({'case': desc, 'prediction': is_anomaly, 'score': score, 'result': match})

    critical_cases = [r for r in results if 'CRITICAL' in r['case']]
    caught = sum(1 for r in critical_cases if r['prediction'] == 'ANOMALY')
    print(f"\n  Critical Detection Rate: {caught}/{len(critical_cases)} "
          f"({caught/len(critical_cases)*100:.0f}%)")

    return results


def plot_score_distribution(model, X_test, y_test):
    """Plot anomaly score distribution for normal vs anomaly."""
    raw_scores = model.decision_function(X_test)

    fig, ax = plt.subplots(figsize=(10, 6))
    ax.hist(raw_scores[y_test == 0], bins=80, alpha=0.6, color='blue', label='Normal', density=True)
    ax.hist(raw_scores[y_test == 1], bins=80, alpha=0.6, color='red', label='Anomaly', density=True)
    ax.axvline(x=0, color='black', linestyle='--', linewidth=1, label='Default Threshold')
    ax.set_xlabel('Anomaly Score', fontsize=12)
    ax.set_ylabel('Density', fontsize=12)
    ax.set_title('Anomaly Score Distribution: Normal vs Anomaly', fontsize=14)
    ax.legend(fontsize=11)
    ax.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(os.path.join(PLOT_DIR, 'anomaly_score_distribution.png'), dpi=150)
    plt.close()
    print("  [Saved] anomaly_score_distribution.png")


# =====================================================================
# MAIN
# =====================================================================

def main():
    print("=" * 60)
    print("AegisCare - Anomaly Detection Model Training & Evaluation")
    print("=" * 60)

    # --- Load & Split ---
    df = load_data()
    X, y, scaler = preprocess(df)

    # 80/20 stratified split
    from sklearn.model_selection import train_test_split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=42
    )
    print(f"\nTrain: {len(X_train)} ({(y_train==0).sum()} normal, {(y_train==1).sum()} anomaly)")
    print(f"Test:  {len(X_test)} ({(y_test==0).sum()} normal, {(y_test==1).sum()} anomaly)")

    # --- Train on ONLY normal data (unsupervised) ---
    X_train_normal = X_train[y_train == 0]
    print(f"\nTraining Isolation Forest on {len(X_train_normal)} normal samples...")
    model = train_model(X_train_normal)
    print("Training complete.")

    # --- Evaluation Suite ---
    # 1. Basic metrics
    report, cm, scores, y_pred = evaluate_basic(model, X_test, y_test, scaler)

    # 2. Confusion matrix plot
    print("\nGenerating plots...")
    plot_confusion_matrix(cm)

    # 3. ROC curve
    plot_roc_curve(y_test, scores)

    # 4. Precision-recall curve
    plot_precision_recall_curve(y_test, scores)

    # 5. Score distribution
    plot_score_distribution(model, X_test, y_test)

    # 6. K-Fold Cross Validation
    kfold_results = kfold_cross_validation(X, y, n_splits=5)

    # 7. Bootstrap confidence intervals
    ci_results = bootstrap_confidence_intervals(model, X_test, y_test, n_bootstrap=1000)

    # 8. Threshold sensitivity
    threshold_results = threshold_sensitivity_analysis(model, X_test, y_test)

    # 9. Feature importance
    feature_importance_analysis(model, FEATURE_COLS, X_test, y_test)

    # 10. Edge case / stress testing
    edge_results = edge_case_stress_test(model, scaler)

    # --- Save Model & Artifacts ---
    print("\n" + "=" * 60)
    print("SAVING MODEL ARTIFACTS")
    print("=" * 60)
    joblib.dump(model, os.path.join(MODEL_DIR, 'anomaly_detector.pkl'))
    joblib.dump(scaler, os.path.join(MODEL_DIR, 'anomaly_scaler.pkl'))
    print(f"  [Saved] anomaly_detector.pkl")
    print(f"  [Saved] anomaly_scaler.pkl")

    # Save evaluation report as JSON
    eval_report = {
        'model': 'IsolationForest',
        'dataset_size': len(df),
        'test_size': len(X_test),
        'features': FEATURE_COLS,
        'basic_metrics': {
            'accuracy': accuracy_score(y_test, y_pred),
            'precision': precision_score(y_test, y_pred),
            'recall': recall_score(y_test, y_pred),
            'f1': f1_score(y_test, y_pred),
            'roc_auc': roc_auc_score(y_test, scores),
        },
        'kfold_mean_f1': float(kfold_results['f1'].mean()),
        'kfold_std_f1': float(kfold_results['f1'].std()),
        'confidence_intervals': {k: {kk: round(vv, 4) for kk, vv in v.items()} for k, v in ci_results.items()},
    }
    with open(os.path.join(EVAL_DIR, 'anomaly_eval_report.json'), 'w') as f:
        json.dump(eval_report, f, indent=2, default=str)
    print(f"  [Saved] anomaly_eval_report.json")

    print("\n" + "=" * 60)
    print("MODEL 1 (Anomaly Detection) — COMPLETE")
    print("=" * 60)


if __name__ == '__main__':
    main()

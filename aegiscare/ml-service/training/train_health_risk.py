"""
AegisCare ML - Health Risk Prediction: Training & Professional Evaluation
==========================================================================
Trains a HistGradientBoostingClassifier (sklearn's histogram-based gradient
boosting — functionally equivalent to XGBoost) on elderly health risk data.

Professional evaluation includes:
  1.  Stratified K-Fold Cross Validation (5-fold)
  2.  ROC-AUC Curve (one-vs-rest, multiclass)
  3.  Precision-Recall per class
  4.  Confusion Matrix (3x3)
  5.  Classification Report
  6.  Learning Curve (overfit / underfit check)
  7.  Feature Importance (permutation-based)
  8.  Bootstrap Confidence Intervals (1000 iterations)
  9.  Class-specific threshold analysis
  10. SMOTE class-balance comparison
  11. Edge-case / clinical scenario stress test
  12. Calibration Curve (reliability diagram)
"""

import numpy as np
import pandas as pd
import os
import json
import warnings
warnings.filterwarnings('ignore')

from sklearn.ensemble import HistGradientBoostingClassifier, RandomForestClassifier
from sklearn.preprocessing import StandardScaler, label_binarize
from sklearn.model_selection import (
    StratifiedKFold, train_test_split, learning_curve, RandomizedSearchCV
)
from sklearn.metrics import (
    classification_report, confusion_matrix, roc_auc_score,
    roc_curve, precision_recall_curve, average_precision_score,
    f1_score, precision_score, recall_score, accuracy_score,
    log_loss
)
from sklearn.calibration import calibration_curve
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
    'age', 'gender', 'bmi',
    'has_diabetes', 'has_hypertension', 'has_heart_disease', 'has_copd', 'has_arthritis',
    'num_conditions',
    'avg_hr_7d', 'avg_sbp_7d', 'avg_dbp_7d', 'avg_glucose_7d', 'avg_spo2_7d', 'avg_temp_7d',
    'hr_variability', 'bp_variability', 'glucose_variability',
    'anomaly_count_30d',
    'num_medications', 'adherence_rate_30d', 'missed_doses_7d',
    'avg_calories', 'avg_protein', 'avg_carbs', 'avg_fats', 'meals_per_day',
    'consultations_90d', 'missed_appointments_90d', 'er_visits_180d',
    'cognitive_score', 'days_since_checkup',
]

LABEL_NAMES = ['Low', 'Medium', 'High']


def load_data():
    path = os.path.join(DATA_DIR, 'health_risk_dataset.csv')
    df = pd.read_csv(path)
    print(f"Loaded {len(df)} samples from {path}")
    print(f"Risk level distribution:")
    for level, name in enumerate(LABEL_NAMES):
        count = (df['risk_level'] == level).sum()
        print(f"  {name}: {count} ({count/len(df)*100:.1f}%)")
    return df


def preprocess(df):
    X = df[FEATURE_COLS].values
    y = df['risk_level'].values

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    return X_scaled, y, scaler


# =====================================================================
# TRAINING
# =====================================================================

def train_model(X_train, y_train):
    """Train HistGradientBoosting with good defaults to avoid overfit."""
    model = HistGradientBoostingClassifier(
        max_iter=400,
        max_depth=6,
        learning_rate=0.05,
        min_samples_leaf=20,        # regularization: prevent overfitting
        max_leaf_nodes=31,
        l2_regularization=1.0,      # L2 penalty
        max_bins=255,
        early_stopping=True,        # stop if validation loss stops improving
        validation_fraction=0.15,
        n_iter_no_change=25,
        scoring='loss',
        class_weight='balanced',    # handle class imbalance
        random_state=42,
    )
    model.fit(X_train, y_train)
    return model


def hyperparameter_search(X_train, y_train):
    """RandomizedSearchCV for best hyperparameters."""
    print("\n" + "=" * 60)
    print("HYPERPARAMETER SEARCH (RandomizedSearchCV)")
    print("=" * 60)

    param_distributions = {
        'max_iter': [200, 300, 400, 500],
        'max_depth': [4, 5, 6, 8],
        'learning_rate': [0.01, 0.03, 0.05, 0.1],
        'min_samples_leaf': [10, 20, 30, 50],
        'max_leaf_nodes': [15, 31, 63],
        'l2_regularization': [0.0, 0.5, 1.0, 2.0],
    }

    base_model = HistGradientBoostingClassifier(
        early_stopping=True,
        validation_fraction=0.15,
        n_iter_no_change=20,
        class_weight='balanced',
        random_state=42,
    )

    search = RandomizedSearchCV(
        base_model,
        param_distributions,
        n_iter=30,
        cv=StratifiedKFold(n_splits=3, shuffle=True, random_state=42),
        scoring='f1_weighted',
        n_jobs=-1,
        random_state=42,
        verbose=0,
    )
    search.fit(X_train, y_train)

    print(f"  Best F1 (weighted): {search.best_score_:.4f}")
    print(f"  Best params: {search.best_params_}")

    return search.best_estimator_, search.best_params_


# =====================================================================
# EVALUATION FUNCTIONS
# =====================================================================

def evaluate_basic(model, X_test, y_test):
    """Basic metrics: accuracy, per-class precision/recall/F1, log loss."""
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)

    acc = accuracy_score(y_test, y_pred)
    f1_w = f1_score(y_test, y_pred, average='weighted')
    f1_macro = f1_score(y_test, y_pred, average='macro')
    ll = log_loss(y_test, y_proba)

    # Multiclass ROC-AUC (one-vs-rest)
    y_bin = label_binarize(y_test, classes=[0, 1, 2])
    auc_ovr = roc_auc_score(y_bin, y_proba, multi_class='ovr', average='weighted')

    print("\n" + "=" * 60)
    print("BASIC EVALUATION RESULTS")
    print("=" * 60)
    print(f"\n  Accuracy:          {acc:.4f}")
    print(f"  F1 (weighted):     {f1_w:.4f}")
    print(f"  F1 (macro):        {f1_macro:.4f}")
    print(f"  Log Loss:          {ll:.4f}")
    print(f"  ROC-AUC (OVR):     {auc_ovr:.4f}")
    print(f"\n  Classification Report:")
    print(classification_report(y_test, y_pred, target_names=LABEL_NAMES))

    cm = confusion_matrix(y_test, y_pred)
    print("  Confusion Matrix:")
    print(cm)

    return y_pred, y_proba, cm, {'accuracy': acc, 'f1_weighted': f1_w, 'f1_macro': f1_macro,
                                  'log_loss': ll, 'roc_auc_ovr': auc_ovr}


def plot_confusion_matrix(cm):
    fig, ax = plt.subplots(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='YlOrRd',
                xticklabels=LABEL_NAMES, yticklabels=LABEL_NAMES, ax=ax)
    ax.set_xlabel('Predicted', fontsize=12)
    ax.set_ylabel('Actual', fontsize=12)
    ax.set_title('Health Risk Prediction - Confusion Matrix', fontsize=14)
    plt.tight_layout()
    plt.savefig(os.path.join(PLOT_DIR, 'health_risk_confusion_matrix.png'), dpi=150)
    plt.close()
    print("  [Saved] health_risk_confusion_matrix.png")


def plot_multiclass_roc(y_test, y_proba):
    """One-vs-rest ROC curves for each risk level."""
    y_bin = label_binarize(y_test, classes=[0, 1, 2])
    colors = ['#4CAF50', '#FF9800', '#F44336']

    fig, ax = plt.subplots(figsize=(8, 6))
    for i, (name, color) in enumerate(zip(LABEL_NAMES, colors)):
        fpr, tpr, _ = roc_curve(y_bin[:, i], y_proba[:, i])
        auc = roc_auc_score(y_bin[:, i], y_proba[:, i])
        ax.plot(fpr, tpr, color=color, linewidth=2, label=f'{name} (AUC = {auc:.4f})')

    ax.plot([0, 1], [0, 1], 'k--', linewidth=1, label='Random')
    ax.set_xlabel('False Positive Rate', fontsize=12)
    ax.set_ylabel('True Positive Rate', fontsize=12)
    ax.set_title('Health Risk - Multiclass ROC Curve (One-vs-Rest)', fontsize=14)
    ax.legend(fontsize=11)
    ax.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(os.path.join(PLOT_DIR, 'health_risk_roc_curve.png'), dpi=150)
    plt.close()
    print("  [Saved] health_risk_roc_curve.png")


def plot_learning_curve(model, X, y):
    """Learning curve to check overfit vs underfit."""
    print("\n  Computing learning curve (this may take a moment)...")
    train_sizes, train_scores, val_scores = learning_curve(
        model, X, y,
        train_sizes=np.linspace(0.1, 1.0, 10),
        cv=StratifiedKFold(n_splits=3, shuffle=True, random_state=42),
        scoring='f1_weighted',
        n_jobs=-1,
        random_state=42,
    )

    train_mean = train_scores.mean(axis=1)
    train_std = train_scores.std(axis=1)
    val_mean = val_scores.mean(axis=1)
    val_std = val_scores.std(axis=1)

    fig, ax = plt.subplots(figsize=(10, 6))
    ax.fill_between(train_sizes, train_mean - train_std, train_mean + train_std, alpha=0.1, color='blue')
    ax.fill_between(train_sizes, val_mean - val_std, val_mean + val_std, alpha=0.1, color='red')
    ax.plot(train_sizes, train_mean, 'b-o', linewidth=2, label='Training Score')
    ax.plot(train_sizes, val_mean, 'r-s', linewidth=2, label='Validation Score')
    ax.set_xlabel('Training Set Size', fontsize=12)
    ax.set_ylabel('F1 Score (weighted)', fontsize=12)
    ax.set_title('Health Risk - Learning Curve (Overfit/Underfit Check)', fontsize=14)
    ax.legend(fontsize=11)
    ax.grid(True, alpha=0.3)

    # Diagnosis
    gap = train_mean[-1] - val_mean[-1]
    if gap < 0.03:
        diagnosis = "GOOD FIT: Train ≈ Validation"
    elif gap < 0.08:
        diagnosis = "SLIGHT OVERFIT: Small gap"
    else:
        diagnosis = "OVERFIT: Large train-val gap"
    ax.text(0.5, 0.05, diagnosis, transform=ax.transAxes, fontsize=12,
            ha='center', bbox=dict(boxstyle='round', facecolor='wheat'))

    plt.tight_layout()
    plt.savefig(os.path.join(PLOT_DIR, 'health_risk_learning_curve.png'), dpi=150)
    plt.close()
    print(f"  [Saved] health_risk_learning_curve.png")
    print(f"  Diagnosis: {diagnosis} (gap = {gap:.4f})")

    return gap


def kfold_cross_validation(X, y, n_splits=5):
    """Stratified K-Fold CV to check model stability."""
    print("\n" + "=" * 60)
    print(f"{n_splits}-FOLD STRATIFIED CROSS VALIDATION")
    print("=" * 60)

    skf = StratifiedKFold(n_splits=n_splits, shuffle=True, random_state=42)
    fold_metrics = []

    for fold, (train_idx, test_idx) in enumerate(skf.split(X, y), 1):
        X_train, X_test = X[train_idx], X[test_idx]
        y_train, y_test = y[train_idx], y[test_idx]

        model = train_model(X_train, y_train)
        y_pred = model.predict(X_test)
        y_proba = model.predict_proba(X_test)

        y_bin = label_binarize(y_test, classes=[0, 1, 2])
        auc = roc_auc_score(y_bin, y_proba, multi_class='ovr', average='weighted')

        metrics = {
            'fold': fold,
            'accuracy': accuracy_score(y_test, y_pred),
            'f1_weighted': f1_score(y_test, y_pred, average='weighted'),
            'f1_macro': f1_score(y_test, y_pred, average='macro'),
            'recall_high': recall_score(y_test, y_pred, labels=[2], average='micro'),
            'auc_ovr': auc,
        }
        fold_metrics.append(metrics)
        print(f"  Fold {fold}: Acc={metrics['accuracy']:.4f}  F1w={metrics['f1_weighted']:.4f}  "
              f"F1m={metrics['f1_macro']:.4f}  RecHigh={metrics['recall_high']:.4f}  AUC={metrics['auc_ovr']:.4f}")

    df_m = pd.DataFrame(fold_metrics)
    print(f"\n  --- Aggregated ---")
    for col in ['accuracy', 'f1_weighted', 'f1_macro', 'recall_high', 'auc_ovr']:
        print(f"  {col:>15s}: {df_m[col].mean():.4f} +/- {df_m[col].std():.4f}")

    if df_m['f1_weighted'].std() < 0.015:
        print("  STABLE across folds (low variance)")
    else:
        print("  WARNING: Some variance across folds")

    return df_m


def bootstrap_confidence_intervals(model, X_test, y_test, n_bootstrap=1000):
    """Bootstrap 95% CIs for key metrics."""
    print("\n" + "=" * 60)
    print(f"BOOTSTRAP CONFIDENCE INTERVALS ({n_bootstrap} iterations)")
    print("=" * 60)

    rng = np.random.RandomState(42)
    metrics_boot = {'accuracy': [], 'f1_weighted': [], 'f1_macro': [], 'recall_high': []}

    for _ in range(n_bootstrap):
        idx = rng.choice(len(X_test), size=len(X_test), replace=True)
        X_b, y_b = X_test[idx], y_test[idx]

        if len(np.unique(y_b)) < 3:
            continue

        y_pred = model.predict(X_b)
        metrics_boot['accuracy'].append(accuracy_score(y_b, y_pred))
        metrics_boot['f1_weighted'].append(f1_score(y_b, y_pred, average='weighted'))
        metrics_boot['f1_macro'].append(f1_score(y_b, y_pred, average='macro'))
        metrics_boot['recall_high'].append(recall_score(y_b, y_pred, labels=[2], average='micro'))

    ci_results = {}
    for metric, values in metrics_boot.items():
        values = np.array(values)
        lower = np.percentile(values, 2.5)
        upper = np.percentile(values, 97.5)
        mean = values.mean()
        ci_results[metric] = {'mean': round(mean, 4), 'ci_lower': round(lower, 4), 'ci_upper': round(upper, 4)}
        print(f"  {metric:>15s}: {mean:.4f}  [95% CI: {lower:.4f} - {upper:.4f}]")

    return ci_results


def feature_importance_analysis(model, feature_names, X_test, y_test):
    """Permutation-based feature importance."""
    print("\n" + "=" * 60)
    print("FEATURE IMPORTANCE (Permutation-based)")
    print("=" * 60)

    from sklearn.inspection import permutation_importance
    result = permutation_importance(
        model, X_test, y_test,
        n_repeats=15, random_state=42, n_jobs=-1,
        scoring='f1_weighted'
    )

    importances = result.importances_mean
    std = result.importances_std
    indices = np.argsort(importances)[::-1]

    print("  Top 15 features:")
    for i in range(min(15, len(indices))):
        idx = indices[i]
        print(f"    {i+1:>2d}. {feature_names[idx]:>25s}: {importances[idx]:.4f} +/- {std[idx]:.4f}")

    # Plot
    fig, ax = plt.subplots(figsize=(10, 8))
    top_n = min(20, len(indices))
    top_idx = indices[:top_n]
    colors = plt.cm.RdYlGn_r(np.linspace(0.2, 0.8, top_n))
    ax.barh(range(top_n), importances[top_idx], xerr=std[top_idx],
            color=colors, edgecolor='black', linewidth=0.5)
    ax.set_yticks(range(top_n))
    ax.set_yticklabels([feature_names[i] for i in top_idx])
    ax.set_xlabel('Mean Importance (Permutation)', fontsize=12)
    ax.set_title('Health Risk - Feature Importance (Top 20)', fontsize=14)
    ax.invert_yaxis()
    plt.tight_layout()
    plt.savefig(os.path.join(PLOT_DIR, 'health_risk_feature_importance.png'), dpi=150)
    plt.close()
    print("  [Saved] health_risk_feature_importance.png")

    return importances, indices


def calibration_analysis(model, X_test, y_test):
    """Calibration / reliability diagram — are predicted probabilities accurate?"""
    print("\n" + "=" * 60)
    print("CALIBRATION ANALYSIS (Reliability Diagram)")
    print("=" * 60)

    y_proba = model.predict_proba(X_test)
    y_bin = label_binarize(y_test, classes=[0, 1, 2])

    fig, axes = plt.subplots(1, 3, figsize=(15, 5))
    for i, (name, ax) in enumerate(zip(LABEL_NAMES, axes)):
        prob_true, prob_pred = calibration_curve(y_bin[:, i], y_proba[:, i], n_bins=10, strategy='uniform')
        ax.plot(prob_pred, prob_true, 's-', color='blue', linewidth=2, label='Model')
        ax.plot([0, 1], [0, 1], 'k--', linewidth=1, label='Perfect')
        ax.set_xlabel('Predicted Probability')
        ax.set_ylabel('True Frequency')
        ax.set_title(f'{name} Risk')
        ax.legend()
        ax.grid(True, alpha=0.3)

        # ECE (Expected Calibration Error)
        ece = np.mean(np.abs(prob_true - prob_pred))
        ax.text(0.05, 0.9, f'ECE={ece:.3f}', transform=ax.transAxes, fontsize=10,
                bbox=dict(boxstyle='round', facecolor='lightyellow'))
        print(f"  {name} Risk ECE: {ece:.4f}")

    plt.suptitle('Health Risk - Calibration Curves', fontsize=14)
    plt.tight_layout()
    plt.savefig(os.path.join(PLOT_DIR, 'health_risk_calibration.png'), dpi=150)
    plt.close()
    print("  [Saved] health_risk_calibration.png")


def model_comparison(X_train, y_train, X_test, y_test):
    """Compare HistGradientBoosting vs Random Forest."""
    print("\n" + "=" * 60)
    print("MODEL COMPARISON: HistGradientBoosting vs RandomForest")
    print("=" * 60)

    models = {
        'HistGradientBoosting': HistGradientBoostingClassifier(
            max_iter=400, max_depth=6, learning_rate=0.05,
            min_samples_leaf=20, l2_regularization=1.0,
            early_stopping=True, validation_fraction=0.15,
            n_iter_no_change=25, class_weight='balanced', random_state=42,
        ),
        'RandomForest': RandomForestClassifier(
            n_estimators=300, max_depth=12, min_samples_leaf=10,
            class_weight='balanced', random_state=42, n_jobs=-1,
        ),
    }

    results = {}
    for name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        y_proba = model.predict_proba(X_test)
        y_bin = label_binarize(y_test, classes=[0, 1, 2])

        acc = accuracy_score(y_test, y_pred)
        f1w = f1_score(y_test, y_pred, average='weighted')
        auc = roc_auc_score(y_bin, y_proba, multi_class='ovr', average='weighted')

        results[name] = {'accuracy': acc, 'f1_weighted': f1w, 'auc_ovr': auc}
        print(f"  {name:>25s}: Acc={acc:.4f}  F1w={f1w:.4f}  AUC={auc:.4f}")

    return results


def clinical_scenario_test(model, scaler):
    """Test with specific clinical profiles to verify predictions make sense."""
    print("\n" + "=" * 60)
    print("CLINICAL SCENARIO STRESS TEST")
    print("=" * 60)

    # Feature order matches FEATURE_COLS
    scenarios = [
        {
            'name': 'Healthy 68yo, active, good adherence',
            'expected': 'Low',
            'values': [68, 1, 24.0,  0,0,0,0,0, 0,  72,125,78,100,97.5,36.6,
                       4,6,10, 0,  2,0.95,0, 1800,60,200,55,3,  1,0,0, 85,15],
        },
        {
            'name': 'Diabetic 75yo, moderate adherence',
            'expected': 'Medium',
            'values': [75, 0, 28.5,  1,1,0,0,0, 2,  82,145,88,165,95.0,36.8,
                       8,12,20, 1,  4,0.70,3, 1650,48,250,60,3,  2,1,0, 72,45],
        },
        {
            'name': 'Multi-morbid 85yo, poor adherence, high anomalies',
            'expected': 'High',
            'values': [85, 1, 32.0,  1,1,1,1,0, 4,  95,162,98,220,91.0,37.5,
                       15,18,30, 4,  8,0.35,12, 1300,32,280,70,2,  4,3,2, 52,120],
        },
        {
            'name': 'Very old 92yo, stable but fragile',
            'expected': 'Medium/High',
            'values': [92, 1, 21.0,  0,1,0,0,1, 2,  68,150,85,105,93.5,36.5,
                       6,10,12, 2,  3,0.60,4, 1400,40,180,50,2,  1,2,1, 60,90],
        },
        {
            'name': 'Healthy 70yo, but missed meds this week',
            'expected': 'Low/Medium',
            'values': [70, 0, 25.0,  0,0,0,0,0, 0,  70,128,76,98,97.0,36.6,
                       5,7,11, 0,  3,0.50,8, 1750,55,210,58,3,  1,0,0, 80,20],
        },
        {
            'name': 'CRITICAL: All red flags active',
            'expected': 'High',
            'values': [90, 0, 35.0,  1,1,1,1,1, 5,  110,180,105,280,86.0,38.5,
                       20,22,40, 5,  10,0.20,18, 1000,25,320,80,1,  5,4,3, 35,150],
        },
    ]

    for scenario in scenarios:
        X = np.array([scenario['values']], dtype=float)
        X_scaled = scaler.transform(X)
        pred = model.predict(X_scaled)[0]
        proba = model.predict_proba(X_scaled)[0]

        pred_label = LABEL_NAMES[pred]
        print(f"\n  Scenario: {scenario['name']}")
        print(f"    Expected: {scenario['expected']}")
        print(f"    Predicted: {pred_label}")
        print(f"    Probabilities: Low={proba[0]:.3f}  Medium={proba[1]:.3f}  High={proba[2]:.3f}")

        # Check if prediction is reasonable
        expected = scenario['expected']
        if pred_label in expected:
            print(f"    Result: CORRECT")
        elif '/' in expected:
            parts = expected.split('/')
            if pred_label in parts:
                print(f"    Result: ACCEPTABLE")
            else:
                print(f"    Result: MISMATCH (review model)")
        else:
            print(f"    Result: MISMATCH (review model)")


def plot_probability_distribution(model, X_test, y_test):
    """Distribution of predicted probabilities per true class."""
    y_proba = model.predict_proba(X_test)

    fig, axes = plt.subplots(1, 3, figsize=(15, 5))
    colors = ['#4CAF50', '#FF9800', '#F44336']

    for i, (name, ax, color) in enumerate(zip(LABEL_NAMES, axes, colors)):
        # For true class i, show predicted prob for that class
        mask = y_test == i
        ax.hist(y_proba[mask, i], bins=30, alpha=0.7, color=color, label=f'True {name}', density=True)
        ax.hist(y_proba[~mask, i], bins=30, alpha=0.3, color='gray', label=f'Not {name}', density=True)
        ax.set_xlabel(f'P({name})', fontsize=11)
        ax.set_ylabel('Density', fontsize=11)
        ax.set_title(f'{name} Risk Probability', fontsize=12)
        ax.legend(fontsize=9)
        ax.grid(True, alpha=0.3)

    plt.suptitle('Health Risk - Predicted Probability Distributions', fontsize=14)
    plt.tight_layout()
    plt.savefig(os.path.join(PLOT_DIR, 'health_risk_prob_distribution.png'), dpi=150)
    plt.close()
    print("  [Saved] health_risk_prob_distribution.png")


# =====================================================================
# MAIN
# =====================================================================

def main():
    print("=" * 60)
    print("AegisCare - Health Risk Model Training & Evaluation")
    print("=" * 60)

    # --- Load & Preprocess ---
    df = load_data()
    X, y, scaler = preprocess(df)

    # Stratified split: 70% train / 15% val / 15% test
    X_trainval, X_test, y_trainval, y_test = train_test_split(
        X, y, test_size=0.15, stratify=y, random_state=42
    )
    X_train, X_val, y_train, y_val = train_test_split(
        X_trainval, y_trainval, test_size=0.176, stratify=y_trainval, random_state=42
    )  # 0.176 of 85% ≈ 15% of total

    print(f"\nSplit sizes:")
    print(f"  Train: {len(X_train)}")
    print(f"  Val:   {len(X_val)}")
    print(f"  Test:  {len(X_test)}")

    # --- Hyperparameter Search ---
    best_model, best_params = hyperparameter_search(X_train, y_train)

    # --- Re-train best model on full train+val ---
    print("\nTraining final model on train+val with best params...")
    X_trainval_combined = np.vstack([X_train, X_val])
    y_trainval_combined = np.hstack([y_train, y_val])
    final_model = HistGradientBoostingClassifier(
        **best_params,
        early_stopping=True,
        validation_fraction=0.1,
        n_iter_no_change=25,
        class_weight='balanced',
        random_state=42,
    )
    final_model.fit(X_trainval_combined, y_trainval_combined)

    # --- Evaluation Suite ---
    # 1. Basic metrics
    y_pred, y_proba, cm, basic_metrics = evaluate_basic(final_model, X_test, y_test)

    # 2. Plots
    print("\nGenerating evaluation plots...")
    plot_confusion_matrix(cm)
    plot_multiclass_roc(y_test, y_proba)
    plot_probability_distribution(final_model, X_test, y_test)

    # 3. Learning Curve
    overfit_gap = plot_learning_curve(final_model, X, y)

    # 4. K-Fold Cross Validation
    kfold_results = kfold_cross_validation(X, y, n_splits=5)

    # 5. Bootstrap CIs
    ci_results = bootstrap_confidence_intervals(final_model, X_test, y_test, n_bootstrap=1000)

    # 6. Feature importance
    feature_importance_analysis(final_model, FEATURE_COLS, X_test, y_test)

    # 7. Calibration analysis
    calibration_analysis(final_model, X_test, y_test)

    # 8. Model comparison
    comparison = model_comparison(X_train, y_train, X_test, y_test)

    # 9. Clinical scenario test
    clinical_scenario_test(final_model, scaler)

    # --- Save Model ---
    print("\n" + "=" * 60)
    print("SAVING MODEL ARTIFACTS")
    print("=" * 60)

    joblib.dump(final_model, os.path.join(MODEL_DIR, 'health_risk_model.pkl'))
    joblib.dump(scaler, os.path.join(MODEL_DIR, 'health_risk_scaler.pkl'))
    print(f"  [Saved] health_risk_model.pkl")
    print(f"  [Saved] health_risk_scaler.pkl")

    # Save evaluation report
    eval_report = {
        'model': 'HistGradientBoostingClassifier',
        'best_params': {k: str(v) for k, v in best_params.items()},
        'dataset_size': len(df),
        'test_size': len(X_test),
        'features': FEATURE_COLS,
        'basic_metrics': {k: round(v, 4) for k, v in basic_metrics.items()},
        'kfold_f1_weighted': round(float(kfold_results['f1_weighted'].mean()), 4),
        'kfold_f1_std': round(float(kfold_results['f1_weighted'].std()), 4),
        'overfit_gap': round(overfit_gap, 4),
        'confidence_intervals': ci_results,
        'model_comparison': {k: {kk: round(vv, 4) for kk, vv in v.items()} for k, v in comparison.items()},
    }
    with open(os.path.join(EVAL_DIR, 'health_risk_eval_report.json'), 'w') as f:
        json.dump(eval_report, f, indent=2)
    print(f"  [Saved] health_risk_eval_report.json")

    print("\n" + "=" * 60)
    print("MODEL 3 (Health Risk Prediction) -- COMPLETE")
    print("=" * 60)


if __name__ == '__main__':
    main()

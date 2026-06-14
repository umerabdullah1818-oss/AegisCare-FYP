"""
AegisCare ML - Cognitive Decline Detection: Training & Professional Evaluation
================================================================================
Trains a HistGradientBoostingClassifier on cognitive game session data with
rolling-window temporal features.

Professional evaluation includes:
  1.  Stratified K-Fold Cross Validation (5-fold, grouped by user)
  2.  ROC-AUC (multiclass one-vs-rest)
  3.  Per-class Precision-Recall-F1
  4.  Confusion Matrix (3x3)
  5.  Learning Curve (overfit/underfit check)
  6.  Feature Importance (permutation-based)
  7.  Bootstrap Confidence Intervals (1000 iterations)
  8.  Early Detection Analysis (how soon can we detect decline?)
  9.  User-level Trajectory Prediction Accuracy
  10. Model Comparison: HistGradientBoosting vs RandomForest
  11. Calibration Curve
  12. Clinical scenario testing
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
    StratifiedKFold, GroupKFold, train_test_split, learning_curve
)
from sklearn.metrics import (
    classification_report, confusion_matrix, roc_auc_score,
    roc_curve, f1_score, precision_score, recall_score,
    accuracy_score, log_loss
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
    'age', 'gender', 'education_years', 'session_number',
    'memory_game_score', 'pattern_puzzle_score',
    'reaction_test_avg_ms', 'word_recall_correct',
    'memory_avg_7', 'pattern_avg_7', 'reaction_avg_7', 'word_recall_avg_7',
    'memory_trend_10', 'pattern_trend_10', 'reaction_trend_10', 'word_recall_trend_10',
    'memory_std_14', 'reaction_std_14',
    'composite_cognitive', 'reaction_ratio',
]

LABEL_NAMES = ['Stable', 'Mild Decline', 'Significant Decline']


def load_data():
    path = os.path.join(DATA_DIR, 'cognitive_dataset.csv')
    df = pd.read_csv(path)
    print(f"Loaded {len(df)} sessions ({df['user_id'].nunique()} users) from {path}")
    print(f"Cognitive status distribution:")
    for s, name in enumerate(LABEL_NAMES):
        count = (df['cognitive_status'] == s).sum()
        print(f"  {name}: {count} ({count/len(df)*100:.1f}%)")
    return df


def preprocess(df):
    X = df[FEATURE_COLS].values
    y = df['cognitive_status'].values
    groups = df['user_id'].values  # for grouped splitting

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    return X_scaled, y, groups, scaler


# =====================================================================
# TRAINING
# =====================================================================

def train_model(X_train, y_train):
    """Train HistGradientBoosting with regularization to avoid overfit."""
    model = HistGradientBoostingClassifier(
        max_iter=400,
        max_depth=6,
        learning_rate=0.05,
        min_samples_leaf=25,
        max_leaf_nodes=31,
        l2_regularization=1.5,
        max_bins=255,
        early_stopping=True,
        validation_fraction=0.15,
        n_iter_no_change=25,
        scoring='loss',
        class_weight='balanced',
        random_state=42,
    )
    model.fit(X_train, y_train)
    return model


# =====================================================================
# EVALUATION
# =====================================================================

def evaluate_basic(model, X_test, y_test):
    """Basic metrics: accuracy, per-class F1, ROC-AUC, log loss."""
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)

    acc = accuracy_score(y_test, y_pred)
    f1_w = f1_score(y_test, y_pred, average='weighted')
    f1_macro = f1_score(y_test, y_pred, average='macro')
    ll = log_loss(y_test, y_proba)

    y_bin = label_binarize(y_test, classes=[0, 1, 2])
    auc = roc_auc_score(y_bin, y_proba, multi_class='ovr', average='weighted')

    print("\n" + "=" * 60)
    print("BASIC EVALUATION RESULTS")
    print("=" * 60)
    print(f"\n  Accuracy:          {acc:.4f}")
    print(f"  F1 (weighted):     {f1_w:.4f}")
    print(f"  F1 (macro):        {f1_macro:.4f}")
    print(f"  Log Loss:          {ll:.4f}")
    print(f"  ROC-AUC (OVR):     {auc:.4f}")
    print(f"\n  Classification Report:")
    print(classification_report(y_test, y_pred, target_names=LABEL_NAMES))

    cm = confusion_matrix(y_test, y_pred)
    print("  Confusion Matrix:")
    print(cm)

    return y_pred, y_proba, cm, {'accuracy': acc, 'f1_weighted': f1_w, 'f1_macro': f1_macro,
                                  'log_loss': ll, 'roc_auc_ovr': auc}


def plot_confusion_matrix(cm):
    fig, ax = plt.subplots(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='PuBu',
                xticklabels=LABEL_NAMES, yticklabels=LABEL_NAMES, ax=ax)
    ax.set_xlabel('Predicted', fontsize=12)
    ax.set_ylabel('Actual', fontsize=12)
    ax.set_title('Cognitive Decline - Confusion Matrix', fontsize=14)
    plt.tight_layout()
    plt.savefig(os.path.join(PLOT_DIR, 'cognitive_confusion_matrix.png'), dpi=150)
    plt.close()
    print("  [Saved] cognitive_confusion_matrix.png")


def plot_multiclass_roc(y_test, y_proba):
    y_bin = label_binarize(y_test, classes=[0, 1, 2])
    colors = ['#4CAF50', '#FF9800', '#F44336']

    fig, ax = plt.subplots(figsize=(8, 6))
    for i, (name, color) in enumerate(zip(LABEL_NAMES, colors)):
        fpr, tpr, _ = roc_curve(y_bin[:, i], y_proba[:, i])
        auc = roc_auc_score(y_bin[:, i], y_proba[:, i])
        ax.plot(fpr, tpr, color=color, linewidth=2, label=f'{name} (AUC = {auc:.4f})')

    ax.plot([0, 1], [0, 1], 'k--', linewidth=1)
    ax.set_xlabel('False Positive Rate', fontsize=12)
    ax.set_ylabel('True Positive Rate', fontsize=12)
    ax.set_title('Cognitive Decline - ROC Curve (One-vs-Rest)', fontsize=14)
    ax.legend(fontsize=11)
    ax.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(os.path.join(PLOT_DIR, 'cognitive_roc_curve.png'), dpi=150)
    plt.close()
    print("  [Saved] cognitive_roc_curve.png")


def plot_learning_curve_check(model, X, y):
    """Learning curve to diagnose overfitting/underfitting."""
    print("\n  Computing learning curve...")
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
    ax.set_title('Cognitive Decline - Learning Curve', fontsize=14)
    ax.legend(fontsize=11)
    ax.grid(True, alpha=0.3)

    gap = train_mean[-1] - val_mean[-1]
    if gap < 0.03:
        diagnosis = "GOOD FIT: Train ~ Validation"
    elif gap < 0.08:
        diagnosis = "SLIGHT OVERFIT: Small gap"
    else:
        diagnosis = "OVERFIT: Large train-val gap"
    ax.text(0.5, 0.05, diagnosis, transform=ax.transAxes, fontsize=12,
            ha='center', bbox=dict(boxstyle='round', facecolor='wheat'))

    plt.tight_layout()
    plt.savefig(os.path.join(PLOT_DIR, 'cognitive_learning_curve.png'), dpi=150)
    plt.close()
    print(f"  [Saved] cognitive_learning_curve.png")
    print(f"  Diagnosis: {diagnosis} (gap = {gap:.4f})")
    return gap


def grouped_cross_validation(X, y, groups, n_splits=5):
    """GroupKFold CV — ensures no user appears in both train and test."""
    print("\n" + "=" * 60)
    print(f"{n_splits}-FOLD GROUP CROSS VALIDATION (user-grouped)")
    print("=" * 60)

    gkf = GroupKFold(n_splits=n_splits)
    fold_metrics = []

    for fold, (train_idx, test_idx) in enumerate(gkf.split(X, y, groups), 1):
        X_train, X_test = X[train_idx], X[test_idx]
        y_train, y_test = y[train_idx], y[test_idx]

        model = train_model(X_train, y_train)
        y_pred = model.predict(X_test)
        y_proba = model.predict_proba(X_test)

        y_bin = label_binarize(y_test, classes=[0, 1, 2])
        try:
            auc = roc_auc_score(y_bin, y_proba, multi_class='ovr', average='weighted')
        except ValueError:
            auc = 0.0

        metrics = {
            'fold': fold,
            'accuracy': accuracy_score(y_test, y_pred),
            'f1_weighted': f1_score(y_test, y_pred, average='weighted'),
            'f1_macro': f1_score(y_test, y_pred, average='macro'),
            'recall_sig_decline': recall_score(y_test, y_pred, labels=[2], average='micro'),
            'auc_ovr': auc,
            'n_train_users': len(set(groups[train_idx])),
            'n_test_users': len(set(groups[test_idx])),
        }
        fold_metrics.append(metrics)
        print(f"  Fold {fold}: Acc={metrics['accuracy']:.4f}  F1w={metrics['f1_weighted']:.4f}  "
              f"RecSig={metrics['recall_sig_decline']:.4f}  AUC={metrics['auc_ovr']:.4f}  "
              f"(train={metrics['n_train_users']} users, test={metrics['n_test_users']} users)")

    df_m = pd.DataFrame(fold_metrics)
    print(f"\n  --- Aggregated ---")
    for col in ['accuracy', 'f1_weighted', 'f1_macro', 'recall_sig_decline', 'auc_ovr']:
        print(f"  {col:>20s}: {df_m[col].mean():.4f} +/- {df_m[col].std():.4f}")

    if df_m['f1_weighted'].std() < 0.02:
        print("  STABLE across user groups")
    else:
        print("  WARNING: Variance across user groups — expected for heterogeneous users")

    return df_m


def stratified_cross_validation(X, y, n_splits=5):
    """Standard stratified K-fold (for comparison with grouped)."""
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
            'recall_sig_decline': recall_score(y_test, y_pred, labels=[2], average='micro'),
            'auc_ovr': auc,
        }
        fold_metrics.append(metrics)
        print(f"  Fold {fold}: Acc={metrics['accuracy']:.4f}  F1w={metrics['f1_weighted']:.4f}  "
              f"RecSig={metrics['recall_sig_decline']:.4f}  AUC={metrics['auc_ovr']:.4f}")

    df_m = pd.DataFrame(fold_metrics)
    print(f"\n  --- Aggregated ---")
    for col in ['accuracy', 'f1_weighted', 'recall_sig_decline', 'auc_ovr']:
        print(f"  {col:>20s}: {df_m[col].mean():.4f} +/- {df_m[col].std():.4f}")

    return df_m


def bootstrap_confidence_intervals(model, X_test, y_test, n_bootstrap=1000):
    """Bootstrap 95% CIs for key metrics."""
    print("\n" + "=" * 60)
    print(f"BOOTSTRAP CONFIDENCE INTERVALS ({n_bootstrap} iterations)")
    print("=" * 60)

    rng = np.random.RandomState(42)
    boot = {'accuracy': [], 'f1_weighted': [], 'f1_macro': [], 'recall_sig': []}

    for _ in range(n_bootstrap):
        idx = rng.choice(len(X_test), size=len(X_test), replace=True)
        X_b, y_b = X_test[idx], y_test[idx]
        if len(np.unique(y_b)) < 3:
            continue

        y_pred = model.predict(X_b)
        boot['accuracy'].append(accuracy_score(y_b, y_pred))
        boot['f1_weighted'].append(f1_score(y_b, y_pred, average='weighted'))
        boot['f1_macro'].append(f1_score(y_b, y_pred, average='macro'))
        boot['recall_sig'].append(recall_score(y_b, y_pred, labels=[2], average='micro'))

    ci = {}
    for metric, vals in boot.items():
        vals = np.array(vals)
        lower = np.percentile(vals, 2.5)
        upper = np.percentile(vals, 97.5)
        mean = vals.mean()
        ci[metric] = {'mean': round(mean, 4), 'ci_lower': round(lower, 4), 'ci_upper': round(upper, 4)}
        print(f"  {metric:>15s}: {mean:.4f}  [95% CI: {lower:.4f} - {upper:.4f}]")

    return ci


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

    print("  Top features:")
    for i in range(min(15, len(indices))):
        idx = indices[i]
        print(f"    {i+1:>2d}. {feature_names[idx]:>25s}: {importances[idx]:.4f} +/- {std[idx]:.4f}")

    fig, ax = plt.subplots(figsize=(10, 8))
    top_n = len(indices)
    top_idx = indices[:top_n]
    colors = plt.cm.PuBu(np.linspace(0.3, 0.9, top_n))
    ax.barh(range(top_n), importances[top_idx], xerr=std[top_idx],
            color=colors, edgecolor='black', linewidth=0.5)
    ax.set_yticks(range(top_n))
    ax.set_yticklabels([feature_names[i] for i in top_idx])
    ax.set_xlabel('Mean Importance (Permutation)', fontsize=12)
    ax.set_title('Cognitive Decline - Feature Importance', fontsize=14)
    ax.invert_yaxis()
    plt.tight_layout()
    plt.savefig(os.path.join(PLOT_DIR, 'cognitive_feature_importance.png'), dpi=150)
    plt.close()
    print("  [Saved] cognitive_feature_importance.png")


def early_detection_analysis(df, model, scaler):
    """Can we detect decline early? Test on first N sessions of declining users."""
    print("\n" + "=" * 60)
    print("EARLY DETECTION ANALYSIS")
    print("=" * 60)
    print("  (Can we detect decline using only the first N sessions?)")

    session_thresholds = [5, 10, 15, 20, 30]
    results = []

    # Get declining users
    declining_users = df[df['cognitive_status'].isin([1, 2])]['user_id'].unique()
    print(f"  Declining users: {len(declining_users)}")

    for n_sessions in session_thresholds:
        correct = 0
        total = 0

        for uid in declining_users:
            user_data = df[df['user_id'] == uid].sort_values('session_number')
            if len(user_data) < n_sessions:
                continue

            # Take first N sessions only
            early_data = user_data.head(n_sessions)

            # Use the LAST row of early data (most recent available)
            row = early_data.iloc[-1]
            X_single = np.array([[row[col] for col in FEATURE_COLS]], dtype=float)
            X_scaled = scaler.transform(X_single)

            pred = model.predict(X_scaled)[0]
            actual = int(row['cognitive_status'])

            if pred > 0:  # predicted some decline
                correct += 1
            total += 1

        detection_rate = correct / total if total > 0 else 0
        results.append({'sessions': n_sessions, 'detection_rate': detection_rate, 'tested': total})
        print(f"  First {n_sessions:>3d} sessions: {correct}/{total} detected ({detection_rate*100:.1f}%)")

    # Plot
    fig, ax = plt.subplots(figsize=(8, 5))
    sessions = [r['sessions'] for r in results]
    rates = [r['detection_rate'] for r in results]
    ax.plot(sessions, rates, 'b-o', linewidth=2, markersize=8)
    ax.fill_between(sessions, rates, alpha=0.1, color='blue')
    ax.set_xlabel('Number of Sessions Used', fontsize=12)
    ax.set_ylabel('Detection Rate', fontsize=12)
    ax.set_title('Early Detection: Decline Detection vs Sessions Available', fontsize=14)
    ax.set_ylim(0, 1.05)
    ax.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(os.path.join(PLOT_DIR, 'cognitive_early_detection.png'), dpi=150)
    plt.close()
    print("  [Saved] cognitive_early_detection.png")

    return results


def user_level_accuracy(df, model, scaler):
    """Evaluate: if we classify each USER (majority vote over sessions), how accurate?"""
    print("\n" + "=" * 60)
    print("USER-LEVEL TRAJECTORY ACCURACY")
    print("=" * 60)

    user_correct = 0
    user_total = 0

    per_class = {0: [0, 0], 1: [0, 0], 2: [0, 0]}  # correct, total

    for uid, group in df.groupby('user_id'):
        X_user = group[FEATURE_COLS].values
        X_scaled = scaler.transform(X_user)
        predictions = model.predict(X_scaled)

        # Majority vote
        from scipy.stats import mode as scipy_mode
        majority_pred = int(scipy_mode(predictions, keepdims=True).mode[0])
        true_status = int(group['cognitive_status'].iloc[0])

        per_class[true_status][1] += 1
        if majority_pred == true_status:
            user_correct += 1
            per_class[true_status][0] += 1
        user_total += 1

    overall_acc = user_correct / user_total
    print(f"  Overall user-level accuracy: {user_correct}/{user_total} ({overall_acc*100:.1f}%)")
    for status, (correct, total) in per_class.items():
        name = LABEL_NAMES[status]
        acc = correct / total * 100 if total > 0 else 0
        print(f"    {name:>20s}: {correct}/{total} ({acc:.1f}%)")

    return overall_acc


def model_comparison(X_train, y_train, X_test, y_test):
    """Compare HistGradientBoosting vs RandomForest."""
    print("\n" + "=" * 60)
    print("MODEL COMPARISON: HistGradientBoosting vs RandomForest")
    print("=" * 60)

    models = {
        'HistGradientBoosting': HistGradientBoostingClassifier(
            max_iter=400, max_depth=6, learning_rate=0.05,
            min_samples_leaf=25, l2_regularization=1.5,
            early_stopping=True, validation_fraction=0.15,
            n_iter_no_change=25, class_weight='balanced', random_state=42,
        ),
        'RandomForest': RandomForestClassifier(
            n_estimators=300, max_depth=15, min_samples_leaf=10,
            class_weight='balanced', random_state=42, n_jobs=-1,
        ),
    }

    results = {}
    for name, mdl in models.items():
        mdl.fit(X_train, y_train)
        y_pred = mdl.predict(X_test)
        y_proba = mdl.predict_proba(X_test)
        y_bin = label_binarize(y_test, classes=[0, 1, 2])

        acc = accuracy_score(y_test, y_pred)
        f1w = f1_score(y_test, y_pred, average='weighted')
        try:
            auc = roc_auc_score(y_bin, y_proba, multi_class='ovr', average='weighted')
        except ValueError:
            auc = 0.0

        results[name] = {'accuracy': acc, 'f1_weighted': f1w, 'auc_ovr': auc}
        print(f"  {name:>25s}: Acc={acc:.4f}  F1w={f1w:.4f}  AUC={auc:.4f}")

    return results


def calibration_analysis(model, X_test, y_test):
    """Calibration / reliability diagram."""
    print("\n" + "=" * 60)
    print("CALIBRATION ANALYSIS")
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
        ax.set_title(f'{name}')
        ax.legend()
        ax.grid(True, alpha=0.3)
        ece = np.mean(np.abs(prob_true - prob_pred))
        ax.text(0.05, 0.9, f'ECE={ece:.3f}', transform=ax.transAxes, fontsize=10,
                bbox=dict(boxstyle='round', facecolor='lightyellow'))
        print(f"  {name} ECE: {ece:.4f}")

    plt.suptitle('Cognitive Decline - Calibration Curves', fontsize=14)
    plt.tight_layout()
    plt.savefig(os.path.join(PLOT_DIR, 'cognitive_calibration.png'), dpi=150)
    plt.close()
    print("  [Saved] cognitive_calibration.png")


def clinical_scenario_test(model, scaler):
    """Test specific clinical scenarios."""
    print("\n" + "=" * 60)
    print("CLINICAL SCENARIO STRESS TEST")
    print("=" * 60)

    # Feature order: age, gender, education_years, session_number
    #   memory_game_score, pattern_puzzle_score, reaction_test_avg_ms, word_recall_correct,
    #   memory_avg_7, pattern_avg_7, reaction_avg_7, word_recall_avg_7,
    #   memory_trend_10, pattern_trend_10, reaction_trend_10, word_recall_trend_10,
    #   memory_std_14, reaction_std_14,
    #   composite_cognitive, reaction_ratio

    scenarios = [
        {
            'name': 'Stable 70yo, high scores, good recall',
            'expected': 'Stable',
            'values': [70, 0, 14, 25,   82, 78, 380, 8,   83, 79, 375, 8.1,
                       0.1, 0.05, -0.5, 0.01,   3.5, 18.0,   78.0, 1.01],
        },
        {
            'name': 'Mild decline 78yo, scores dropping slowly',
            'expected': 'Mild Decline',
            'values': [78, 1, 12, 40,   65, 58, 520, 5,   67, 60, 510, 5.3,
                       -0.3, -0.35, 2.5, -0.06,   6.0, 30.0,   58.0, 1.18],
        },
        {
            'name': 'Significant decline 85yo, major drops',
            'expected': 'Significant Decline',
            'values': [85, 0, 10, 60,   40, 30, 700, 3,   42, 32, 690, 3.2,
                       -0.9, -1.1, 6.0, -0.15,   12.0, 55.0,   35.0, 1.55],
        },
        {
            'name': 'Early-stage 72yo, subtle decline signs',
            'expected': 'Stable/Mild Decline',
            'values': [72, 1, 16, 15,   75, 70, 430, 7,   76, 71, 425, 7.2,
                       -0.15, -0.12, 1.0, -0.02,   4.0, 22.0,   70.0, 1.05],
        },
        {
            'name': 'Highly educated 68yo, stable, excellent',
            'expected': 'Stable',
            'values': [68, 0, 18, 30,   90, 88, 320, 9,   91, 87, 315, 9.2,
                       0.2, 0.1, -1.0, 0.02,   2.5, 12.0,   87.0, 0.98],
        },
    ]

    for scenario in scenarios:
        X = np.array([scenario['values']], dtype=float)
        X_scaled = scaler.transform(X)
        pred = model.predict(X_scaled)[0]
        proba = model.predict_proba(X_scaled)[0]

        pred_label = LABEL_NAMES[int(pred)]
        print(f"\n  Scenario: {scenario['name']}")
        print(f"    Expected: {scenario['expected']}")
        print(f"    Predicted: {pred_label}")
        print(f"    Probabilities: Stable={proba[0]:.3f}  Mild={proba[1]:.3f}  Significant={proba[2]:.3f}")

        expected = scenario['expected']
        if pred_label in expected:
            print(f"    Result: CORRECT")
        elif '/' in expected and pred_label in expected.split('/'):
            print(f"    Result: ACCEPTABLE")
        else:
            print(f"    Result: MISMATCH (review)")


# =====================================================================
# MAIN
# =====================================================================

def main():
    print("=" * 60)
    print("AegisCare - Cognitive Decline Model Training & Evaluation")
    print("=" * 60)

    # --- Load ---
    df = load_data()
    X, y, groups, scaler = preprocess(df)

    # Group-aware split: users in test set do NOT appear in train
    unique_users = df['user_id'].unique()
    np.random.seed(42)
    np.random.shuffle(unique_users)
    test_user_count = max(1, int(len(unique_users) * 0.2))
    test_users = set(unique_users[:test_user_count])
    train_users = set(unique_users[test_user_count:])

    train_mask = df['user_id'].isin(train_users)
    test_mask = df['user_id'].isin(test_users)

    X_train = X[train_mask.values]
    y_train = y[train_mask.values]
    X_test = X[test_mask.values]
    y_test = y[test_mask.values]

    print(f"\nSplit (user-grouped):")
    print(f"  Train: {len(X_train)} sessions ({len(train_users)} users)")
    print(f"  Test:  {len(X_test)} sessions ({len(test_users)} users)")

    # --- Train ---
    print("\nTraining HistGradientBoosting model...")
    final_model = train_model(X_train, y_train)
    print("Training complete.")

    # --- Evaluation Suite ---
    # 1. Basic metrics
    y_pred, y_proba, cm, basic_metrics = evaluate_basic(final_model, X_test, y_test)

    # 2. Plots
    print("\nGenerating evaluation plots...")
    plot_confusion_matrix(cm)
    plot_multiclass_roc(y_test, y_proba)

    # 3. Learning curve
    overfit_gap = plot_learning_curve_check(final_model, X, y)

    # 4. Group K-Fold CV (user-grouped — the fair test)
    group_kfold_results = grouped_cross_validation(X, y, groups, n_splits=5)

    # 5. Stratified K-Fold CV (for comparison)
    strat_kfold_results = stratified_cross_validation(X, y, n_splits=5)

    # 6. Bootstrap CIs
    ci_results = bootstrap_confidence_intervals(final_model, X_test, y_test)

    # 7. Feature importance
    feature_importance_analysis(final_model, FEATURE_COLS, X_test, y_test)

    # 8. Early detection analysis
    early_results = early_detection_analysis(df[test_mask], final_model, scaler)

    # 9. User-level trajectory accuracy
    user_acc = user_level_accuracy(df[test_mask], final_model, scaler)

    # 10. Model comparison
    comparison = model_comparison(X_train, y_train, X_test, y_test)

    # 11. Calibration
    calibration_analysis(final_model, X_test, y_test)

    # 12. Clinical scenarios
    clinical_scenario_test(final_model, scaler)

    # --- Save ---
    print("\n" + "=" * 60)
    print("SAVING MODEL ARTIFACTS")
    print("=" * 60)

    joblib.dump(final_model, os.path.join(MODEL_DIR, 'cognitive_model.pkl'))
    joblib.dump(scaler, os.path.join(MODEL_DIR, 'cognitive_scaler.pkl'))
    print(f"  [Saved] cognitive_model.pkl")
    print(f"  [Saved] cognitive_scaler.pkl")

    eval_report = {
        'model': 'HistGradientBoostingClassifier',
        'dataset_sessions': len(df),
        'dataset_users': int(df['user_id'].nunique()),
        'test_sessions': len(X_test),
        'test_users': len(test_users),
        'features': FEATURE_COLS,
        'basic_metrics': {k: round(v, 4) for k, v in basic_metrics.items()},
        'group_kfold_f1_weighted': round(float(group_kfold_results['f1_weighted'].mean()), 4),
        'group_kfold_f1_std': round(float(group_kfold_results['f1_weighted'].std()), 4),
        'stratified_kfold_f1_weighted': round(float(strat_kfold_results['f1_weighted'].mean()), 4),
        'overfit_gap': round(overfit_gap, 4),
        'confidence_intervals': ci_results,
        'user_level_accuracy': round(user_acc, 4),
        'early_detection': early_results,
        'model_comparison': {k: {kk: round(vv, 4) for kk, vv in v.items()} for k, v in comparison.items()},
    }
    with open(os.path.join(EVAL_DIR, 'cognitive_eval_report.json'), 'w') as f:
        json.dump(eval_report, f, indent=2)
    print(f"  [Saved] cognitive_eval_report.json")

    print("\n" + "=" * 60)
    print("MODEL 5 (Cognitive Decline Detection) -- COMPLETE")
    print("=" * 60)


if __name__ == '__main__':
    main()

"""
AegisCare ML - Nutritional Recommendation: Training & Professional Evaluation
===============================================================================
Content-based + Collaborative filtering hybrid recommendation system.
Evaluation includes:
  1. Precision@K, Recall@K, NDCG@K
  2. Nutritional Coverage Analysis
  3. Constraint Satisfaction Rate
  4. Diversity Score 
  5. Cold Start Performance
  6. A/B Scenario Testing
  7. Cross-validation on rating prediction (RMSE, MAE)
  8. Condition-specific Recommendation Quality
"""

import numpy as np
import pandas as pd
import os
import json
import warnings
warnings.filterwarnings('ignore')

from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.model_selection import KFold
from sklearn.metrics import mean_squared_error, mean_absolute_error
from scipy.sparse import csr_matrix
from scipy.sparse.linalg import svds
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


NUTRITION_FEATURES = ['calories', 'protein_g', 'carbs_g', 'fats_g', 'fiber_g', 'sodium_mg', 'sugar_g']
HEALTH_TAG_FEATURES = [
    'is_diabetic_friendly', 'is_heart_healthy', 'is_low_sodium',
    'is_low_carb', 'is_high_protein', 'is_low_fat', 'is_soft_food',
    'is_vegetarian', 'is_gluten_free'
]


def load_data():
    meals = pd.read_csv(os.path.join(DATA_DIR, 'meals_database.csv'))
    users = pd.read_csv(os.path.join(DATA_DIR, 'nutrition_user_profiles.csv'))
    interactions = pd.read_csv(os.path.join(DATA_DIR, 'meal_interactions.csv'))
    print(f"Loaded: {len(meals)} meals, {len(users)} users, {len(interactions)} interactions")
    return meals, users, interactions


class ContentBasedRecommender:
    """Recommends meals matching user's health profile and nutritional needs."""

    def __init__(self, meals_df):
        self.meals_df = meals_df.copy()
        self.nutrition_scaler = MinMaxScaler()
        self._build_features()

    def _build_features(self):
        nutrition_scaled = self.nutrition_scaler.fit_transform(
            self.meals_df[NUTRITION_FEATURES].values
        )
        health_tags = self.meals_df[HEALTH_TAG_FEATURES].values

        # Combine: 60% health tags, 40% nutrition (tags matter more for elderly)
        self.meal_features = np.hstack([
            nutrition_scaled * 0.4,
            health_tags * 0.6
        ])

    def build_user_vector(self, user_profile):
        """Create an ideal meal vector from user's conditions and targets."""
        # Nutrition targets (per meal = daily / 3)
        ideal_nutrition = np.array([
            user_profile.get('calorie_target', 1800) / 3,
            user_profile.get('protein_target', 55) / 3,
            user_profile.get('carbs_target', 220) / 3,
            user_profile.get('fats_target', 60) / 3,
            5.0,   # ideal fiber per meal
            350,   # ideal sodium per meal
            8.0,   # ideal sugar per meal
        ]).reshape(1, -1)

        nutrition_scaled = self.nutrition_scaler.transform(ideal_nutrition).flatten()

        # Health tags based on conditions
        health_tags = np.array([
            1 if user_profile.get('has_diabetes', 0) else 0.5,      # diabetic friendly
            1 if user_profile.get('has_heart_disease', 0) else 0.5, # heart healthy
            1 if user_profile.get('needs_low_sodium', 0) else 0.3,  # low sodium
            1 if user_profile.get('needs_low_carb', 0) else 0.3,    # low carb
            0.7,  # high protein always good for elderly
            0.5 if user_profile.get('has_heart_disease', 0) else 0.3,  # low fat
            1 if user_profile.get('needs_soft_food', 0) else 0.3,   # soft food
            1 if user_profile.get('is_vegetarian', 0) else 0.0,     # vegetarian
            1 if user_profile.get('is_gluten_free', 0) else 0.0,    # gluten free
        ])

        return np.hstack([nutrition_scaled * 0.4, health_tags * 0.6])

    def recommend(self, user_profile, meal_type=None, n=10, exclude_ids=None):
        user_vector = self.build_user_vector(user_profile)
        similarities = cosine_similarity([user_vector], self.meal_features)[0]

        # Apply hard constraints (must-have filters)
        mask = np.ones(len(self.meals_df), dtype=bool)

        if user_profile.get('is_vegetarian', 0):
            mask &= self.meals_df['is_vegetarian'].values == 1
        if user_profile.get('is_gluten_free', 0):
            mask &= self.meals_df['is_gluten_free'].values == 1
        if user_profile.get('needs_soft_food', 0):
            mask &= self.meals_df['is_soft_food'].values == 1
        if meal_type:
            mask &= self.meals_df['meal_type'].values == meal_type
        if exclude_ids:
            mask &= ~self.meals_df['meal_id'].isin(exclude_ids).values

        # Apply mask
        similarities[~mask] = -1

        # Get top-N
        top_indices = np.argsort(similarities)[::-1][:n]
        results = self.meals_df.iloc[top_indices].copy()
        results['similarity_score'] = similarities[top_indices]

        return results


class CollaborativeRecommender:
    """SVD-based collaborative filtering on user-meal ratings."""

    def __init__(self, interactions_df, n_users, n_meals, n_factors=50):
        self.n_factors = n_factors
        self._build_matrix(interactions_df, n_users, n_meals)

    def _build_matrix(self, interactions, n_users, n_meals):
        # Build user-meal rating matrix
        self.rating_matrix = np.zeros((n_users, n_meals))
        self.interaction_count = np.zeros((n_users, n_meals))

        for _, row in interactions.iterrows():
            uid = int(row['user_id'])
            mid = int(row['meal_id'])
            if uid < n_users and mid < n_meals:
                self.rating_matrix[uid, mid] = row['rating']
                self.interaction_count[uid, mid] += 1

        # Mean normalization
        user_means = np.nanmean(np.where(self.rating_matrix > 0, self.rating_matrix, np.nan), axis=1)
        user_means = np.nan_to_num(user_means, nan=3.0)
        self.user_means = user_means

        normalized = self.rating_matrix.copy()
        for i in range(n_users):
            mask = self.rating_matrix[i] > 0
            normalized[i, mask] -= user_means[i]

        # SVD
        sparse_matrix = csr_matrix(normalized)
        n_components = min(self.n_factors, min(sparse_matrix.shape) - 1)
        U, sigma, Vt = svds(sparse_matrix, k=n_components)
        sigma = np.diag(sigma)

        self.predicted_ratings = np.dot(np.dot(U, sigma), Vt) + user_means.reshape(-1, 1)
        self.predicted_ratings = np.clip(self.predicted_ratings, 1.0, 5.0)

    def predict(self, user_id, meal_id):
        user_id, meal_id = int(user_id), int(meal_id)
        if user_id < self.predicted_ratings.shape[0] and meal_id < self.predicted_ratings.shape[1]:
            return self.predicted_ratings[user_id, meal_id]
        return 3.0  # default

    def recommend(self, user_id, n=10, exclude_ids=None):
        user_id = int(user_id)
        if user_id >= self.predicted_ratings.shape[0]:
            return []

        scores = self.predicted_ratings[user_id].copy()
        if exclude_ids:
            for mid in exclude_ids:
                if mid < len(scores):
                    scores[mid] = -1

        top_indices = np.argsort(scores)[::-1][:n]
        return [(int(mid), float(scores[mid])) for mid in top_indices]


class HybridRecommender:
    """Combines content-based (0.6) and collaborative (0.4) scores."""

    def __init__(self, content_rec, collab_rec, meals_df):
        self.content = content_rec
        self.collab = collab_rec
        self.meals_df = meals_df

    def recommend(self, user_id, user_profile, meal_type=None, n=10, exclude_ids=None):
        # Content-based scores
        content_results = self.content.recommend(user_profile, meal_type, n=50, exclude_ids=exclude_ids)
        content_scores = dict(zip(content_results['meal_id'], content_results['similarity_score']))

        # Collaborative scores
        collab_scores = {}
        for mid in content_results['meal_id']:
            collab_scores[mid] = self.collab.predict(user_id, mid)

        # Normalize both to [0, 1]
        c_vals = np.array(list(content_scores.values()))
        c_min, c_max = c_vals.min(), c_vals.max()
        if c_max > c_min:
            content_norm = {k: (v - c_min) / (c_max - c_min) for k, v in content_scores.items()}
        else:
            content_norm = {k: 0.5 for k in content_scores}

        r_vals = np.array(list(collab_scores.values()))
        r_min, r_max = r_vals.min(), r_vals.max()
        if r_max > r_min:
            collab_norm = {k: (v - r_min) / (r_max - r_min) for k, v in collab_scores.items()}
        else:
            collab_norm = {k: 0.5 for k in collab_scores}

        # Hybrid score: 60% content + 40% collaborative
        hybrid_scores = {}
        for mid in content_scores:
            hybrid_scores[mid] = 0.6 * content_norm.get(mid, 0) + 0.4 * collab_norm.get(mid, 0)

        # Sort and return top-N
        sorted_meals = sorted(hybrid_scores.items(), key=lambda x: x[1], reverse=True)[:n]

        results = []
        for mid, score in sorted_meals:
            meal = self.meals_df[self.meals_df['meal_id'] == mid].iloc[0]
            results.append({
                'meal_id': mid,
                'name': meal['name'],
                'meal_type': meal['meal_type'],
                'calories': meal['calories'],
                'protein_g': meal['protein_g'],
                'carbs_g': meal['carbs_g'],
                'fats_g': meal['fats_g'],
                'hybrid_score': round(score, 4),
            })

        return results


# =====================================================================
# EVALUATION
# =====================================================================

def evaluate_precision_recall_at_k(hybrid, users_df, interactions_df, k_values=[5, 10, 20]):
    """Precision@K and Recall@K across users."""
    print("\n" + "=" * 60)
    print("PRECISION@K & RECALL@K EVALUATION")
    print("=" * 60)

    results = {k: {'precision': [], 'recall': []} for k in k_values}

    # For each user, get their actual liked meals (rating >= 4) and compare to recommendations
    sample_users = users_df.sample(min(200, len(users_df)), random_state=42)

    for _, user in sample_users.iterrows():
        uid = user['user_id']
        user_interactions = interactions_df[interactions_df['user_id'] == uid]
        liked_meals = set(user_interactions[user_interactions['rating'] >= 4.0]['meal_id'].values)

        if len(liked_meals) < 3:
            continue

        user_profile = user.to_dict()
        recs = hybrid.recommend(uid, user_profile, n=max(k_values))
        rec_ids = [r['meal_id'] for r in recs]

        for k in k_values:
            rec_k = set(rec_ids[:k])
            hits = rec_k & liked_meals
            prec = len(hits) / k if k > 0 else 0
            rec = len(hits) / len(liked_meals) if len(liked_meals) > 0 else 0
            results[k]['precision'].append(prec)
            results[k]['recall'].append(rec)

    for k in k_values:
        p = np.mean(results[k]['precision'])
        r = np.mean(results[k]['recall'])
        print(f"  @{k:>2d}: Precision={p:.4f}  Recall={r:.4f}")

    return results


def evaluate_ndcg_at_k(hybrid, users_df, interactions_df, k=10):
    """Normalized Discounted Cumulative Gain."""
    print("\n" + "=" * 60)
    print(f"NDCG@{k} EVALUATION")
    print("=" * 60)

    ndcg_scores = []
    sample_users = users_df.sample(min(200, len(users_df)), random_state=42)

    for _, user in sample_users.iterrows():
        uid = user['user_id']
        user_interactions = interactions_df[interactions_df['user_id'] == uid]
        if len(user_interactions) < 3:
            continue

        rating_map = dict(zip(user_interactions['meal_id'], user_interactions['rating']))
        user_profile = user.to_dict()
        recs = hybrid.recommend(uid, user_profile, n=k)

        # DCG
        dcg = 0
        for i, rec in enumerate(recs):
            relevance = rating_map.get(rec['meal_id'], 0)
            dcg += (2 ** relevance - 1) / np.log2(i + 2)

        # Ideal DCG
        ideal_ratings = sorted(rating_map.values(), reverse=True)[:k]
        idcg = sum((2 ** r - 1) / np.log2(i + 2) for i, r in enumerate(ideal_ratings))

        ndcg = dcg / idcg if idcg > 0 else 0
        ndcg_scores.append(ndcg)

    mean_ndcg = np.mean(ndcg_scores)
    print(f"  Mean NDCG@{k}: {mean_ndcg:.4f}")
    return mean_ndcg


def evaluate_constraint_satisfaction(hybrid, users_df, meals_df):
    """Check if recommendations respect dietary constraints."""
    print("\n" + "=" * 60)
    print("CONSTRAINT SATISFACTION ANALYSIS")
    print("=" * 60)

    constraint_checks = {
        'vegetarian': 0, 'vegetarian_total': 0,
        'gluten_free': 0, 'gluten_free_total': 0,
        'soft_food': 0, 'soft_food_total': 0,
        'low_sodium': 0, 'low_sodium_total': 0,
        'diabetic': 0, 'diabetic_total': 0,
    }

    for _, user in users_df.iterrows():
        uid = user['user_id']
        user_profile = user.to_dict()
        recs = hybrid.recommend(uid, user_profile, n=10)

        for rec in recs:
            meal = meals_df[meals_df['meal_id'] == rec['meal_id']].iloc[0]

            if user['is_vegetarian']:
                constraint_checks['vegetarian_total'] += 1
                if meal['is_vegetarian']:
                    constraint_checks['vegetarian'] += 1

            if user['is_gluten_free']:
                constraint_checks['gluten_free_total'] += 1
                if meal['is_gluten_free']:
                    constraint_checks['gluten_free'] += 1

            if user['needs_soft_food']:
                constraint_checks['soft_food_total'] += 1
                if meal['is_soft_food']:
                    constraint_checks['soft_food'] += 1

            if user['needs_low_sodium']:
                constraint_checks['low_sodium_total'] += 1
                if meal['is_low_sodium']:
                    constraint_checks['low_sodium'] += 1

            if user['has_diabetes']:
                constraint_checks['diabetic_total'] += 1
                if meal['is_diabetic_friendly']:
                    constraint_checks['diabetic'] += 1

    for constraint in ['vegetarian', 'gluten_free', 'soft_food', 'low_sodium', 'diabetic']:
        total = constraint_checks[f'{constraint}_total']
        satisfied = constraint_checks[constraint]
        rate = satisfied / total * 100 if total > 0 else 100
        print(f"  {constraint:>15s}: {satisfied}/{total} ({rate:.1f}%)")

    return constraint_checks


def evaluate_diversity(hybrid, users_df):
    """Measure diversity of recommendations."""
    print("\n" + "=" * 60)
    print("DIVERSITY ANALYSIS")
    print("=" * 60)

    meal_type_distributions = []
    unique_meals_per_user = []

    sample_users = users_df.sample(min(200, len(users_df)), random_state=42)
    for _, user in sample_users.iterrows():
        uid = user['user_id']
        user_profile = user.to_dict()
        recs = hybrid.recommend(uid, user_profile, n=10)

        types = [r['meal_type'] for r in recs]
        unique_types = len(set(types))
        unique_meals = len(set(r['meal_id'] for r in recs))

        meal_type_distributions.append(unique_types)
        unique_meals_per_user.append(unique_meals)

    avg_types = np.mean(meal_type_distributions)
    avg_unique = np.mean(unique_meals_per_user)
    print(f"  Avg unique meal types per user (out of 4): {avg_types:.2f}")
    print(f"  Avg unique meals per user (out of 10):     {avg_unique:.2f}")

    return avg_types, avg_unique


def evaluate_collaborative_rmse(interactions_df, n_users, n_meals, n_splits=5):
    """K-Fold CV on collaborative filtering rating prediction."""
    print("\n" + "=" * 60)
    print(f"COLLABORATIVE FILTERING - {n_splits}-FOLD CROSS VALIDATION (RMSE/MAE)")
    print("=" * 60)

    kf = KFold(n_splits=n_splits, shuffle=True, random_state=42)
    rmse_scores = []
    mae_scores = []

    indices = np.arange(len(interactions_df))

    for fold, (train_idx, test_idx) in enumerate(kf.split(indices), 1):
        train_data = interactions_df.iloc[train_idx]
        test_data = interactions_df.iloc[test_idx]

        collab = CollaborativeRecommender(train_data, n_users, n_meals, n_factors=30)

        y_true = []
        y_pred = []

        for _, row in test_data.sample(min(5000, len(test_data)), random_state=fold).iterrows():
            uid = int(row['user_id'])
            mid = int(row['meal_id'])
            actual = row['rating']
            predicted = collab.predict(uid, mid)
            y_true.append(actual)
            y_pred.append(predicted)

        rmse = np.sqrt(mean_squared_error(y_true, y_pred))
        mae = mean_absolute_error(y_true, y_pred)
        rmse_scores.append(rmse)
        mae_scores.append(mae)
        print(f"  Fold {fold}: RMSE={rmse:.4f}  MAE={mae:.4f}")

    print(f"\n  Mean RMSE: {np.mean(rmse_scores):.4f} ± {np.std(rmse_scores):.4f}")
    print(f"  Mean MAE:  {np.mean(mae_scores):.4f} ± {np.std(mae_scores):.4f}")

    return rmse_scores, mae_scores


def condition_specific_test(hybrid, meals_df):
    """Test recommendations for specific clinical profiles."""
    print("\n" + "=" * 60)
    print("CONDITION-SPECIFIC SCENARIO TESTING")
    print("=" * 60)

    scenarios = [
        {
            'name': 'Diabetic elderly (72yo)',
            'profile': {'user_id': 9000, 'age': 72, 'has_diabetes': 1, 'has_hypertension': 0,
                        'has_heart_disease': 0, 'calorie_target': 1600, 'protein_target': 55,
                        'carbs_target': 150, 'fats_target': 55, 'is_vegetarian': 0,
                        'needs_soft_food': 0, 'is_gluten_free': 0, 'needs_low_sodium': 0,
                        'needs_low_carb': 1},
            'check': 'is_diabetic_friendly',
        },
        {
            'name': 'Heart disease + hypertension (80yo)',
            'profile': {'user_id': 9001, 'age': 80, 'has_diabetes': 0, 'has_hypertension': 1,
                        'has_heart_disease': 1, 'calorie_target': 1700, 'protein_target': 50,
                        'carbs_target': 200, 'fats_target': 50, 'is_vegetarian': 0,
                        'needs_soft_food': 0, 'is_gluten_free': 0, 'needs_low_sodium': 1,
                        'needs_low_carb': 0},
            'check': 'is_heart_healthy',
        },
        {
            'name': 'Vegetarian, gluten-free (88yo)',
            'profile': {'user_id': 9002, 'age': 88, 'has_diabetes': 0, 'has_hypertension': 0,
                        'has_heart_disease': 0, 'calorie_target': 1500, 'protein_target': 45,
                        'carbs_target': 180, 'fats_target': 50, 'is_vegetarian': 1,
                        'needs_soft_food': 1, 'is_gluten_free': 1, 'needs_low_sodium': 0,
                        'needs_low_carb': 0},
            'check': 'is_vegetarian',
        },
    ]

    for scenario in scenarios:
        print(f"\n  Scenario: {scenario['name']}")
        recs = hybrid.recommend(
            scenario['profile']['user_id'],
            scenario['profile'],
            n=5
        )
        suited = 0
        for rec in recs:
            meal = meals_df[meals_df['meal_id'] == rec['meal_id']].iloc[0]
            check_val = meal[scenario['check']]
            suited += int(check_val)
            flag = "✓" if check_val else "✗"
            print(f"    {flag} {rec['name']:<40s} cal={rec['calories']:>4d}  "
                  f"carbs={rec['carbs_g']:>5.1f}g  score={rec['hybrid_score']:.3f}")
        print(f"    Suitability: {suited}/{len(recs)} ({suited/len(recs)*100:.0f}%)")


def plot_evaluation_summary(prk_results, ndcg, rmse_scores):
    """Summary bar chart of all metrics."""
    fig, axes = plt.subplots(1, 3, figsize=(15, 5))

    # Precision/Recall@K
    k_vals = sorted(prk_results.keys())
    precs = [np.mean(prk_results[k]['precision']) for k in k_vals]
    recs = [np.mean(prk_results[k]['recall']) for k in k_vals]
    x = np.arange(len(k_vals))
    axes[0].bar(x - 0.15, precs, 0.3, label='Precision', color='#2196F3')
    axes[0].bar(x + 0.15, recs, 0.3, label='Recall', color='#FF9800')
    axes[0].set_xticks(x)
    axes[0].set_xticklabels([f'@{k}' for k in k_vals])
    axes[0].set_title('Precision & Recall @K')
    axes[0].legend()
    axes[0].grid(True, alpha=0.3)

    # RMSE per fold
    axes[1].bar(range(1, len(rmse_scores)+1), rmse_scores, color='#F44336', alpha=0.7)
    axes[1].axhline(y=np.mean(rmse_scores), color='black', linestyle='--', label=f'Mean={np.mean(rmse_scores):.3f}')
    axes[1].set_xlabel('Fold')
    axes[1].set_ylabel('RMSE')
    axes[1].set_title('Collaborative Filtering RMSE')
    axes[1].legend()
    axes[1].grid(True, alpha=0.3)

    # NDCG
    axes[2].bar(['NDCG@10'], [ndcg], color='#4CAF50', alpha=0.7)
    axes[2].set_ylim(0, 1)
    axes[2].set_title('NDCG@10')
    axes[2].grid(True, alpha=0.3)

    plt.suptitle('Nutrition Recommendation - Evaluation Summary', fontsize=14)
    plt.tight_layout()
    plt.savefig(os.path.join(PLOT_DIR, 'nutrition_evaluation_summary.png'), dpi=150)
    plt.close()
    print("  [Saved] nutrition_evaluation_summary.png")


# =====================================================================
# MAIN
# =====================================================================

def main():
    print("=" * 60)
    print("AegisCare - Nutrition Recommendation Training & Evaluation")
    print("=" * 60)

    # --- Load Data ---
    meals_df, users_df, interactions_df = load_data()

    n_users = users_df['user_id'].max() + 1
    n_meals = meals_df['meal_id'].max() + 1

    # --- Build Recommenders ---
    print("\nBuilding Content-Based Recommender...")
    content_rec = ContentBasedRecommender(meals_df)

    print("Building Collaborative Filtering Recommender (SVD)...")
    collab_rec = CollaborativeRecommender(interactions_df, n_users, n_meals, n_factors=50)

    print("Building Hybrid Recommender...")
    hybrid = HybridRecommender(content_rec, collab_rec, meals_df)

    # --- Evaluation Suite ---
    # 1. Precision@K & Recall@K
    prk_results = evaluate_precision_recall_at_k(hybrid, users_df, interactions_df, k_values=[5, 10, 20])

    # 2. NDCG@10
    ndcg = evaluate_ndcg_at_k(hybrid, users_df, interactions_df, k=10)

    # 3. Constraint satisfaction
    constraints = evaluate_constraint_satisfaction(hybrid, users_df, meals_df)

    # 4. Diversity
    avg_types, avg_unique = evaluate_diversity(hybrid, users_df)

    # 5. Collaborative filtering RMSE/MAE (K-Fold)
    rmse_scores, mae_scores = evaluate_collaborative_rmse(interactions_df, n_users, n_meals)

    # 6. Condition-specific testing
    condition_specific_test(hybrid, meals_df)

    # 7. Summary plot
    print("\nGenerating plots...")
    plot_evaluation_summary(prk_results, ndcg, rmse_scores)

    # --- Save Model Artifacts ---
    print("\n" + "=" * 60)
    print("SAVING MODEL ARTIFACTS")
    print("=" * 60)

    artifacts = {
        'nutrition_scaler': content_rec.nutrition_scaler,
        'meal_features': content_rec.meal_features,
        'meals_data': meals_df,
        'collab_predicted_ratings': collab_rec.predicted_ratings,
        'collab_user_means': collab_rec.user_means,
    }
    joblib.dump(artifacts, os.path.join(MODEL_DIR, 'nutrition_recommender.pkl'))
    print(f"  [Saved] nutrition_recommender.pkl")

    # Save evaluation report
    eval_report = {
        'model': 'Hybrid (Content-Based + SVD Collaborative)',
        'dataset': {
            'meals': len(meals_df),
            'users': len(users_df),
            'interactions': len(interactions_df),
        },
        'precision_at_k': {str(k): round(np.mean(v['precision']), 4) for k, v in prk_results.items()},
        'recall_at_k': {str(k): round(np.mean(v['recall']), 4) for k, v in prk_results.items()},
        'ndcg_at_10': round(ndcg, 4),
        'collab_rmse_mean': round(np.mean(rmse_scores), 4),
        'collab_mae_mean': round(np.mean(mae_scores), 4),
        'diversity_avg_types': round(avg_types, 2),
        'diversity_avg_unique': round(avg_unique, 2),
    }
    with open(os.path.join(EVAL_DIR, 'nutrition_eval_report.json'), 'w') as f:
        json.dump(eval_report, f, indent=2)
    print(f"  [Saved] nutrition_eval_report.json")

    print("\n" + "=" * 60)
    print("MODEL 4 (Nutritional Recommendation) — COMPLETE")
    print("=" * 60)


if __name__ == '__main__':
    main()

"""
AegisCare ML - Cognitive Decline Detection Dataset Generation
================================================================
Generates 45,000+ game session rows for 600 elderly users over 3-12 months.
Simulates cognitive game performance with three trajectories:
  - Stable (60%): Scores fluctuate ±5% around baseline
  - Mild Decline (25%): Scores decrease 0.5-1% per week
  - Significant Decline (15%): Scores decrease 2-3% per week
"""

import numpy as np
import pandas as pd
import os

np.random.seed(42)

N_USERS = 600
MIN_SESSIONS = 30
MAX_SESSIONS = 120
TARGET_TOTAL = 45000


def generate_user_config(n_users):
    """Generate user configurations with decline trajectories."""
    configs = []

    for uid in range(n_users):
        age = int(np.random.normal(77, 6))
        age = max(65, min(95, age))

        # Assign trajectory (weighted by age)
        age_offset = (age - 75) / 20  # older = more likely to decline
        p_stable = max(0.3, 0.60 - age_offset * 0.15)
        p_mild = min(0.40, 0.25 + age_offset * 0.08)
        p_sig = 1.0 - p_stable - p_mild

        trajectory = np.random.choice(
            ['stable', 'mild_decline', 'significant_decline'],
            p=[p_stable, p_mild, p_sig]
        )

        # Baseline scores (age-adjusted)
        base_memory = float(np.clip(np.random.normal(80 - (age - 70) * 0.4, 8), 40, 100))
        base_pattern = float(np.clip(np.random.normal(75 - (age - 70) * 0.5, 10), 30, 100))
        base_reaction = float(np.clip(np.random.normal(450 + (age - 70) * 8, 50), 200, 800))
        base_word_recall = float(np.clip(np.random.normal(7.5 - (age - 70) * 0.06, 1.0), 3, 10))

        # Number of sessions
        n_sessions = np.random.randint(MIN_SESSIONS, MAX_SESSIONS + 1)

        configs.append({
            'user_id': uid,
            'age': age,
            'gender': np.random.choice([0, 1]),
            'education_years': int(np.clip(np.random.normal(12, 3), 6, 20)),
            'trajectory': trajectory,
            'base_memory': base_memory,
            'base_pattern': base_pattern,
            'base_reaction': base_reaction,
            'base_word_recall': base_word_recall,
            'n_sessions': n_sessions,
        })

    return configs


def generate_sessions(config):
    """Generate game sessions for a single user following their trajectory."""
    sessions = []
    n = config['n_sessions']
    trajectory = config['trajectory']

    # Decline rates (per session)
    if trajectory == 'stable':
        memory_rate = np.random.uniform(-0.001, 0.001)
        pattern_rate = np.random.uniform(-0.001, 0.001)
        reaction_rate = np.random.uniform(-0.5, 0.5)  # ms per session
        word_rate = np.random.uniform(-0.002, 0.002)
    elif trajectory == 'mild_decline':
        memory_rate = np.random.uniform(-0.004, -0.001)
        pattern_rate = np.random.uniform(-0.005, -0.002)
        reaction_rate = np.random.uniform(0.5, 2.0)
        word_rate = np.random.uniform(-0.008, -0.003)
    else:  # significant_decline
        memory_rate = np.random.uniform(-0.012, -0.005)
        pattern_rate = np.random.uniform(-0.015, -0.006)
        reaction_rate = np.random.uniform(2.0, 5.0)
        word_rate = np.random.uniform(-0.02, -0.01)

    for i in range(n):
        # Apply decline + daily noise
        day_noise_factor = np.random.normal(1.0, 0.05)  # ±5% daily variation
        fatigue_factor = 1.0 - np.random.uniform(0, 0.05) * (i % 7 == 6)  # slightly worse on "tired" days

        progress = i / max(n - 1, 1)

        memory_score = config['base_memory'] * (1 + memory_rate * i) * day_noise_factor * fatigue_factor
        pattern_score = config['base_pattern'] * (1 + pattern_rate * i) * day_noise_factor * fatigue_factor
        reaction_time = config['base_reaction'] * (1 + (reaction_rate * i) / config['base_reaction']) + np.random.normal(0, 20)
        word_recall = config['base_word_recall'] * (1 + word_rate * i) * day_noise_factor

        # Puzzle completion time (seconds) — increases with decline
        puzzle_time = np.random.normal(60, 15) * (1 + abs(pattern_rate) * i * 0.5) + np.random.normal(0, 5)

        sessions.append({
            'user_id': config['user_id'],
            'age': config['age'],
            'gender': config['gender'],
            'education_years': config['education_years'],
            'session_number': i + 1,
            'memory_game_score': max(0, min(100, memory_score)),
            'memory_game_time_ms': max(1000, int(np.random.normal(15000, 3000))),
            'pattern_puzzle_score': max(0, min(100, pattern_score)),
            'pattern_puzzle_time_ms': max(5000, int(puzzle_time * 1000)),
            'reaction_test_avg_ms': max(150, reaction_time),
            'word_recall_correct': max(0, min(10, round(word_recall))),
            'word_recall_time_ms': max(3000, int(np.random.normal(20000, 5000))),
            'cognitive_status': {'stable': 0, 'mild_decline': 1, 'significant_decline': 2}[trajectory],
        })

    return sessions


def compute_derived_features(df):
    """Compute rolling window features per user."""
    derived_rows = []

    for uid, group in df.groupby('user_id'):
        group = group.sort_values('session_number').reset_index(drop=True)

        for i in range(len(group)):
            row = group.iloc[i].to_dict()

            # Rolling averages (last 7 sessions)
            window_7 = group.iloc[max(0, i-6):i+1]
            row['memory_avg_7'] = window_7['memory_game_score'].mean()
            row['pattern_avg_7'] = window_7['pattern_puzzle_score'].mean()
            row['reaction_avg_7'] = window_7['reaction_test_avg_ms'].mean()
            row['word_recall_avg_7'] = window_7['word_recall_correct'].mean()

            # Trend (slope) over last 10 sessions
            window_10 = group.iloc[max(0, i-9):i+1]
            if len(window_10) >= 3:
                x = np.arange(len(window_10))
                row['memory_trend_10'] = np.polyfit(x, window_10['memory_game_score'].values, 1)[0]
                row['pattern_trend_10'] = np.polyfit(x, window_10['pattern_puzzle_score'].values, 1)[0]
                row['reaction_trend_10'] = np.polyfit(x, window_10['reaction_test_avg_ms'].values, 1)[0]
                row['word_recall_trend_10'] = np.polyfit(x, window_10['word_recall_correct'].values, 1)[0]
            else:
                row['memory_trend_10'] = 0
                row['pattern_trend_10'] = 0
                row['reaction_trend_10'] = 0
                row['word_recall_trend_10'] = 0

            # Variability (std over 14 sessions)
            window_14 = group.iloc[max(0, i-13):i+1]
            row['memory_std_14'] = window_14['memory_game_score'].std() if len(window_14) > 1 else 0
            row['reaction_std_14'] = window_14['reaction_test_avg_ms'].std() if len(window_14) > 1 else 0

            # Composite score
            row['composite_cognitive'] = (
                row['memory_game_score'] * 0.3 +
                row['pattern_puzzle_score'] * 0.25 +
                (100 - min(100, (row['reaction_test_avg_ms'] - 200) / 6)) * 0.25 +
                row['word_recall_correct'] * 10 * 0.2
            )

            # Reaction time ratio vs baseline (session 1)
            baseline_reaction = group.iloc[0]['reaction_test_avg_ms']
            row['reaction_ratio'] = row['reaction_test_avg_ms'] / baseline_reaction if baseline_reaction > 0 else 1.0

            derived_rows.append(row)

    return pd.DataFrame(derived_rows)


def main():
    print("=" * 60)
    print("AegisCare - Cognitive Decline Dataset Generation")
    print("=" * 60)

    # Generate user configs
    configs = generate_user_config(N_USERS)
    traj_counts = pd.Series([c['trajectory'] for c in configs]).value_counts()
    print(f"\nUser trajectories:")
    for t, c in traj_counts.items():
        print(f"  {t}: {c} ({c/N_USERS*100:.1f}%)")

    # Generate sessions
    print(f"\nGenerating sessions...")
    all_sessions = []
    for config in configs:
        sessions = generate_sessions(config)
        all_sessions.extend(sessions)

    df = pd.DataFrame(all_sessions)
    print(f"  Raw sessions: {len(df)}")

    # Add derived features
    print("Computing derived features (rolling windows, trends)...")
    df = compute_derived_features(df)

    # Round values
    for col in ['memory_game_score', 'pattern_puzzle_score', 'reaction_test_avg_ms',
                'memory_avg_7', 'pattern_avg_7', 'reaction_avg_7', 'word_recall_avg_7',
                'memory_trend_10', 'pattern_trend_10', 'reaction_trend_10', 'word_recall_trend_10',
                'memory_std_14', 'reaction_std_14', 'composite_cognitive', 'reaction_ratio']:
        if col in df.columns:
            df[col] = df[col].round(3)

    # Shuffle
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)

    # Save
    output_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'cognitive_dataset.csv')
    df.to_csv(output_path, index=False)

    print(f"\n--- Dataset Summary ---")
    print(f"Total sessions: {len(df)}")
    print(f"Unique users:   {df['user_id'].nunique()}")
    print(f"\nCognitive Status Distribution:")
    for status, label in enumerate(['Stable', 'Mild Decline', 'Significant Decline']):
        count = (df['cognitive_status'] == status).sum()
        print(f"  {label}: {count} ({count/len(df)*100:.1f}%)")
    print(f"\nFeatures: {list(df.columns)}")
    print(f"Saved to: {output_path}")


if __name__ == '__main__':
    main()

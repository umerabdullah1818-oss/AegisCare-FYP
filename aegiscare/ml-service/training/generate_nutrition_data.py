"""
AegisCare ML - Nutritional Recommendation Dataset Generation
==============================================================
Generates:
  1. Meal database: 2,000 elderly-appropriate meals with nutritional info & health tags
  2. User profiles: 1,000 synthetic elderly profiles with conditions & dietary prefs
  3. User-meal interactions: 50,000+ ratings/consumption records

All meals are tagged for condition suitability (diabetes, hypertension, heart disease, etc.)
"""

import numpy as np
import pandas as pd
import os

np.random.seed(42)

N_MEALS = 2000
N_USERS = 1000
N_INTERACTIONS = 50000

# ------------------------------------------------------------------
# Meal templates by meal type and health category
# ------------------------------------------------------------------
BREAKFAST_ITEMS = [
    ("Oatmeal with Berries", 280, 8, 48, 6, 4, True, True, True),
    ("Greek Yogurt Parfait", 250, 15, 30, 8, 2, True, False, True),
    ("Scrambled Eggs with Toast", 320, 18, 28, 14, 2, False, True, True),
    ("Banana Smoothie", 220, 6, 42, 4, 3, True, True, True),
    ("Whole Wheat Pancakes", 340, 10, 52, 10, 3, False, True, True),
    ("Fruit Bowl with Granola", 300, 7, 55, 6, 5, True, True, True),
    ("Egg White Omelette", 180, 20, 8, 6, 2, True, True, True),
    ("Cottage Cheese with Fruit", 200, 14, 22, 5, 2, True, False, True),
    ("Avocado Toast", 310, 8, 30, 18, 6, True, True, True),
    ("Rice Porridge", 250, 5, 45, 4, 1, True, True, True),
    ("Poached Eggs Benedict", 380, 16, 32, 18, 1, False, False, True),
    ("Muesli with Almond Milk", 290, 9, 48, 8, 5, True, True, True),
    ("Spinach Egg Wrap", 270, 16, 24, 10, 3, True, True, True),
    ("Chia Seed Pudding", 240, 8, 30, 10, 8, True, True, True),
    ("Soft Boiled Eggs with Soldiers", 260, 14, 22, 12, 2, True, True, True),
]

LUNCH_ITEMS = [
    ("Grilled Chicken Salad", 350, 30, 18, 16, 4, True, True, True),
    ("Lentil Soup", 280, 15, 40, 4, 8, True, True, True),
    ("Tuna Sandwich", 380, 25, 36, 14, 3, False, True, True),
    ("Vegetable Stir Fry with Rice", 400, 12, 58, 10, 5, False, True, True),
    ("Chicken Noodle Soup", 320, 20, 35, 8, 3, False, True, True),
    ("Quinoa Bowl with Vegetables", 380, 14, 50, 12, 6, True, True, True),
    ("Grilled Fish with Vegetables", 300, 28, 15, 12, 3, True, True, True),
    ("Turkey Wrap", 340, 22, 32, 12, 3, False, True, True),
    ("Bean and Vegetable Stew", 310, 16, 42, 6, 9, True, True, True),
    ("Salmon with Sweet Potato", 420, 30, 35, 14, 4, True, True, True),
    ("Mushroom Risotto", 380, 10, 55, 12, 3, False, False, True),
    ("Chicken Caesar Salad", 400, 28, 20, 20, 3, False, False, True),
    ("Vegetable Curry with Rice", 420, 10, 62, 12, 5, False, True, True),
    ("Minestrone Soup", 250, 10, 38, 6, 6, True, True, True),
    ("Baked Potato with Tuna", 360, 22, 42, 8, 4, False, True, True),
]

DINNER_ITEMS = [
    ("Baked Salmon with Broccoli", 380, 32, 12, 18, 4, True, True, True),
    ("Chicken Breast with Vegetables", 350, 30, 20, 12, 4, True, True, True),
    ("Pasta Primavera", 400, 12, 58, 12, 5, False, False, True),
    ("Beef Stew", 420, 28, 30, 16, 4, False, False, True),
    ("Grilled Tofu with Rice", 340, 16, 45, 10, 3, True, True, True),
    ("Fish Tacos", 360, 22, 32, 14, 3, False, True, True),
    ("Roasted Chicken Thigh", 380, 26, 8, 22, 2, True, False, True),
    ("Vegetable Lasagna", 400, 16, 45, 16, 4, False, False, True),
    ("Shrimp Stir Fry", 320, 24, 28, 10, 3, True, True, True),
    ("Turkey Meatballs with Pasta", 440, 28, 48, 14, 3, False, False, True),
    ("Baked Cod with Potatoes", 340, 28, 30, 8, 3, True, True, True),
    ("Lamb Chops with Salad", 450, 30, 10, 28, 3, True, False, True),
    ("Stuffed Bell Peppers", 300, 18, 28, 10, 5, True, True, True),
    ("Grilled Pork Tenderloin", 360, 32, 12, 14, 2, True, True, True),
    ("Eggplant Parmesan", 380, 14, 35, 18, 5, False, False, True),
]

SNACK_ITEMS = [
    ("Apple Slices with Peanut Butter", 200, 6, 22, 10, 3, True, True, True),
    ("Mixed Nuts", 180, 5, 8, 16, 2, True, True, True),
    ("Yogurt Cup", 150, 8, 18, 4, 0, True, False, True),
    ("Carrot Sticks with Hummus", 130, 4, 16, 6, 4, True, True, True),
    ("Cheese and Crackers", 200, 8, 18, 10, 1, False, False, True),
    ("Banana", 105, 1, 27, 0, 3, True, True, True),
    ("Trail Mix", 220, 6, 24, 12, 3, False, True, True),
    ("Rice Cakes with Avocado", 160, 3, 20, 8, 3, True, True, True),
    ("Hard Boiled Egg", 78, 6, 1, 5, 0, True, True, True),
    ("Dark Chocolate Square", 120, 2, 14, 8, 2, True, True, True),
    ("Cottage Cheese Cup", 110, 12, 4, 4, 0, True, False, True),
    ("Fruit Smoothie", 180, 4, 36, 2, 3, True, True, True),
    ("Whole Grain Toast with Honey", 160, 4, 30, 3, 2, False, True, True),
    ("Edamame", 120, 10, 8, 5, 4, True, True, True),
    ("Vegetable Soup Cup", 100, 4, 14, 2, 3, True, True, True),
]

MEAL_TYPE_MAP = {
    'breakfast': BREAKFAST_ITEMS,
    'lunch': LUNCH_ITEMS,
    'dinner': DINNER_ITEMS,
    'snack': SNACK_ITEMS,
}

# Format: (name, calories, protein, carbs, fats, fiber, diabetic_ok, heart_ok, soft_food_ok)


def generate_meal_database(n_meals):
    """Generate extended meal database with nutritional variations."""
    meals = []
    meal_id = 0

    for meal_type, templates in MEAL_TYPE_MAP.items():
        # How many meals to generate per type
        n_per_type = n_meals // 4

        for i in range(n_per_type):
            template = templates[i % len(templates)]
            name_base, cal, prot, carbs, fats, fiber, diab_ok, heart_ok, soft_ok = template

            # Add variations
            variation_idx = i // len(templates)
            if variation_idx > 0:
                name = f"{name_base} (V{variation_idx})"
            else:
                name = name_base

            # Add nutritional noise (±15% variation)
            noise = np.random.uniform(0.85, 1.15)
            cal = int(cal * noise)
            prot = round(prot * noise, 1)
            carbs = round(carbs * noise, 1)
            fats = round(fats * noise, 1)
            fiber = round(fiber * noise, 1)

            # Compute sodium (mg) and sugar (g)
            sodium = np.random.randint(100, 800)
            sugar = round(np.random.uniform(2, 20), 1)

            # Determine health tags
            low_sodium = sodium < 400
            low_carb = carbs < 30
            high_protein = prot > 20
            low_fat = fats < 10
            diabetic_friendly = diab_ok and carbs < 40
            heart_healthy = heart_ok and sodium < 500 and fats < 15

            # Preparation time (minutes)
            prep_time = np.random.choice([10, 15, 20, 25, 30, 40, 45, 60])

            meals.append({
                'meal_id': meal_id,
                'name': name,
                'meal_type': meal_type,
                'calories': cal,
                'protein_g': prot,
                'carbs_g': carbs,
                'fats_g': fats,
                'fiber_g': fiber,
                'sodium_mg': sodium,
                'sugar_g': sugar,
                'prep_time_min': prep_time,
                'is_diabetic_friendly': int(diabetic_friendly),
                'is_heart_healthy': int(heart_healthy),
                'is_low_sodium': int(low_sodium),
                'is_low_carb': int(low_carb),
                'is_high_protein': int(high_protein),
                'is_low_fat': int(low_fat),
                'is_soft_food': int(soft_ok),
                'is_vegetarian': int(np.random.random() < 0.3),
                'is_gluten_free': int(np.random.random() < 0.25),
            })
            meal_id += 1

    return pd.DataFrame(meals)


def generate_user_profiles(n_users):
    """Generate elderly user profiles with conditions and dietary preferences."""
    users = []

    for uid in range(n_users):
        age = int(np.random.normal(77, 6))
        age = max(65, min(95, age))

        has_diabetes = int(np.random.random() < (0.25 + (age - 65) / 200))
        has_hypertension = int(np.random.random() < (0.40 + (age - 65) / 150))
        has_heart_disease = int(np.random.random() < (0.15 + (age - 65) / 200))

        # Calorie target based on age and activity
        calorie_target = int(np.random.normal(1800, 200))
        calorie_target = max(1200, min(2400, calorie_target))

        protein_target = round(np.random.normal(55, 8), 1)
        carbs_target = round(np.random.normal(220, 30), 1)
        fats_target = round(np.random.normal(60, 10), 1)

        # Dietary preferences
        is_vegetarian = int(np.random.random() < 0.12)
        needs_soft_food = int(np.random.random() < (0.1 + (age - 65) / 100))
        is_gluten_free = int(np.random.random() < 0.08)
        needs_low_sodium = int(has_hypertension or (np.random.random() < 0.15))
        needs_low_carb = int(has_diabetes or (np.random.random() < 0.1))

        users.append({
            'user_id': uid,
            'age': age,
            'has_diabetes': has_diabetes,
            'has_hypertension': has_hypertension,
            'has_heart_disease': has_heart_disease,
            'calorie_target': calorie_target,
            'protein_target': protein_target,
            'carbs_target': carbs_target,
            'fats_target': fats_target,
            'is_vegetarian': is_vegetarian,
            'needs_soft_food': needs_soft_food,
            'is_gluten_free': is_gluten_free,
            'needs_low_sodium': needs_low_sodium,
            'needs_low_carb': needs_low_carb,
        })

    return pd.DataFrame(users)


def generate_interactions(users_df, meals_df, n_interactions):
    """Generate user-meal interactions based on condition-meal compatibility."""
    interactions = []

    user_ids = users_df['user_id'].values
    meal_ids = meals_df['meal_id'].values

    for _ in range(n_interactions):
        uid = np.random.choice(user_ids)
        mid = np.random.choice(meal_ids)

        user = users_df[users_df['user_id'] == uid].iloc[0]
        meal = meals_df[meals_df['meal_id'] == mid].iloc[0]

        # Base rating
        rating = np.random.normal(3.5, 0.8)

        # Condition-meal compatibility adjustments
        if user['has_diabetes'] and meal['is_diabetic_friendly']:
            rating += 0.5
        elif user['has_diabetes'] and not meal['is_diabetic_friendly']:
            rating -= 0.8

        if user['has_hypertension'] and meal['is_low_sodium']:
            rating += 0.4
        elif user['has_hypertension'] and not meal['is_low_sodium']:
            rating -= 0.6

        if user['has_heart_disease'] and meal['is_heart_healthy']:
            rating += 0.5
        elif user['has_heart_disease'] and not meal['is_heart_healthy']:
            rating -= 0.7

        if user['is_vegetarian'] and not meal['is_vegetarian']:
            rating -= 2.0  # strong penalty

        if user['needs_soft_food'] and not meal['is_soft_food']:
            rating -= 1.5

        if user['is_gluten_free'] and not meal['is_gluten_free']:
            rating -= 1.8

        # Calorie alignment
        cal_diff = abs(meal['calories'] - user['calorie_target'] / 3) / (user['calorie_target'] / 3)
        if cal_diff > 0.3:
            rating -= 0.3

        # Clamp and round
        rating = max(1.0, min(5.0, rating))
        rating = round(rating * 2) / 2  # round to nearest 0.5

        consumed = int(rating >= 3.0 and np.random.random() < 0.8)

        interactions.append({
            'user_id': uid,
            'meal_id': mid,
            'rating': rating,
            'consumed': consumed,
            'meal_type': meal['meal_type'],
        })

    return pd.DataFrame(interactions)


def main():
    print("=" * 60)
    print("AegisCare - Nutritional Recommendation Dataset Generation")
    print("=" * 60)

    # 1. Meal database
    print(f"\nGenerating {N_MEALS} meals...")
    meals_df = generate_meal_database(N_MEALS)
    print(f"  Meal types: {meals_df['meal_type'].value_counts().to_dict()}")

    # 2. User profiles
    print(f"Generating {N_USERS} user profiles...")
    users_df = generate_user_profiles(N_USERS)
    print(f"  Diabetic users: {users_df['has_diabetes'].sum()}")
    print(f"  Hypertensive users: {users_df['has_hypertension'].sum()}")

    # 3. Interactions
    print(f"Generating {N_INTERACTIONS} interactions...")
    interactions_df = generate_interactions(users_df, meals_df, N_INTERACTIONS)
    print(f"  Average rating: {interactions_df['rating'].mean():.2f}")
    print(f"  Consumption rate: {interactions_df['consumed'].mean()*100:.1f}%")

    # Save
    output_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    os.makedirs(output_dir, exist_ok=True)

    meals_df.to_csv(os.path.join(output_dir, 'meals_database.csv'), index=False)
    users_df.to_csv(os.path.join(output_dir, 'nutrition_user_profiles.csv'), index=False)
    interactions_df.to_csv(os.path.join(output_dir, 'meal_interactions.csv'), index=False)

    print(f"\n--- Saved ---")
    print(f"  meals_database.csv ({len(meals_df)} rows)")
    print(f"  nutrition_user_profiles.csv ({len(users_df)} rows)")
    print(f"  meal_interactions.csv ({len(interactions_df)} rows)")
    print(f"  Total data points: {len(meals_df) + len(users_df) + len(interactions_df)}")


if __name__ == '__main__':
    main()

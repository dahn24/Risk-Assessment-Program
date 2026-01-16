import random
import pandas as pd

rows = []

for _ in range(4000):
    risk = random.randint(1, 10)
    growth = random.choice([1, 2, 3])
    loss = random.choice([1, 2, 3])
    horizon = random.choice([1, 2, 3])
    stability = random.randint(1, 10)

    score = (
        0.2 * (horizon / 3) +
        0.2 * (growth / 3) +
        0.2 * (loss / 3) +
        0.2 * (risk / 10) +
        0.2 * (stability / 10)
    )


    if score < 0.52:
        label = "Conservative"
    elif score < 0.71:
        label = "Moderate"
    else:
        label = "Aggressive"

    rows.append([risk, round(growth * 3.3, 3), round(loss * 3.3, 3), round(horizon * 3.3, 3), stability, round(score, 2), label])

df = pd.DataFrame(rows, columns=[
    "risk_comfort",
    "growth_preference",
    "loss_tolerance",
    "time_horizon",
    "income_stability",
    "total_score",
    "risk_category"
])

df.to_csv("risk_profiles.csv", index=False)

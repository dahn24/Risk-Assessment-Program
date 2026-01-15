import random
import pandas as pd

rows = []

for _ in range(2000):
    risk = random.randint(1, 10)
    growth = random.choice([1, 2, 3])
    loss = random.choice([1, 2, 3])
    horizon = random.choice([1, 2, 3])
    stability = random.randint(1, 10)

    score = (
        0.2 * (3.33 * horizon) +
        0.2 * (3.33 * growth) +
        0.2 * (3.33 * loss) +
        0.2 * risk +
        0.2 * stability
    )

    if score < 3.34:
        label = "Conservative"
    elif score < 6.67:
        label = "Moderate"
    else:
        label = "Aggressive"

    rows.append([risk, round(growth * 3.3, 3), round(loss * 3.3, 3), round(horizon * 3.3, 3), stability, round(score, 3), label])

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

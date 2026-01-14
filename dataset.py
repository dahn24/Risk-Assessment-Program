import random
import pandas as pd

rows = []

for _ in range(400):
    risk = random.randint(1, 10)
    growth = random.randint(1, 10)
    loss = random.randint(1, 10)
    horizon = random.randint(1, 30)
    income = random.choice([1, 2, 3])

    score = (
        0.4 * risk +
        0.3 * growth +
        0.2 * loss +
        0.1 * (horizon / 3)
    )

    if score < 4:
        label = "Conservative"
    elif score < 6.5:
        label = "Moderate"
    else:
        label = "Aggressive"

    rows.append([risk, growth, loss, horizon, income, label])

df = pd.DataFrame(rows, columns=[
    "risk_comfort",
    "growth_preference",
    "loss_tolerance",
    "time_horizon",
    "income_stability",
    "risk_category"
])

df.to_csv("risk_profiles.csv", index=False)

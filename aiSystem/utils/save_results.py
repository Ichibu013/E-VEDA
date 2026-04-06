import csv
import os
from datetime import datetime

FILE_PATH = "session_results.csv"


def save_result(result):

    file_exists = os.path.isfile(FILE_PATH)

    with open(FILE_PATH, "a", newline="") as f:

        writer = csv.writer(f)

        # write header first time
        if not file_exists:
            writer.writerow([
                "timestamp",
                "emotion",
                "confidence",
                "attention_score",
                "attention_state",
                "mental_state",
                "stress_score"
            ])

        writer.writerow([
            datetime.now(),
            result["emotion"],
            result["confidence"],
            result["attention_score"],
            result["attention_state"],
            result["mental_state"],
            result["stress_score"]
        ])
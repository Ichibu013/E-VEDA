"""
Fusion System Evaluation Module
===============================
This script provides utility for analyzing batch results and generating performance metrics 
for the core fusion model on an aggregated session results file.

It computes global accuracy statistics and visualizes the distributions of emotions,
attention states, and overall mental states.
"""

import pandas as pd
import matplotlib.pyplot as plt

# Attempt to load and analyze aggregate system outputs
try:
    data = pd.read_csv("session_results.csv")

    print("\n===== EVEDA SYSTEM EVALUATION =====\n")

    # -------------------------
    # EMOTION PERFORMANCE
    # -------------------------

    emotion_conf = data["confidence"].mean()

    print(f"Average Emotion Confidence : {emotion_conf:.2f}%")

    # -------------------------
    # ATTENTION PERFORMANCE
    # -------------------------

    attention_score = data["attention_score"].mean()

    print(f"Average Attention Score : {attention_score:.2f}%")

    # -------------------------
    # STRESS PERFORMANCE
    # -------------------------

    stress_score = data["stress_score"].mean()

    print(f"Average Stress Score : {stress_score:.2f}%")

    # -------------------------
    # MULTIMODAL FUSION SCORE
    # -------------------------

    # Heuristic formulation to combine independent scores into a single proxy performance measure
    fusion_score = (
        0.5 * emotion_conf +
        0.3 * attention_score +
        0.2 * stress_score
    )

    print("\n-----------------------------------")
    print(f"Overall EVEDA System Performance : {fusion_score:.2f}%")

    # -------------------------
    # EMOTION DISTRIBUTION
    # -------------------------

    print("\n--- Emotion Distribution ---")
    emotion_counts = data["emotion"].value_counts()
    print(emotion_counts)

    plt.figure()
    emotion_counts.plot(kind="bar")
    plt.title("Emotion Distribution")
    plt.xlabel("Emotion")
    plt.ylabel("Count")
    plt.savefig("emotion_distribution.png")
    plt.close()

    # -------------------------
    # ATTENTION STATE
    # -------------------------

    print("\n--- Attention State Distribution ---")
    attention_counts = data["attention_state"].value_counts()
    print(attention_counts)

    plt.figure()
    attention_counts.plot(kind="bar")
    plt.title("Attention State Distribution")
    plt.xlabel("State")
    plt.ylabel("Count")
    plt.savefig("attention_state_distribution.png")
    plt.close()

    # -------------------------
    # MENTAL STATE
    # -------------------------

    print("\n--- Mental State Distribution ---")
    mental_counts = data["mental_state"].value_counts()
    print(mental_counts)

    plt.figure()
    mental_counts.plot(kind="bar")
    plt.title("Mental State Distribution")
    plt.xlabel("State")
    plt.ylabel("Count")
    plt.savefig("mental_state_distribution.png")
    plt.close()

except FileNotFoundError:
    print("Could not find session_results.csv. Please run the system to generate session data first.")

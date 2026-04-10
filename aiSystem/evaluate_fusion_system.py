import pandas as pd
import matplotlib.pyplot as plt

# load system outputs
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
import os
import pandas as pd
import matplotlib.pyplot as plt

# --------------------------------------------------
# Reports Directory
# --------------------------------------------------

reports_dir = os.path.join(
    os.path.dirname(__file__),
    "..",
    "reports",
)

csv_path = os.path.join(
    reports_dir,
    "statistical_results.csv",
)

# Read statistical results
df = pd.read_csv(csv_path)


# --------------------------------------------------
# Plot with Error Bars
# --------------------------------------------------

def plot_metric(metric_column, std_column, title, ylabel, filename):

    plt.figure(figsize=(7, 5))

    bars = plt.bar(
        df["Algorithm"],
        df[metric_column],
        yerr=df[std_column],
        capsize=8,
    )

    plt.title(title, fontsize=14, fontweight="bold")
    plt.ylabel(ylabel, fontsize=12)
    plt.xlabel("Algorithms", fontsize=12)

    plt.grid(
        axis="y",
        linestyle="--",
        alpha=0.5,
    )

    # Add value labels
    for bar in bars:
        height = bar.get_height()

        plt.text(
            bar.get_x() + bar.get_width() / 2,
            height,
            f"{height:.2f}",
            ha="center",
            va="bottom",
            fontsize=10,
        )

    save_path = os.path.join(
        reports_dir,
        filename,
    )

    plt.tight_layout()
    plt.savefig(save_path, dpi=300)
    plt.close()

    print(f"✓ Saved: {filename}")


# --------------------------------------------------
# Plot without Error Bars
# --------------------------------------------------

def plot_metric_without_error(metric_column, title, ylabel, filename):

    plt.figure(figsize=(7, 5))

    bars = plt.bar(
        df["Algorithm"],
        df[metric_column],
    )

    plt.title(title, fontsize=14, fontweight="bold")
    plt.ylabel(ylabel, fontsize=12)
    plt.xlabel("Algorithms", fontsize=12)

    plt.grid(
        axis="y",
        linestyle="--",
        alpha=0.5,
    )

    # Add value labels
    for bar in bars:
        height = bar.get_height()

        plt.text(
            bar.get_x() + bar.get_width() / 2,
            height,
            f"{height:.2f}",
            ha="center",
            va="bottom",
            fontsize=10,
        )

    save_path = os.path.join(
        reports_dir,
        filename,
    )

    plt.tight_layout()
    plt.savefig(save_path, dpi=300)
    plt.close()

    print(f"✓ Saved: {filename}")


# --------------------------------------------------
# Generate Graphs
# --------------------------------------------------

plot_metric(
    "Avg MLE",
    "Std MLE",
    "Average Mean Localization Error",
    "Mean Localization Error",
    "avg_mle_comparison.png",
)

plot_metric(
    "Avg RMSE",
    "Std RMSE",
    "Average Root Mean Square Error",
    "RMSE",
    "avg_rmse_comparison.png",
)

plot_metric_without_error(
    "Avg NLE",
    "Average Normalized Localization Error",
    "Normalized Localization Error",
    "avg_nle_comparison.png",
)

plot_metric_without_error(
    "Avg Success Rate",
    "Average Localization Success Rate",
    "Success Rate (%)",
    "avg_success_rate.png",
)

print("\n" + "=" * 60)
print("All statistical comparison plots generated successfully!")
print("=" * 60)
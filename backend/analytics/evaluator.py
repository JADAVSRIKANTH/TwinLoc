from analytics.metrics import (
    calculate_mean_localization_error,
    calculate_rmse,
    calculate_normalized_localization_error,
    calculate_localization_success_rate,
)


def evaluate_localization(
    true_positions,
    estimated_positions,
    communication_range,
):
    """
    Evaluate localization performance.
    """

    mean_error = calculate_mean_localization_error(
        true_positions,
        estimated_positions,
    )

    rmse = calculate_rmse(
        true_positions,
        estimated_positions,
    )

    normalized_error = calculate_normalized_localization_error(
        true_positions,
        estimated_positions,
        communication_range,
    )

    success_rate = calculate_localization_success_rate(
        true_positions,
        estimated_positions,
    )

    localized_nodes = len(estimated_positions)
    total_nodes = len(true_positions)

    return {
        "mean_localization_error": round(mean_error, 4),
        "rmse": round(rmse, 4),
        "normalized_localization_error": round(normalized_error, 4),
        "localization_success_rate": round(success_rate, 2),
        "localized_nodes": localized_nodes,
        "total_nodes": total_nodes,
        "unlocalized_nodes": total_nodes - localized_nodes,
    }
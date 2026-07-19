import math


def calculate_mean_localization_error(true_positions, estimated_positions):
    """
    Mean Localization Error (MLE)
    """

    errors = []

    for node_id, true_pos in true_positions.items():

        if node_id not in estimated_positions:
            continue

        est_pos = estimated_positions[node_id]

        error = math.sqrt(
            (true_pos["x"] - est_pos["x"]) ** 2 +
            (true_pos["y"] - est_pos["y"]) ** 2
        )

        errors.append(error)

    if not errors:
        return 0.0

    return sum(errors) / len(errors)


def calculate_rmse(true_positions, estimated_positions):
    """
    Root Mean Square Error (RMSE)
    """

    squared_errors = []

    for node_id, true_pos in true_positions.items():

        if node_id not in estimated_positions:
            continue

        est_pos = estimated_positions[node_id]

        error = (
            (true_pos["x"] - est_pos["x"]) ** 2 +
            (true_pos["y"] - est_pos["y"]) ** 2
        )

        squared_errors.append(error)

    if not squared_errors:
        return 0.0

    return math.sqrt(sum(squared_errors) / len(squared_errors))


def calculate_normalized_localization_error(
    true_positions,
    estimated_positions,
    communication_range,
):
    """
    Normalized Localization Error (NLE)
    """

    mle = calculate_mean_localization_error(
        true_positions,
        estimated_positions,
    )

    return mle / communication_range


def calculate_localization_success_rate(
    true_positions,
    estimated_positions,
):
    """
    Localization Success Rate (%)
    """

    total_nodes = len(true_positions)
    localized_nodes = len(estimated_positions)

    if total_nodes == 0:
        return 0.0

    return (localized_nodes / total_nodes) * 100
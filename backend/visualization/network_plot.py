import matplotlib.pyplot as plt


class NetworkPlot:

    @staticmethod
    def plot_network(
        network,
        estimated_positions,
        algorithm_name,
        save_path,
    ):
        """
        Visualize the WSN localization result.

        Parameters
        ----------
        network : dict
            Generated network.

        estimated_positions : dict
            algorithm_result["best_position"]

        algorithm_name : str

        save_path : str
        """

        plt.figure(figsize=(8, 8))

        # -------------------------------
        # Anchor Nodes
        # -------------------------------
        anchor_x = [a["x"] for a in network["anchor_nodes"]]
        anchor_y = [a["y"] for a in network["anchor_nodes"]]

        plt.scatter(
            anchor_x,
            anchor_y,
            marker="s",
            s=120,
            color="blue",
            label="Anchor Nodes",
        )

        # -------------------------------
        # True Sensor Nodes
        # -------------------------------
        sensor_x = [s["x"] for s in network["sensor_nodes"]]
        sensor_y = [s["y"] for s in network["sensor_nodes"]]

        plt.scatter(
            sensor_x,
            sensor_y,
            marker="o",
            s=40,
            color="green",
            label="True Position",
        )

        # -------------------------------
        # Estimated Positions
        # -------------------------------
        est_x = []
        est_y = []

        for sensor in network["sensor_nodes"]:

            sid = sensor["id"]

            if sid not in estimated_positions:
                continue

            estimate = estimated_positions[sid]

            est_x.append(estimate["x"])
            est_y.append(estimate["y"])

            # Error Line
            plt.plot(
                [sensor["x"], estimate["x"]],
                [sensor["y"], estimate["y"]],
                linestyle="--",
                linewidth=0.8,
                color="gray",
            )

        plt.scatter(
            est_x,
            est_y,
            marker="x",
            s=60,
            color="red",
            label="Estimated Position",
        )

        plt.title(f"{algorithm_name} Network Localization")

        plt.xlabel("X Coordinate (m)")
        plt.ylabel("Y Coordinate (m)")

        plt.grid(True)
        plt.legend(
        loc="upper left",
        bbox_to_anchor=(1.02, 1),)

        plt.axis("equal")

        plt.tight_layout()

        plt.savefig(save_path, dpi=300)

        plt.close()
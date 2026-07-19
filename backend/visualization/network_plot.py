import matplotlib.pyplot as plt


class NetworkPlot:

    @staticmethod
    def plot(
        network,
        estimated_positions=None,
        save_path=None,
    ):

        plt.figure(figsize=(8,8))

        # Sensor Nodes
        sx = [s["x"] for s in network["sensor_nodes"]]
        sy = [s["y"] for s in network["sensor_nodes"]]

        plt.scatter(
            sx,
            sy,
            label="Sensor Nodes",
            marker="o",
        )

        # Anchor Nodes
        ax = [a["x"] for a in network["anchor_nodes"]]
        ay = [a["y"] for a in network["anchor_nodes"]]

        plt.scatter(
            ax,
            ay,
            label="Anchor Nodes",
            marker="^",
            s=100,
        )

        # Estimated Positions
        if estimated_positions:

            ex = [
                estimated_positions[k]["x"]
                for k in estimated_positions
            ]

            ey = [
                estimated_positions[k]["y"]
                for k in estimated_positions
            ]

            plt.scatter(
                ex,
                ey,
                marker="x",
                label="Estimated",
            )

        plt.legend()

        plt.xlabel("X")

        plt.ylabel("Y")

        plt.title("Wireless Sensor Network")

        plt.grid(True)

        if save_path:
            plt.savefig(save_path,dpi=300)

        plt.show()

        plt.close()
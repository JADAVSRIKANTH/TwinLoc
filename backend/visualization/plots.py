import matplotlib.pyplot as plt


class PlotGenerator:
    """
    Utility class for generating convergence plots for localization algorithms.
    """

    @staticmethod
    def single_convergence(
        convergence_curve,
        algorithm,
        save_path=None,
    ):
        """
        Plot convergence curve for a single algorithm.

        Parameters
        ----------
        convergence_curve : list
            Fitness values over iterations.
        algorithm : str
            Algorithm name.
        save_path : str, optional
            Path to save the figure.
        """

        plt.figure(figsize=(8, 5))

        plt.plot(
            range(1, len(convergence_curve) + 1),
            convergence_curve,
            linewidth=2.5,
            marker="o",
            markersize=5,
            label=algorithm,
        )

        plt.xlabel("Iterations", fontsize=12)
        plt.ylabel("Fitness Value", fontsize=12)
        plt.title(f"{algorithm} Convergence Curve", fontsize=14)

        plt.grid(True, linestyle="--", alpha=0.5)

        plt.legend()

        plt.tight_layout()

        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches="tight")

        plt.show()

        plt.close()

    @staticmethod
    def compare_convergence(
        curves,
        save_path=None,
    ):
        """
        Plot convergence curves of multiple algorithms.

        Parameters
        ----------
        curves : dict

        Example:
        {
            "MFO": [...],
            "GA": [...],
            "Hybrid MFO-GA": [...]
        }

        save_path : str, optional
            Path to save the figure.
        """

        plt.figure(figsize=(9, 6))

        markers = {
            "MFO": "o",
            "GA": "s",
            "Hybrid MFO-GA": "^",
        }

        for algorithm, curve in curves.items():

            plt.plot(
                range(1, len(curve) + 1),
                curve,
                linewidth=2.5,
                marker=markers.get(algorithm, "o"),
                markersize=6,
                label=algorithm,
            )

        plt.xlabel("Iterations", fontsize=12)

        plt.ylabel("Fitness Value", fontsize=12)

        plt.title(
            "Convergence Comparison of MFO, GA and Hybrid MFO-GA",
            fontsize=14,
        )

        plt.grid(True, linestyle="--", alpha=0.5)

        plt.legend()

        plt.tight_layout()

        if save_path:
            plt.savefig(
                save_path,
                dpi=300,
                bbox_inches="tight",
            )

        plt.show()

        plt.close()
    @staticmethod
    def compare_metric(values, metric_name, save_path=None):
        """
        Draws a comparison bar chart for any metric.
        """

        import matplotlib.pyplot as plt

        algorithms = list(values.keys())
        scores = list(values.values())

        plt.figure(figsize=(8, 6))

        bars = plt.bar(
            algorithms,
            scores,
            width=0.5,
        )

        plt.title(f"{metric_name} Comparison", fontsize=16)
        plt.xlabel("Algorithms", fontsize=13)
        plt.ylabel(metric_name, fontsize=13)

        plt.grid(axis="y", linestyle="--", alpha=0.4)

        # Display values above bars
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

        plt.tight_layout()

        if save_path:
            plt.savefig(
                save_path,
                dpi=300,
                bbox_inches="tight",
            )

        plt.show()
        plt.close()
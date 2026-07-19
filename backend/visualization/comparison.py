import matplotlib.pyplot as plt


class ComparisonPlots:

    @staticmethod
    def metric_bar(
        results,
        metric,
        save_path=None,
    ):

        algorithms = list(results.keys())

        values = [
            results[a][metric]
            for a in algorithms
        ]

        plt.figure(figsize=(6,5))

        plt.bar(
            algorithms,
            values,
        )

        plt.ylabel(metric.replace("_"," ").title())

        plt.title(metric.replace("_"," ").title())

        plt.grid(axis="y")

        if save_path:
            plt.savefig(save_path,dpi=300)

        plt.show()

        plt.close()
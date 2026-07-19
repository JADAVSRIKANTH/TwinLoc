from visualization.plots import PlotGenerator

mfo = [900, 800, 720, 650, 590, 520, 500]

ga = [850, 730, 600, 500, 420, 360, 310]

hybrid = [820, 650, 480, 350, 250, 180, 150]

PlotGenerator.compare_convergence(
    {
        "MFO": mfo,
        "GA": ga,
        "Hybrid MFO-GA": hybrid,
    }
)
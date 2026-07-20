import os
import pandas as pd
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Image,
    PageBreak,
)

# --------------------------------------------------
# Paths
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

pdf_path = os.path.join(
    reports_dir,
    "TwinLoc_Report.pdf",
)

# --------------------------------------------------
# Read CSV
# --------------------------------------------------

df = pd.read_csv(csv_path)
# ==================================================
# Automatic Analysis
# ==================================================

best_rmse = df.loc[df["Avg RMSE"].idxmin()]
best_mle = df.loc[df["Avg MLE"].idxmin()]
best_nle = df.loc[df["Avg NLE"].idxmin()]
# Highest Success Rate

max_success = df["Avg Success Rate"].max()

best_success_algorithms = df[
    df["Avg Success Rate"] == max_success
]["Algorithm"].tolist()

if len(best_success_algorithms) == len(df):
    success_text = (
        f"All evaluated algorithms achieved "
        f"{max_success:.2f}% localization success."
    )
else:
    success_text = (
        f"{', '.join(best_success_algorithms)} achieved "
        f"{max_success:.2f}% localization success."
    )
best_consistency = df.loc[df["Std RMSE"].idxmin()]

# --------------------------------------------------
# PDF Setup
# --------------------------------------------------

doc = SimpleDocTemplate(pdf_path)

styles = getSampleStyleSheet()
current_date = datetime.now().strftime("%d %B %Y")

elements = []

# ==================================================
# TITLE
# ==================================================

# ==================================================
# COVER PAGE
# ==================================================

cover_title = Paragraph(
    "<b><font size=28>TwinLoc</font></b>",
    styles["Title"],
)

elements.append(Spacer(1, 1.0 * inch))
elements.append(cover_title)
elements.append(Spacer(1, 0.4 * inch))

subtitle = Paragraph(
    """
    <para align='center'>
    <font size=18>
    Digital Twin Based Wireless Sensor Network Localization<br/>
    using Hybrid MFO-GA
    </font>
    </para>
    """,
    styles["BodyText"],
)

elements.append(subtitle)
elements.append(Spacer(1, 0.5 * inch))

report_title = Paragraph(
    "<para align='center'><b><font size=18>Experimental Report</font></b></para>",
    styles["BodyText"],
)

elements.append(report_title)
elements.append(Spacer(1, 0.8 * inch))

prepared = Paragraph(
    """
    <para align='center'>
    <b>Prepared By</b><br/><br/>
    Jadav Srikanth<br/><br/>

    Department of Information Technology<br/>
    Vardhaman College of Engineering<br/><br/>

    <b>Generated On</b><br/>
    %s
    </para>
    """ % current_date,
    styles["BodyText"],
)

elements.append(prepared)

# ==================================================
# PROJECT INFORMATION
# ==================================================
elements.append(PageBreak())
info = Paragraph(
    """
    <b>Project:</b> TwinLoc - Digital Twin Based Wireless Sensor Network Localization<br/>
    <b>Algorithms:</b> MFO, GA, Hybrid MFO-GA<br/>
    <b>Experimental Runs:</b> 30<br/>
    <b>Network Size:</b> 50 Sensor Nodes<br/>
    <b>Anchor Nodes:</b> 10<br/>
    <b>Communication Range:</b> 100 m
    """,
    styles["BodyText"],
)

elements.append(info)
elements.append(Spacer(1, 0.4 * inch))
# ==================================================
# EXECUTIVE SUMMARY
# ==================================================

summary_heading = Paragraph(
    "<b>Executive Summary</b>",
    styles["Heading1"],
)

elements.append(summary_heading)

summary = Paragraph(
    """
    This report presents the comparative performance
    evaluation of three localization algorithms:
    MFO, GA and Hybrid MFO-GA for Wireless Sensor
    Network (WSN) localization.

    Thirty independent simulation runs were conducted
    to evaluate Mean Localization Error (MLE),
    Root Mean Square Error (RMSE),
    Normalized Localization Error (NLE),
    and Localization Success Rate.

    The results provide a statistical comparison of
    localization accuracy and algorithm consistency
    under identical experimental conditions.
    """,
    styles["BodyText"],
)

elements.append(summary)

elements.append(Spacer(1,0.3*inch))
# ==================================================
# EXPERIMENT CONFIGURATION
# ==================================================

config_heading = Paragraph(
    "<b>Experiment Configuration</b>",
    styles["Heading2"],
)

elements.append(config_heading)

config_data = [

    ["Parameter", "Value"],

    ["Experimental Runs", "30"],

    ["Sensor Nodes", "50"],

    ["Anchor Nodes", "10"],

    ["Communication Range", "100 m"],

    ["Algorithms",
     "MFO\nGA\nHybrid MFO-GA"],

]

config_table = Table(
    config_data,
    colWidths=[2.8*inch,3.2*inch]
)

config_table.setStyle(

    TableStyle([

        ("BACKGROUND",(0,0),(-1,0),colors.darkblue),

        ("TEXTCOLOR",(0,0),(-1,0),colors.whitesmoke),

        ("GRID",(0,0),(-1,-1),1,colors.black),

        ("BACKGROUND",(0,1),(-1,-1),colors.lightgrey),

        ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),

        ("ALIGN",(0,0),(-1,-1),"CENTER"),

        ("BOTTOMPADDING",(0,0),(-1,0),10),

    ])
)

elements.append(config_table)

elements.append(Spacer(1,0.35*inch))

# ==================================================
# STATISTICAL TABLE
# ==================================================

heading = Paragraph(
    "<b>Table 1. Statistical Comparison of Localization Algorithms</b>",
    styles["Heading1"],
)

elements.append(heading)
elements.append(Spacer(1, 0.2 * inch))

table_data = [list(df.columns)]

for row in df.values:
    table_data.append(list(row))

table = Table(table_data)

table.setStyle(
    TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),

        ("BACKGROUND", (0, 1), (-1, -1), colors.beige),

        ("GRID", (0, 0), (-1, -1), 1, colors.black),

        ("ALIGN", (0, 0), (-1, -1), "CENTER"),

        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),

        ("BOTTOMPADDING", (0, 0), (-1, 0), 10),
    ])
)

elements.append(table)

# ==================================================
# PAGE BREAK
# ==================================================

elements.append(PageBreak())

# ==================================================
# GRAPH SECTION
# ==================================================

graph_heading = Paragraph(
    "<b><font size=18>Statistical Comparison Graphs</font></b>",
    styles["Heading1"],
)

elements.append(graph_heading)
elements.append(Spacer(1, 0.3 * inch))

# --------------------------------------------------
# Graph Paths
# --------------------------------------------------

mle_graph = os.path.join(
    reports_dir,
    "avg_mle_comparison.png",
)

rmse_graph = os.path.join(
    reports_dir,
    "avg_rmse_comparison.png",
)

nle_graph = os.path.join(
    reports_dir,
    "avg_nle_comparison.png",
)

success_graph = os.path.join(
    reports_dir,
    "avg_success_rate.png",
)

# --------------------------------------------------
# MLE
# --------------------------------------------------

# ==================================================
# Figure 1
# ==================================================

caption = Paragraph(
    "<b>Figure 1.</b> Average Mean Localization Error Comparison",
    styles["BodyText"],
)

elements.append(caption)

elements.append(Spacer(1,0.1*inch))

elements.append(
    Image(
        mle_graph,
        width=6*inch,
        height=4*inch,
    )
)

elements.append(Spacer(1,0.25*inch))

elements.append(Spacer(1, 0.2 * inch))

# --------------------------------------------------
# RMSE
# --------------------------------------------------

# ==================================================
# Figure 2
# ==================================================

caption = Paragraph(
    "<b>Figure 2.</b> Average Root Mean Square Error Comparison",
    styles["BodyText"],
)

elements.append(caption)

elements.append(Spacer(1,0.1*inch))

elements.append(
    Image(
        rmse_graph,
        width=6*inch,
        height=4*inch,
    )
)

# ==================================================
# PAGE BREAK
# ==================================================

elements.append(PageBreak())

# --------------------------------------------------
# NLE
# --------------------------------------------------
# ==================================================
# Figure 3
# ==================================================

caption = Paragraph(
    "<b>Figure 3.</b> Average Normalized Localization Error Comparison",
    styles["BodyText"],
)

elements.append(caption)

elements.append(Spacer(1,0.1*inch))

elements.append(
    Image(
        nle_graph,
        width=6*inch,
        height=4*inch,
    )
)

elements.append(Spacer(1,0.25*inch))

# --------------------------------------------------
# SUCCESS RATE
# --------------------------------------------------

# ==================================================
# Figure 4
# ==================================================

caption = Paragraph(
    "<b>Figure 4.</b> Average Localization Success Rate Comparison",
    styles["BodyText"],
)

elements.append(caption)

elements.append(Spacer(1,0.1*inch))

elements.append(
    Image(
        success_graph,
        width=6*inch,
        height=4*inch,
    )
)
elements.append(PageBreak())
conclusion_heading = Paragraph(
    "<b><font size=20>Experimental Conclusions</font></b>",
    styles["Heading1"],
)

elements.append(conclusion_heading)
elements.append(Spacer(1, 0.3 * inch))
conclusion = Paragraph(
    f"""
    <b>1. Best Average RMSE</b><br/>
    {best_rmse['Algorithm']} achieved the lowest Average RMSE of
    <b>{best_rmse['Avg RMSE']:.2f}</b>.
    <br/><br/>

    <b>2. Best Mean Localization Error</b><br/>
    {best_mle['Algorithm']} achieved the lowest Average MLE of
    <b>{best_mle['Avg MLE']:.2f}</b>.
    <br/><br/>

    <b>3. Lowest Normalized Localization Error</b><br/>
    {best_nle['Algorithm']} achieved the lowest Average NLE of
    <b>{best_nle['Avg NLE']:.2f}</b>.
    <br/><br/>

    <b>4. Highest Localization Success Rate</b><br/>
    {success_text}
    <br/><br/>

    <b>5. Most Consistent Algorithm</b><br/>
    {best_consistency['Algorithm']} produced the lowest RMSE
    standard deviation of
    <b>{best_consistency['Std RMSE']:.2f}</b>.
    <br/><br/>

    <b>Overall Observation</b><br/>

    Based on the statistical evaluation of 30 independent simulation runs, GA demonstrated the best overall localization performance by achieving the lowest Mean Localization Error (MLE), Root Mean Square Error (RMSE), and Normalized Localization Error (NLE), while all evaluated algorithms maintained a 100% localization success rate. These results indicate that GA is the most effective algorithm among the evaluated methods for the current wireless sensor network configuration.
    """,
    styles["BodyText"],
)

elements.append(conclusion)
elements.append(Spacer(1, 0.4 * inch))

future_heading = Paragraph(
    "<b><font size=18>Future Work</font></b>",
    styles["Heading2"],
)

elements.append(future_heading)

future = Paragraph(
    """
    • Integrate PSO, GWO, TLBO and BAT localization algorithms.<br/><br/>

    • Evaluate larger wireless sensor networks containing
    hundreds of nodes.<br/><br/>

    • Extend TwinLoc with real-time Digital Twin visualization.<br/><br/>

    • Compare Hybrid MFO-GA with modern optimization techniques.<br/><br/>

    • Deploy TwinLoc as a cloud-based localization platform.
    """,
    styles["BodyText"],
)

elements.append(future)
# ==================================================
# BUILD PDF
# ==================================================
# ==================================================
# Footer
# ==================================================

def add_footer(canvas, doc):

    page = canvas.getPageNumber()

    if page == 1:
        return

    width, height = doc.pagesize

    total_pages = 6   # or calculate dynamically later

    canvas.saveState()
    canvas.setFont("Helvetica", 9)

    canvas.line(40, 38, width - 40, 38)

    canvas.drawString(
        40,
        24,
        "TwinLoc Experimental Report"
    )

    canvas.drawCentredString(
        width / 2,
        24,
        "Generated by TwinLoc v1.0"
    )

    canvas.drawRightString(
        width - 40,
        24,
        f"Page {page} of {total_pages}"
    )

    canvas.restoreState()
doc.build(
    elements,
    onFirstPage=add_footer,
    onLaterPages=add_footer,
)
print("\n" + "=" * 60)
print("TwinLoc Report Generated Successfully!")
print("=" * 60)
print(pdf_path)
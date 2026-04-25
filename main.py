import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

df_store    = {}
HIGH_BUFFER = 1.20
LOW_BUFFER  = 0.80
XLSX_FILE   = "intern_assignment_support_pack_dev_only_v3.xlsx"


def get_latest_month(df: pd.DataFrame) -> str:
    return df["month"].dropna().astype(str).max()


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not os.path.exists(XLSX_FILE):
        raise FileNotFoundError(
            f"Workbook not found at '{XLSX_FILE}'. "
            f"Run the server from the project root where /data/ lives."
        )

    metrics_df = pd.read_excel(
        XLSX_FILE,
        sheet_name="Metric_Examples",
        header=11
    )
    metrics_df = metrics_df.dropna(subset=["developer_id"])
    metrics_df = metrics_df.rename(columns={
        "merged_prs":       "pr_throughput",
        "prod_deployments": "deployment_frequency",
        "bug_rate_pct":     "bug_rate",
        "team_name":        "team",
    })

    dim_df = pd.read_excel(XLSX_FILE, sheet_name="Dim_Developers")

    df_store["df"] = metrics_df.merge(
        dim_df[["developer_id", "level"]].rename(columns={"level": "seniority"}),
        on="developer_id",
        how="left"
    )
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/developers")
async def list_developers():
    df = df_store.get("df", pd.DataFrame())
    if df.empty:
        return []
    names = df["developer_name"].dropna().unique().tolist()
    return sorted(names)


@app.get("/metrics/{developer_name}")
async def get_developer_insights(developer_name: str):
    df = df_store.get("df", pd.DataFrame())

    if df.empty:
        raise HTTPException(status_code=503, detail="Data not loaded.")

    dev_rows = df[df["developer_name"] == developer_name]
    if dev_rows.empty:
        raise HTTPException(status_code=404, detail="Developer not found.")

    latest_month    = get_latest_month(df)
    latest_dev_rows = dev_rows[dev_rows["month"] == latest_month]
    dev_row         = latest_dev_rows.iloc[0] if not latest_dev_rows.empty else dev_rows.iloc[0]

    latest_df = df[df["month"] == latest_month]
    if latest_df.empty:
        raise HTTPException(
            status_code=404,
            detail=f"No team data found for month '{latest_month}'."
        )

    raw_baselines = latest_df[[
        "avg_lead_time_days",
        "avg_cycle_time_days",
        "bug_rate",
        "deployment_frequency",
        "pr_throughput"
    ]].mean().to_dict()

    baselines = {
        k: (round(float(v), 2) if pd.notna(v) else 0)
        for k, v in raw_baselines.items()
    }

    m = dev_row.to_dict()

    is_high_pr     = m["pr_throughput"]        > baselines["pr_throughput"]        * HIGH_BUFFER
    is_low_pr      = m["pr_throughput"]        < baselines["pr_throughput"]        * LOW_BUFFER
    is_high_cycle  = m["avg_cycle_time_days"]  > baselines["avg_cycle_time_days"]  * HIGH_BUFFER
    is_high_lead   = m["avg_lead_time_days"]   > baselines["avg_lead_time_days"]   * HIGH_BUFFER
    is_high_bug    = m["bug_rate"]             > baselines["bug_rate"]             * HIGH_BUFFER
    is_high_deploy = m["deployment_frequency"] > baselines["deployment_frequency"] * HIGH_BUFFER

    story  = "Your workflow is aligned with the team average. No major outliers detected."
    action = "Continue your current pace and look for opportunities to mentor peers."
    status = "neutral"

    # Scenario D: slow delivery AND bugs escaping — most severe combination
    if is_high_cycle and is_high_bug:
        story  = "Your work items are taking longer than average to complete and bugs are escaping to production."
        action = "Before picking up new work, add a test for the last bug that escaped. Then break your next issue into smaller tasks."
        status = "danger"

    # Scenario E: slow delivery pipeline — cycle time and lead time both above baseline
    elif is_high_cycle and is_high_lead:
        story  = "Your issues and PRs are taking significantly longer to move through the pipeline than the team average."
        action = "Check if any current issues have external blockers. If not, try timeboxing each task to half a day before asking for help."
        status = "warning"

    # Scenario F: quality dip — bug rate elevated but delivery speed is fine
    elif is_high_bug:
        story  = "Your bug rate is above the team average this month, even though your delivery speed looks fine."
        action = "Add one edge-case test per issue before marking it Done. Focus on boundary conditions your current tests miss."
        status = "warning"

    # Scenario A: high output but PRs stuck in review
    elif is_high_pr and is_high_cycle:
        story  = "You're producing plenty of code, but PRs are spending too long waiting for feedback."
        action = "Prioritize reviewing peers' PRs first thing each morning to unblock the team."
        status = "warning"

    # Scenario B: shipping fast but quality slipping
    elif is_high_deploy and is_high_bug:
        story  = "You're shipping frequently, but bugs are escaping to production at a higher rate than the team average."
        action = "Slow the release cadence by one cycle. Add one edge-case test before closing any issue."
        status = "danger"

    # Scenario C: large batch work causing long lead times
    elif is_high_lead and is_low_pr:
        story  = "Your lead time is high because you're working in large batches that take long to merge."
        action = "Break your current issue into three smaller PRs to increase feedback speed."
        status = "warning"

    return {
        "developer":  developer_name,
        "team":       str(dev_row.get("team", "")),
        "seniority":  str(dev_row.get("seniority", "")),
        "raw_metrics": {
            "lead_time":     {"val": float(m["avg_lead_time_days"]),   "base": float(baselines["avg_lead_time_days"])},
            "cycle_time":    {"val": float(m["avg_cycle_time_days"]),  "base": float(baselines["avg_cycle_time_days"])},
            "bug_rate":      {"val": float(m["bug_rate"]),             "base": float(baselines["bug_rate"])},
            "deploy_freq":   {"val": float(m["deployment_frequency"]), "base": float(baselines["deployment_frequency"])},
            "pr_throughput": {"val": float(m["pr_throughput"]),        "base": float(baselines["pr_throughput"])}
        },
        "insight": {
            "story":  story,
            "action": action,
            "status": status
        }
    }


@app.get("/team-summary")
async def get_team_summary():
    df = df_store.get("df", pd.DataFrame())

    if df.empty:
        raise HTTPException(status_code=503, detail="Data not loaded.")

    latest_month = get_latest_month(df)
    latest_df    = df[df["month"] == latest_month]

    if latest_df.empty:
        raise HTTPException(
            status_code=404,
            detail=f"No team data found for month '{latest_month}'."
        )

    raw_baselines = latest_df[[
        "avg_lead_time_days",
        "avg_cycle_time_days",
        "bug_rate",
        "deployment_frequency",
        "pr_throughput"
    ]].mean().to_dict()

    baselines = {
        k: (round(float(v), 2) if pd.notna(v) else 0)
        for k, v in raw_baselines.items()
    }

    if baselines["pr_throughput"] > 8 and baselines["avg_lead_time_days"] > 3:
        summary        = "The team is high-output but lead time pressure is building in the pipeline."
        recommendation = "Review CI/CD build speeds and whether review SLAs are being met consistently."
    else:
        summary        = "The team pipeline is healthy this month."
        recommendation = "Maintain current testing and review standards."

    return {
        "baselines": baselines,
        "manager_insight": {
            "summary":        summary,
            "recommendation": recommendation
        }
    }
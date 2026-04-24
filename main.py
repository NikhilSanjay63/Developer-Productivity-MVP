from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

CSV_FILE = "data.csv"
# Threshold constants
HIGH_BUFFER = 1.20 # 20% above baseline
LOW_BUFFER = 0.80  # 20% below baseline

def get_data():
    try:
        return pd.read_csv(CSV_FILE)
    except FileNotFoundError:
        return pd.DataFrame()

@app.get("/developers")
async def list_developers():
    df = get_data()
    if df.empty:
        return []
    return df['developer'].tolist()

@app.get("/metrics/{developer_name}")
async def get_developer_insights(developer_name: str):
    df = get_data()
    
    if df.empty or developer_name not in df['developer'].values:
        raise HTTPException(status_code=404, detail="Developer not found")

    # 1. Calculate Global Baselines (Team Averages)
    baselines = df.mean(numeric_only=True).to_dict()
    
    # 2. Extract Individual Metrics
    dev_row = df[df['developer'] == developer_name].iloc[0]
    m = dev_row.to_dict() # m contains: pr_throughput, cycle_time, lead_time, bug_rate, deploy_freq

    # 3. Logic Flags (Is the IC "High" or "Low" compared to the team?)
    is_high_pr = m['pr_throughput'] > (baselines['pr_throughput'] * HIGH_BUFFER)
    is_low_pr  = m['pr_throughput'] < (baselines['pr_throughput'] * LOW_BUFFER)
    
    is_high_cycle = m['cycle_time'] > (baselines['cycle_time'] * HIGH_BUFFER)
    
    is_high_lead = m['lead_time'] > (baselines['lead_time'] * HIGH_BUFFER)
    
    is_high_bug = m['bug_rate'] > (baselines['bug_rate'] * HIGH_BUFFER)
    
    is_high_deploy = m['deploy_freq'] > (baselines['deploy_freq'] * HIGH_BUFFER)
    is_low_deploy  = m['deploy_freq'] < (baselines['deploy_freq'] * LOW_BUFFER)

    # 4. The Insight Engine (Scenario Matching)
    story = "Your workflow is currently aligned with the team average."
    action = "Continue your current pace and focus on code quality."
    status = "neutral"

    # Scenario A: The Review Bottleneck
    if is_high_pr and is_high_cycle:
        story = "You're producing plenty of code, but PRs are spending too much time waiting for feedback."
        action = "Prioritize reviewing your peers' code first thing in the morning to unblock the team."
        status = "warning"

    # Scenario B: The Rushed Release
    elif is_high_deploy and is_high_bug:
        story = "You are shipping frequently, but it's leading to a higher-than-average bug rate in production."
        action = "Slow down the release cadence. Prioritize writing unit tests and request an explicit QA review."
        status = "danger"

    # Scenario C: The Giant Batch
    elif is_high_lead and is_low_pr:
        story = "Your lead time is high because you are working on large, complex PRs that take a long time to merge."
        action = "Try breaking your current Jira issue into three smaller PRs to increase feedback speed."
        status = "warning"

    return {
        "developer": developer_name,
        "raw_metrics": {
            "lead_time": {"val": float(m['lead_time']), "base": float(baselines['lead_time'])},
            "cycle_time": {"val": float(m['cycle_time']), "base": float(baselines['cycle_time'])},
            "bug_rate": {"val": float(m['bug_rate']), "base": float(baselines['bug_rate'])},
            "deploy_freq": {"val": float(m['deploy_freq']), "base": float(baselines['deploy_freq'])},
            "pr_throughput": {"val": float(m['pr_throughput']), "base": float(baselines['pr_throughput'])}
        },
        "insight": {
            "story": story,
            "action": action,
            "status": status
        }
    }

@app.get("/team-summary")
async def get_team_summary():
    """Manager View: Detects system-level bottlenecks"""
    df = get_data()
    baselines = df.mean(numeric_only=True).to_dict()
    
    # Manager Scenario: The CI/CD Gridlock 
    # (High PR Throughput team-wide + High Lead Time team-wide)
    if baselines['pr_throughput'] > 10 and baselines['lead_time'] > 48:
        summary = "The team is high-output, but the pipeline is clogged."
        recommendation = "Investigate CI/CD build speeds or review culture."
    else:
        summary = "The team pipeline is healthy."
        recommendation = "Maintain current automated testing standards."

    return {
        "baselines": baselines,
        "manager_insight": {
            "summary": summary,
            "recommendation": recommendation
        }
    }
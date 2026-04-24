# Developer Insight Engine (MVP)

A lightweight Developer Productivity dashboard designed to solve the "data without direction" problem. Instead of simply presenting raw metrics, this application contextualizes them by comparing an Individual Contributor's (IC) performance against the global team baseline and generating actionable, plain-English advice.

## 🎯 The Problem & Solution
Engineering managers and developers are often overwhelmed by standard DORA metrics (Deployment Frequency, Lead Time, etc.). 
* **The Problem:** Metrics alone don't tell a story. A high "Cycle Time" could mean a developer is struggling, *or* it could mean they are doing complex architectural work.
* **The Solution:** The Insight Engine acts as a translation layer. It detects specific combinations of metrics (e.g., High PR Throughput + High Cycle Time) and translates them into identifiable scenarios (e.g., "The Review Bottleneck") with specific, actionable habits to improve workflow.

## 🛠️ Tech Stack Choices
I chose a lightweight, decoupled architecture to ensure the MVP could be built rapidly while remaining scalable:
* **Backend:** `Python` with `FastAPI` & `Pandas`. 
  * *Why:* Pandas is the industry standard for fast, in-memory data manipulation, making it trivial to calculate dynamic baselines from our CSV data layer. FastAPI provides instant, documented REST endpoints.
* **Frontend:** `React.js` (bootstrapped with `Vite`) & `Tailwind CSS`.
  * *Why:* Vite provides instant Hot Module Replacement for rapid UI iteration. Tailwind allows for highly customized, conditional styling without writing separate CSS files. `Recharts` is used for lightweight visual data comparisons.

## ✨ Features
1. **IC Context View:** Select a developer to see their raw metrics formatted cleanly.
2. **The "Story" Engine:** Dynamically generated text that correlates metrics into understandable scenarios (e.g., *The Rushed Release*, *The Giant Batch*).
3. **Visual Comparisons:** A responsive bar chart comparing the IC's metrics directly against the team average.
4. **Manager View (Stretch Goal):** A toggleable view that zooms out to detect system-level bottlenecks across the entire team (e.g., *The CI/CD Gridlock*).
5. **Graceful Error Handling:** UI fallbacks in the event of backend downtime or API disconnects.

---

## 🚀 How to Run Locally

### Prerequisites
* Node.js (v18+)
* Python (3.9+)

### 1. Start the Backend (FastAPI)
Navigate to the root directory where `main.py` and `data.csv` are located.
```bash
# Install dependencies
pip install fastapi uvicorn pandas

# Run the server (starts on [http://127.0.0.1:8000](http://127.0.0.1:8000))
uvicorn main:app --reload
# AppClaw 🦞

**AI-powered iOS app generator — utilizing 11 specialized agents orchestrated by a Claude Opus agent to research, validate, design, build, and ship iOS apps autonomously.**

---

## What is AppClaw?

AppClaw is a solo-operated app generator built on [OpenClaw](https://openclaw.ai). Instead of a traditional development team or manual AI coding, it uses 11 AI agents — each with a defined role, skill file, and output standard — to take an app idea from raw niche research all the way to App Store submission.

The goal: ship one polished, monetizable iOS app per month with minimal manual intervention.

---

## The Pipeline

```
Niche Idea
    │
    ▼
🔍 Alani — Business Analyst
    Researches Reddit, App Store, and forums for validated user pain
    Output: research-report.md
    │
    ▼
📋 Alex — Product Manager
    Defines scope, core problem, and GO/NO-GO decision
    Output: product-decision.md
    │
    ▼
💰 Tony — Revenue Strategist
    Designs monetization model, pricing, and trial logic
    Output: monetization-decision.md
    │
    ▼
🎨 Aiden — UI/UX Designer
    Designs all screens, user flow, onboarding, and paywall placement
    Output: ux-spec.md
    │
    ▼
🏗️ Kyler — CTO/Architect
    Defines tech stack, data models, Clean Architecture layers
    Output: architecture-spec.md
    │
    ▼
⚡ Victoria — Tech Lead
    Breaks architecture into ordered tasks with acceptance criteria
    Output: task-breakdown.md
    │
    ▼
🔧 Johnny — Backend Engineer (Qwen3 Coder)
    Builds data layer: repositories, services, StoreKit 2, SwiftData
    Output: Swift files + backend-completion-report.md
    │
    ▼
💻 Jett — Frontend Engineer (Qwen3 Coder)
    Builds UI layer: SwiftUI views, ViewModels, navigation, paywall
    Output: SwiftUI files + frontend-completion-report.md
    │
    ▼
🧪 Jason — QA Engineer
    Tests payment flows, App Store compliance, edge cases
    Output: qa-report.md
    │
    ▼
📣 Kenny — Marketing Manager
    Writes App Store copy, keywords, screenshot briefs, app icon
    Output: launch-package.md
    │
    ▼
🎯 Bartholomew — Orchestrator (Claude Opus 4.6)
    Manages every handoff, gate check, and alignment review
    Routes tasks, validates outputs, surfaces blockers to operator
```

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Orchestrator | Claude Opus 4.6 |
| All specialist agents | Claude Sonnet 4.6 |
| Engineers | Qwen3 Coder (via Qwen Portal) |
| Agent framework | OpenClaw |
| Communication | Telegram bot |
| App platform | iOS (Swift / SwiftUI) |
| Architecture | Clean Architecture + MVVM |
| Payments | StoreKit 2 |
| Crash reporting | Firebase Crashlytics |
| Dashboard | Node.js (local) |

---

## How It Works

### Agent Skills
Each agent has a `SKILL.md` file — a detailed operating manual that defines:
- What the agent builds and what it never touches
- Step-by-step execution process
- Output templates it must fill exactly
- Code standards and quality gates
- How to update its `STATE.md` for dashboard visibility

### Orchestration
Bartholomew (Claude Opus) reads all foundation documents at session start, then manages the pipeline through a strict intake → handoff → alignment check → gate flow. Every output is validated against the template before being passed forward.

### Engineering
The two engineers (Johnny and Jett) run as subagents with Pi tool access — they actually read spec files from disk and write Swift files to disk, rather than generating code as text. Bartholomew uses a gap-check respawn protocol to handle session timeouts without losing progress.

### Dashboard
A local Node.js server reads each agent's `STATE.md` every 5 seconds and displays real-time pipeline status — which agents are working, idle, or blocked, and which app cycle is active.

---

## First App — TiltBreak

TiltBreak is an emotional regulation app for gamers and competitive people who struggle with rage and impulsive decisions. It intercepts tilt moments with a two-phase calm-down flow: a dynamic bubble-tap rage channel followed by guided breathing.

**Status:** Build complete (Phases 1-3). Awaiting App Store Connect setup for StoreKit integration (Phases 4-5).

---

## Design Principles

1. **Correctness over speed** — agents never rush outputs to meet deadlines
2. **Solo-maintainability** — every decision must be understandable by one person
3. **Validated pain before building** — no feature without a Reddit signal
4. **Small and profitable** — $500-2K MRR per app beats one risky moonshot
5. **No vendor lock-in** — every dependency replaceable in under a week
6. **Portfolio over projects** — 10 small earners beats one big bet

---

## Running the Dashboard

```bash
node dashboard/dashboard.js
# Open http://localhost:3131
```

Requires Node.js. Reads agent STATE.md files from OpenClaw workspace paths.

---

Built with [OpenClaw](https://openclaw.ai) · Agents powered by [Anthropic](https://anthropic.com) and [Qwen](https://qwen.ai)

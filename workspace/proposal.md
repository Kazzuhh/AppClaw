# proposal.md
> Current strategy. Replaced each cycle. Checked against problem.md and philosophy.md.

---

## What This Proposes

A monthly pipeline operated by 11 specialized agents, orchestrated by Bartholomew, that takes a niche category as input and produces a validated, polished, submitted Swift app as output — while simultaneously monitoring all previously shipped apps for bugs, reviews, and maintenance signals.

---

## Problems Addressed

| Problem | Addressed By |
|---|---|
| Signal vs noise in forum research | Business Analyst skill with explicit validation criteria |
| App Store opportunity validation | Business Analyst + Revenue Strategist sequential handoff |
| Monetization before architecture | Hard sequencing gate enforced by Bartholomew |
| App Store quality bar | Tech Lead standards + QA gate before every submission |
| Agent orchestration without human bottleneck | Bartholomew + STATE.md per agent + structured handoff files |
| Portfolio coherence and solo-maintainability | CTO shared architecture + Tech Lead enforcement |
| Post-launch monitoring and maintenance | Firebase Crashlytics passive crash alerts + on-demand agent review triggered by you |

---

## How You Interact With The Pipeline

You communicate exclusively with Bartholomew. He is the only agent you ever prompt directly. What you send him determines what the pipeline does.

**Types of commands Bartholomew accepts:**

| What you send | What Bartholomew does |
|---|---|
| A niche or category | Triggers full Track 1 build cycle |
| A specific objective or task | Scopes and delegates to the relevant agents only |
| An app update or change request | Routes to the correct agent(s) based on the nature of the change |
| "Run a portfolio review" | Triggers Track 2 on-demand |
| A crash alert or bug report | Triages and triggers a hotfix cycle if warranted |
| Anything else | Bartholomew interprets the intent, proposes a plan, and confirms before acting |

Bartholomew never assumes. If a command is ambiguous, he clarifies before tasking any agent. If a command requires multiple agents, he sequences them correctly and manages all handoffs. You never need to think about which agent handles what — that is Bartholomew's job.

---

## The Pipeline Cycle

**Track 1 — Build Track:** Fully automated once triggered by a niche or build objective. Research → Validate → Design → Build → QA → Submit. Bartholomew commands every agent in sequence without human intervention until the app is submitted. You are only pulled in if the Business Analyst flags uncertainty.

**Track 2 — Monitor Track:** On-demand only. Triggered by you through Bartholomew when you want a portfolio review, feedback analysis, or any post-launch action.

**Between cycles — Idle state:** Once a cycle completes, all agents go idle. Nothing runs, no tokens burn. The entire pipeline waits silently for your next command to Bartholomew before anything starts again.

## Track 1: The Build Pipeline

### Phase 1 — Discovery (Week 1)

**Input:** A niche or category you provide to Bartholomew.

**Step 1: Business Analyst**
- Researches Reddit, App Store reviews, forums, and relevant communities in the niche
- Applies explicit signal filter: complaints must be recurring, unresolved, and expressed as willingness to pay — not just venting
- Cross-checks App Store: are existing apps bad, absent, or expensive? Is there a realistic gap?
- Output: `research-report.md` — confirmed pain points, App Store landscape, opportunity score

**Step 2: PM**
- Reads `research-report.md`
- Makes go/no-go decision on the opportunity
- If go: defines the core problem the app solves, the target user, and the scope boundary (what the app does NOT do)
- Output: `product-decision.md` — problem statement, target user, scope, go/no-go

**Bartholomew gate:** If PM says no-go, cycle resets. You are prompted to provide a new niche. No further agents are tasked.

---

### Phase 2 — Strategy (Week 1, after PM green light)

**Step 3: Revenue Strategist**
- Reads `research-report.md` and `product-decision.md`
- Analyzes category norms, competitor pricing, user willingness to pay
- Decides monetization model: subscription, one-time, or freemium
- If subscription: free trial is the default onboarding assumption
- Output: `monetization-decision.md` — model, price point, trial length if applicable, rationale

**Step 4: UI/UX Designer**
- Reads `product-decision.md` and `monetization-decision.md`
- Produces wireframes and user flow — screens, navigation, paywall placement, onboarding sequence
- Flags any UX decisions that affect backend requirements
- Output: `ux-spec.md` — wireframes, user flow, onboarding, paywall placement

**Bartholomew gate:** Revenue Strategist and UI/UX Designer must both be complete before CTO is tasked. No architecture begins without both.

---

### Phase 3 — Architecture (End of Week 1)

**Step 5: CTO / Architect**
- Reads `product-decision.md`, `monetization-decision.md`, `ux-spec.md`
- Designs system architecture: data models, API structure, payment infrastructure, third-party dependencies
- Enforces shared architecture patterns from the portfolio — no unique snowflake per app
- Flags any dependency that violates the no-vendor-lock-in principle
- Output: `architecture-spec.md` — system design, data models, tech stack decisions, dependency list

**Step 6: Tech Lead**
- Reads `architecture-spec.md`
- Breaks architecture into concrete development tasks
- Defines code standards for this app consistent with portfolio conventions
- Assigns tasks to Frontend and Backend Engineers in the correct sequence
- Output: `task-breakdown.md` — ordered task list, code standards, acceptance criteria per task

---

### Phase 4 — Build (Week 2 + Week 3)

**Step 7: Backend Engineer**
- Reads `task-breakdown.md` and `architecture-spec.md`
- Builds API, database, payment infrastructure, and trial logic
- Submits each completed component to Tech Lead for review before Frontend starts integration
- Output: working backend + `backend-completion-report.md`

**Step 8: Frontend Engineer**
- Reads `task-breakdown.md`, `ux-spec.md`, and `architecture-spec.md`
- Implements Swift UI against the wireframes
- Does not begin integration until Backend Engineer signals completion
- Output: working frontend + `frontend-completion-report.md`

**Tech Lead review runs continuously during Phase 4:**
- Reviews every backend and frontend output against code standards
- Sends back anything that doesn't meet the acceptance criteria
- Nothing proceeds to QA until Tech Lead has signed off

---

### Phase 5 — QA and Submission (Week 4)

**Step 9: QA Engineer**
- Reads `task-breakdown.md` acceptance criteria, `ux-spec.md`, and `architecture-spec.md`
- Tests all functionality, edge cases, payment flows, trial expiry, onboarding sequence
- Verifies App Store guideline compliance — privacy policy, permissions, metadata
- Hard gate: any crash, payment failure, or guideline violation is a block. No submission until clean.
- Output: `qa-report.md` — pass/fail per test case, any blocks found

**Bartholomew gate:** QA must issue a clean pass before submission is triggered. A failed QA report routes back to the relevant engineer, not forward to submission.

**Step 10: Marketing Manager**
- Reads `product-decision.md`, `monetization-decision.md`, `ux-spec.md`
- Prepares App Store listing: title, subtitle, description, keywords, screenshots guidance
- Prepares launch positioning: who is this for, what does it solve, why now
- Output: `launch-package.md` — App Store copy, keyword strategy, launch messaging

**Submission:**
- Bartholomew confirms QA pass + launch package complete
- You are prompted to review and submit
- Bartholomew logs the cycle completion in `audit-history.md`

---

## Track 2: The Monitor Pipeline

Runs on-demand. You prompt Bartholomew when you want a portfolio review. Nothing in Track 2 runs automatically or burns tokens in the background — except crash reporting, which is handled passively outside the agent pipeline entirely.

**Crash Reporting — Passive, Zero Token Cost:**
- Every app gets Firebase Crashlytics integrated by the CTO agent at build time
- Crashlytics runs independently on the app, costs nothing, and emails you directly when a crash occurs
- No agents involved, no token burn
- When you receive a crash alert, you decide whether to prompt Bartholomew to investigate and trigger a hotfix cycle

**When you prompt Bartholomew for a portfolio review:**

**Marketing Manager:**
- Pulls App Store reviews across all live apps since the last review
- Pre-filters raw feedback: flags valid signals, discards fluff, bias, and off-topic complaints
- Groups recurring complaints — patterns across multiple users carry more weight than single reviews
- Responds to reviews where appropriate, especially negative ones
- Output: `feedback-intake-report.md` — filtered signals categorized by type (UX, bug, pricing, marketing, feature request)

**Business Analyst:**
- Reads `feedback-intake-report.md`
- Validates whether each signal is statistically meaningful
- Cross-references with forum data if needed to confirm the signal exists beyond the App Store
- Rejects signals that are isolated, biased, or unsubstantiated
- Output: `validated-feedback-report.md` — only feedback that is logical, recurring, realistic, and constructive

**PM:**
- Reads `validated-feedback-report.md`
- Makes the final call on each validated signal: act on it, queue for next update, or reject with reasoning
- Scope filter: any change contradicting the app's defined purpose is rejected regardless of feedback volume
- Output: `feedback-decision.md` — approved changes with rationale, rejected signals with reasoning

**Bartholomew — routing:**
- Reads `feedback-decision.md`
- Routes each approved change to the correct agent:
  - UX complaint → UI/UX Designer
  - Bug → QA Engineer + relevant Engineer
  - Pricing objection → Revenue Strategist
  - App Store description issue → Marketing Manager
  - Architecture-level change → CTO first, then cascades down
- Scopes work tightly — a single validated complaint does not trigger a full rebuild
- Logs all routing decisions and outcomes in `audit-history.md`

**The feedback loop closes when:**
- The relevant agent produces a fix or update
- Tech Lead reviews it
- QA signs off
- Bartholomew logs the resolution and monitors whether the signal disappears in the next review you trigger

---

## Resolved Questions

- **1 app per month** is the cadence. Quality over volume.
- **Free trial is default** for any subscription model.
- **Monetization decided before architecture.** Always.
- **Bartholomew is the only human-facing agent.** You prompt him, he handles everything downstream.
- **Hotfixes run in parallel** to the build cycle, not inside it.
- **Bartholomew alerts:** Track 2 is fully on-demand — triggered by you, not on a schedule. The only exception is crash reporting, which runs passively via Firebase Crashlytics and emails you directly. No agents, no token cost. You decide when to escalate to Bartholomew.
- **Crash reporting:** Firebase Crashlytics integrated into every app by the CTO at build time. Passive, free, and completely outside the agent pipeline.
- **Reddit research:** Fully automated by default. Business Analyst flags uncertainty when signal is weak, ambiguous, or the App Store opportunity is unclear. Only then does Bartholomew surface the raw findings to you for a judgment call before the PM proceeds.

---

## Unresolved Questions

None. All questions resolved. Pipeline is ready for AGENTS.md.

---

## Tensions

- **Build cycle speed vs. monitoring load:** As the portfolio grows, Track 2 gets heavier. At some point monitoring 10+ apps while building a new one creates real load. This doesn't need solving now but should be watched.
- **Scope control vs. user feedback:** Users will request features. The PM must have a clear filter for what qualifies as a scope addition vs. a core fix. Without this, the build cycle expands and the monthly cadence breaks.



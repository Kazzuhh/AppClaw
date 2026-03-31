# problem.md
> Living document. Disposable once solved. Last updated: bootstrap session.

---

## The Core Problem

Building a repeatable, solo-operated pipeline that discovers real user pain from forums, validates it as a monetizable app opportunity, and ships one polished Swift app to the App Store per month — without the pipeline itself becoming the bottleneck. One app per month is a deliberate quality constraint, not a limitation. App Store rejection wastes an entire cycle and damages developer reputation.

---

## Sub-Problem 1: Separating real pain from noise

Reddit and forums are full of complaints. Most are venting. A small fraction represent genuine unmet needs that users would pay to solve. There is no obvious filter between "people are frustrated" and "people will pay for a solution."

**Why it's hard:** Volume is high, signal is low. The same complaint thread might have 400 upvotes but represent a problem already solved by 5 existing apps. Pain intensity does not equal market gap.

**What makes it harder:** The Business Analyst agent must apply this filter consistently across every niche without human review of every post. The criteria for "real pain worth building for" must be encoded explicitly in its skill — it cannot rely on judgment that hasn't been defined.

**Interactions:** Directly feeds PM and Revenue Strategist. A bad signal here poisons every downstream decision.

---

## Sub-Problem 2: Validating the App Store opportunity, not just the problem

Even real pain doesn't mean a viable App Store app. The gap between "problem exists" and "bootstrapped solo app can win here" is where most indie developers fail.

**Why it's hard:** Some niches have real pain but are dominated by free apps backed by VC funding. Others have paid apps but terrible reviews — which is actually an opportunity. Distinguishing these requires App Store-specific research, not just forum research.

**What makes it harder:** This validation step must happen before architecture decisions are made. The CTO cannot design a system without knowing what monetization model the Revenue Strategist will recommend, and the Revenue Strategist cannot recommend a model without knowing the competitive App Store landscape.

**Interactions:** Business Analyst feeds this. Revenue Strategist owns it. PM makes the go/no-go call. CTO cannot start until this is resolved.

---

## Sub-Problem 3: Monetization architecture must be decided before the build

Subscriptions, one-time purchases, and freemium models require different backend infrastructure. Deciding monetization after the app is designed creates rework.

**Why it's hard:** Revenue Strategist and CTO must be in sync before implementation starts. In a multi-agent pipeline, these are separate agents with separate skills. The handoff between them must be explicit and sequenced correctly.

**What makes it harder:** Monetization strategy is per-app, not universal. The Revenue Strategist must reason about each app individually based on category norms, competitor pricing, and user willingness to pay — then hand a concrete decision to the CTO before architecture begins.

**Interactions:** Revenue Strategist → CTO handoff is a critical dependency. If this is skipped or happens out of order, Backend Engineer builds the wrong payment infrastructure.

---

## Sub-Problem 4: App Store quality bar is unforgiving for a 1 app/month pipeline

Apple rejects apps with bugs, crashes, or guideline violations. Users leave 1-star reviews permanently. A pipeline optimized for volume without strict quality gates will produce apps that fail review or get buried in ratings, destroying the portfolio strategy.

**Why it's hard:** One app per month sounds manageable but the full pipeline — research, validation, architecture, build, QA, App Store submission — must complete cleanly within that window. Any rework resets the clock. The QA and Tech Lead agents must be the enforcement mechanism for this — they cannot be lightweight checkboxes.

**What makes it harder:** Swift-specific quality standards (memory management, UI responsiveness, accessibility, App Store guidelines) must be encoded explicitly in the Tech Lead and QA skills. Generic code review is not enough.

**Interactions:** QA gates every release. Tech Lead sets the code standards that QA checks against. CTO defines the architecture QA validates. If any of these are weak, the pipeline ships broken apps.

---

## Sub-Problem 5: Agent orchestration without human bottlenecks

10 agents with different outputs, dependencies, and failure modes must coordinate without requiring constant human intervention. Handoffs between agents must be explicit. Outputs must be in formats the next agent can consume. Failures must surface clearly, not silently.

**Why it's hard:** Agent pipelines fail in non-obvious ways. An agent produces output that looks complete but is missing a critical decision. The next agent proceeds on incomplete information. The failure shows up 3 steps later, requiring backtracking.

**What makes it harder:** Bartholomew (the orchestrator) must understand the dependency graph of the entire pipeline and enforce sequencing. His skill is the most complex to write and the most critical to get right.

**Interactions:** Every agent depends on Bartholomew's orchestration being correct. STATE.md per agent is the mechanism that prevents work loss between sessions.

---

## Sub-Problem 6: Portfolio coherence vs. per-app chaos

At 1 app per month, the portfolio grows steadily. Without shared standards for architecture, UI patterns, backend structure, and code conventions, each app becomes a unique maintenance burden. Solo-maintainability breaks down at scale.

**Why it's hard:** Speed pressure on each individual app works against shared standards. Every shortcut taken to ship faster is a maintenance cost paid later.

**What makes it harder:** The CTO and Tech Lead must enforce shared architecture patterns across all apps — not just within each app. This is an explicit cross-app responsibility that must be encoded in their skills.

**Interactions:** CTO owns the shared architecture. Tech Lead enforces it per-app. Frontend and Backend Engineers must follow it. This is a philosophy constraint, not just a technical one.

---

## Sub-Problem 7: Post-launch monitoring, maintenance and reputation management

A shipped app is not a finished app. User reviews surface bugs, UX friction, and missing features. Crashes happen in production that never appeared in QA. App Store ratings directly affect discoverability and download conversion. A portfolio of apps with no monitoring will decay.

**Why it's hard:** At 1 app per month, the pipeline is always moving forward. Without a monitoring strategy, newly shipped apps get abandoned the moment the next build cycle starts. Bugs go unfixed. Negative reviews go unanswered. Ratings drop.

**What makes it harder:** Continuous monitoring burns tokens unnecessarily. The solution must be lean — passive where possible, agent-powered only when triggered by a human decision.

**The approach:** Crash reporting runs passively via Firebase Crashlytics, integrated into every app at build time. It costs nothing and emails directly without any agent involvement. Everything else — review analysis, feedback routing, hotfix decisions — runs on-demand when prompted. This keeps the pipeline cost-effective while ensuring critical issues still surface immediately.

**Interactions:** CTO integrates Crashlytics at build time for every app. When a crash email arrives, you decide whether to trigger a hotfix cycle via Bartholomew. Review analysis and feedback routing are triggered manually on your schedule.

---

## Sub-Problem 8: Evaluating feedback quality and routing valid signals to the right agents

Not all feedback is equal. A 1-star review from a user who misunderstood the app is not the same as a 1-star review from a user who found a real UX failure. A feature request from one person is noise. The same request from 40 users is a signal. Acting on bad feedback wastes a build cycle. Ignoring good feedback kills retention and ratings.

**Why it's hard:** Feedback comes in raw and unfiltered. Reviews are emotional, biased, sometimes incoherent. The pipeline needs a judgment layer that separates valid, actionable feedback from fluff — before any agent spends time on it.

**What makes it harder:** Valid feedback needs to be routed to the right agent. A UX complaint goes to UI/UX Designer. A crash report goes to QA and Backend Engineer. A pricing objection goes to Revenue Strategist. A misleading App Store description goes to Marketing Manager. No single agent can handle all of this — but someone has to triage it intelligently before routing.

**What qualifies as valid feedback:**
- Logical: the complaint reflects a real, reproducible experience
- Recurring: more than one user independently raises the same issue
- Realistic: the suggested improvement is achievable within the app's scope
- Constructive: it identifies a problem, not just expresses frustration

**What does not qualify:**
- Biased reviews: competitor reviews, personal vendettas, off-topic complaints
- Fluff: vague praise or criticism with no actionable content
- Scope creep requests: feature demands that contradict the app's defined purpose
- One-offs: isolated complaints with no corroborating signal elsewhere

**Interactions:** Marketing Manager collects and pre-filters raw feedback. Business Analyst validates whether the signal is statistically meaningful. PM makes the final call on whether it warrants a change. Bartholomew routes the validated decision to the relevant agent and logs it in audit-history.md.

---

## What This Problem Set Is Not

- This is not a problem of finding app ideas. Ideas are cheap. The pipeline exists to find validated pain, not ideas.
- This is not a problem of coding ability. The agents handle implementation. The problem is pipeline design and quality enforcement.
- This is not a problem of marketing creativity. The Marketing Manager works from what the pipeline produces. The problem is producing things worth marketing.

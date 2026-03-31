# Product Decision — TiltBreak (working title)
Date: 2026-03-18
Agent: PM

## Decision
[x] GO

## Core Problem (One Sentence)
Competitive gamers and performance-oriented people lose composure in high-stress moments and have no in-the-moment tool to interrupt the anger response before it costs them a game, a relationship, or a decision they regret.

## Target User
Specific. Not "anyone who..."

- Who: Competitive gamers aged 18–34 who know they have a tilt problem and want to fix it as a performance issue — not someone seeking therapy or a clinical label, someone who wants a mental edge
- What they've tried: Meditation apps (wrong language, wrong self-image), YouTube tilt guides (no accountability, no in-the-moment activation), willpower alone (no technique, no interrupt)
- Why those failed: Calm and Headspace speak to the stressed professional unwinding before bed — not the competitive player who needs an interrupt at 11pm after their third ranked loss in a row. YouTube has no activation mechanism. Willpower cannot override a 90-second chemical process without a tool.

## Why This Gap Is Real
Calm and Headspace dominate the wellness app market but explicitly serve the sleep and general stress reduction lane. They are not trying to own the composure and performance lane and they have not built for it. Every existing alternative — MindShift, Woebot, journaling apps — is retrospective: they require the user to already be calm enough to open an app and reflect. The core gap is structural and specific: no app has a one-tap in-the-moment interrupt that activates during the rage event itself, the 90-second chemical window when intervention actually works. This is not a "we'll do it better" gap. It is a "no one has built this specific thing" gap, and the target community has already invented the language for it. The word "tilt" exists. The pain exists. The product does not.

## Minimum Viable Scope

### In Scope
- Tilt Button — one-tap 90-second guided interrupt. Breathing prompt, visual countdown, grounding cue. Accessible from home screen widget. Must activate in one tap — if it requires navigation, it fails its use case. This is the product. Everything else is retention.
- Composure Score — weekly performance metric. Tilt events triggered versus interrupts completed. Expressed as a percentage. Users check it, track it, and want to improve it. This is the retention hook.
- Accountability Streak — days without a rage quit. Duolingo-style loss consequence. Simple. Effective. Drives daily re-engagement without clinical pressure.
- Post-Session Review — one to two screens summarizing tilt events in a session. No journaling prompts. Just the data: when tilts happened, whether the interrupt was used. Pattern observation only — no AI, no coaching in v1.
- Crisis Resources — accessible in settings. Not marketed. Required for ethical and legal protection. Surface passively after extreme tilt events with neutral language.
- Onboarding — short setup: gaming context, composure goal, notification preferences. Under two minutes. No clinical intake. No diagnostic language.

### Out of Scope (Explicitly Named)
- Friend and social accountability sharing — word-of-mouth driver but adds backend complexity and moderation risk. v2.
- Session timer with auto-prompt — valid retention feature but not core to the rage interrupt problem. v2.
- AI pattern analysis and coaching suggestions ("you tilt most after two losses between 11pm and 1am") — compelling but requires data accumulation and machine learning infrastructure. Out of v1. The post-session review provides a manual version.
- Professional mode UI skin for day traders and athletes — valid TAM expansion but a separate positioning and go-to-market decision. Do not dilute the launch.
- Community features and leaderboards — social layer adds complexity and moderation overhead that a solo developer cannot absorb. Out entirely for v1.
- Custom breathing technique library — one technique executed well beats a library. Add variety in v2 after confirming which users want it.
- Calendar and schedule integration — out of scope entirely.
- Wearable and biometric integration — out of scope entirely.
- ADHD-specific positioning or features — the ADHD community is a valid secondary audience but marketing to a clinical diagnosis creates legal and support risk. They can discover the product; do not market to them by diagnosis.

## Success Metric
Trial-to-paid conversion above 8% within 60 days of launch.

Secondary: 30-day retention above 35%.

The tilt button must be free on the free tier. It is the acquisition hook. It must work immediately on first download and prove value before any paywall is encountered.

## Constraints for Downstream Agents

Legal — wellness and performance positioning only throughout. No clinical claims. No claims the app treats, cures, or diagnoses anger disorders, anxiety, or any mental health condition. Crisis resources must be present and accessible. Terms of service must explicitly state the app is for general wellness purposes only and is not a substitute for professional mental health support. This language should be clear and readable — not buried.

Tilt Button activation must be achievable in one tap from a home screen widget. This is a non-negotiable UX constraint. If Revenue Strategist proposes any paywall on the tilt button itself — reject it. The interrupt must be free and frictionless.

Onboarding must be under two minutes. Competitive gamers will not tolerate intake forms. No clinical or diagnostic language in any copy.

Composure Score is the primary retention and upsell mechanic. Full score history, weekly trends, and post-session review are the paid tier differentiators. Free tier gets current week score only.

Pricing target: $6.99/month or $59.99/year. Below Calm on annual price but with a stronger specific use case. Do not go above $7.99/month — the target user is 18–34 and price-sensitive relative to the Calm/Headspace buyer.

The app's visual language should be performance-oriented and clean — not clinical white, not aggressive gamer aesthetics. Think composure, precision, control. It must naturally generalize beyond gaming without requiring a redesign.

## PM Notes

Risk 1 — behavior change dependency. The tilt button only works if users pick up their phone during a rage moment. This is a habit formation problem, not just a product problem. Onboarding must explicitly set this expectation: the first use is the hardest; after five uses it becomes automatic. If users download and never activate the button, the product has failed regardless of how well it is built.

Risk 2 — the 90-second rule is the scientific and marketing backbone. It should be made explicit in onboarding and marketing. Jill Bolte Taylor's research gives the core mechanic a credible, non-clinical, performance-science frame. However: do not overclaim scientific consensus. "Based on neuroscience research" is the right frame. "Clinically proven" is not. If the research comes under scrutiny, the app's credibility comes with it.

Risk 3 — composure score gamification could produce shame rather than motivation if users see low scores and feel judged. All language around the score must be progress-framed: "up from last week," "your best streak," "composure improving." Never "you tilted 14 times." Always "you completed 6 of 8 interrupts — 75% composure."

Risk 4 — the ADHD secondary audience brings higher support expectations and potentially clinical expectations the product cannot meet. Serve them well through good product design. Do not market to them by diagnosis. If negative reviews cite unmet clinical expectations, that is a marketing failure, not a product failure.

Risk 5 — the gaming entry point is strong but the TAM is genuinely broader. Day traders, competitive athletes, sales professionals, parents — the same product works for all of them. The launch should not over-index on gaming aesthetics to the point where natural expansion to adjacent audiences requires a redesign. Clean and performance-oriented is the right call.

What would make me revisit this decision: if early retention data shows users activate the tilt button once and never return, the behavior change challenge is larger than the product can solve alone and scope needs to expand to include notification-based habit coaching. That is a v1.5 decision, not a launch blocker.

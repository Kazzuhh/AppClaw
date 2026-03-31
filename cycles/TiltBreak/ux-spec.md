# UX Spec — TiltBreak
Date: 2026-03-18
Agent: UI/UX Designer

---

## Value Moment

The user taps the tilt button during an active rage moment, completes the 90-second interrupt, and sees their composure score register — proof that the product worked in the moment it was needed. This must happen in session 1. If the user downloads TiltBreak and the button is not the first thing they interact with, the product has failed its core promise. Every design decision exists to get the user to this moment as fast as possible.

---

## User Intent

Primary: Interrupt a rage event instantly with one tap — no navigation, no friction, no delay.
Secondary: Track composure performance over time and feel it improving session to session.

---

## User Context

At home or a gaming space, typically late night, emotionally activated, potentially one hand on keyboard or controller. Session length is short when tilting — 10 seconds of intent before the moment passes. Large tap targets are non-negotiable. Minimal text input. Zero cognitive load during the interrupt itself. Ambient analytics review happens post-session when the user is calm — this is when richer interaction is acceptable.

---

## Full User Flow

```
First launch
    → Screen 1: Welcome — value proposition and single CTA (GET STARTED)
    → Screen 2: Quick Setup — gaming context, composure goal, notification opt-in
    → Screen 3: Widget Prompt — install home screen widget (skippable)
    → Screen 4: Home — VALUE MOMENT (tilt button front and center, first composure score after first use)
    → Screen 5: Tilt Interrupt — two-phase interrupt: Phase 1 rage channel (osu!-style bubble tap, dynamic duration until tap frequency decays), auto-transitions to Phase 2 90-second guided calm
    → Screen 6: Interrupt Complete — composure confirmation, streak update, re-entry
    → Screen 4: Home (ongoing core loop — check score, start session, use button)
    → Screen 7: Composure Dashboard — score history and trends (full access during 7-day trial)
    → Screen 8: Post-Session Review — per-session tilt event summary
    → Screen 9: Paywall — PAYWALL fires in-context on day 8+ when user navigates to analytics beyond current week
    → Screen 10: Settings — notifications, crisis resources, terms of service
```

---

## Screen Inventory

| # | Screen Name | Single Purpose | Primary Action | Next Screen |
|---|-------------|----------------|----------------|-------------|
| 1 | Welcome | Communicate the outcome in one statement and move the user forward | Tap GET STARTED | Quick Setup |
| 2 | Quick Setup | Collect only what is needed: context, goal, notification opt-in | Tap DONE / notification permission | Widget Prompt |
| 3 | Widget Prompt | Get the widget on the home screen for one-tap activation | Tap ADD WIDGET (skippable) | Home |
| 4 | Home | Central hub: tilt button, current week score, streak, recent activity | Tap TILT BUTTON | Tilt Interrupt |
| 5 | Tilt Interrupt | Two-phase interrupt: Phase 1 — osu!-style bubble tap game channels rage energy (dynamic duration, ends when tap frequency decays); Phase 2 — 90-second guided breathing and grounding countdown once adrenaline has discharged | Complete Phase 2 countdown or early exit | Interrupt Complete |
| 6 | Interrupt Complete | Confirm composure held, update streak, return user to flow | Tap READY TO CONTINUE | Home |
| 7 | Composure Dashboard | Show composure score history, weekly trends, sharing card (free week / full history gated) | Tap SHARE or view trend | Paywall (if history locked) |
| 8 | Post-Session Review | Summary of tilt events in the last session — when, interrupt used or not, score | Dismiss | Home |
| 9 | Paywall | In-context analytics upgrade gate — blurred history visible behind | Tap annual CTA or CONTINUE FREE | Dashboard (paid) or Home |
| 10 | Settings | Notifications, crisis resources, terms of service, account | Navigate to sub-settings | — |

Total screens: 10. Within budget.

---

## Onboarding Detail

Screen count: 3 of 3 max

Screen 1 — Welcome
- Headline: "The chemistry of rage lasts 90 seconds. We give you those 90 seconds back."
- Sub-copy: "TiltBreak is a performance tool for competitive people who want composure, not excuses."
- Single CTA button: GET STARTED
- No account creation. No sign-in. No email. User lands directly in the product.
- Visual: clean, performance-oriented. Dark or neutral background. Not clinical white. Not neon gaming.
- Small footer link: "Terms of use — this app is a wellness and performance tool, not a substitute for professional mental health support." (Readable, not buried. Links to full ToS.)

Screen 2 — Quick Setup
- Two fields only, both optional with defaults:
  1. "What brings you here?" — preset chips: Competitive gaming / High-pressure work / I just get angry / Other. Defaults to Competitive gaming. No free-text input.
  2. "What's your composure goal?" — preset chips: Stay calm in ranked / Protect relationships / Make better decisions under pressure. Select one.
- Notification opt-in: "Get reminders to use the button. We'll only notify you when it matters." Toggle + standard iOS permission prompt fires here — contextual and explained, not upfront.
- CTA: DONE
- No diagnostic language. No clinical intake. No more than 45 seconds to complete.

Screen 3 — Widget Prompt
- Headline: "One tap. No unlocking. No navigation."
- Sub-copy: "Add TiltBreak to your home screen so the button is there exactly when you need it."
- CTA: SHOW ME HOW (opens iOS widget instructions inline or as a brief overlay)
- Skip option: "I'll do this later" (returns to home, widget prompt resurfaces once after first tilt event)
- This screen is the only non-mandatory screen. Make the skip obvious — do not bury it.
- 7-day premium trial activates silently at this transition. No prompt, no opt-in. User lands in Home with full access.

Permissions requested:
- Push notifications — Screen 2, contextual ("We'll notify you when it matters"). Fires iOS permission dialog inline.
- Home screen widget — Screen 3, explained and skippable. No permission required beyond user action.
- No camera, location, microphone, health data, or contacts. No permissions beyond these two.

Account creation: Not required in onboarding. Not required to use the tilt button or see current week score. If account is needed for streak persistence across reinstalls, prompt it at the moment of first paid conversion — not before. User should not see an account creation screen before the value moment. This is a backend architecture decision — see Constraints section.

---

## Paywall Screen

Headline: "Your composure is improving — see how far you've come."

Sub-copy: Show the full composure history chart blurred behind the paywall UI. The user can see the shape of their progress — the curve, the trajectory — but cannot read the values. The visual makes the locked data feel real and earned, not hypothetical.

Trial CTA: "Continue full access — $59.99/year" (annual pre-selected, above the fold)

Default selection: Annual — "$59.99/year · Save 29% · Less than $5/month" shown clearly. Monthly option visible below as secondary: "$6.99/month."

Dismiss option: "Continue free" — visible, same visual weight as the secondary monthly option. Tapping it returns the user to Home without friction. No confirmation dialog. No guilt copy. No "are you sure?"

Placement: In-context only. Fires when user navigates to composure history or analytics beyond current week, starting day 8 of trial. Never fires as a cold interstitial. Never fires during or immediately after a tilt interrupt. The tilt button remains fully functional at all times, free tier or paid.

Trial expiry notification: One push notification 24 hours before trial ends. Copy: "Your composure history access ends tomorrow — see your full progress." One notification only. Not a sequence.

---

## Core Loop

What the user does every session:

1. Open game (or enter high-pressure situation)
2. Feel tilt onset → tap tilt button from home screen widget or Home screen
3. Phase 1: tap bubbles to channel the rage — fast, physical, satisfying. Ends automatically when tap frequency naturally decays below threshold. Duration varies by rage magnitude.
4. Phase 2: 90-second guided breathing and grounding countdown begins. User is physiologically ready now — adrenaline discharged.
5. See composure confirmation and streak update (Interrupt Complete screen)
6. Return to session
7. Post-session: check Home screen for updated composure score and streak
8. Periodically: navigate to Composure Dashboard to review weekly trend
9. Share composure score card when score is high (free, watermarked)

The loop has no dead ends. Every screen has a clear next action. The post-session review surfaces automatically after a session ends (triggered by user returning to app, not by a timer — see Constraints).

---

## Edge Cases Handled

| Screen | Edge Case | Solution |
|--------|-----------|----------|
| Welcome | User opens app for first time with no network | Onboarding fully offline. No network required for onboarding or tilt button. |
| Quick Setup | User skips all chips (selects nothing) | Default values applied silently. No blocking validation. Never prevent forward movement. |
| Home | No tilt events yet (new user) | Composure score shows "—" with copy: "Use the button once to start tracking." Streak shows "0 days." No empty state anxiety — frame as a starting line. |
| Home | Tilt button tapped rapidly twice | Debounce the button. Second tap within 2 seconds does nothing. One interrupt at a time. |
| Tilt Interrupt — Phase 1 | User taps slowly from the start (rage already low) | Phase 1 transitions quickly — even a few seconds of taps is valid. No minimum duration enforced. Short Phase 1 is a correct outcome, not an error. |
| Tilt Interrupt — Phase 1 | User never decelerates — sustained high tap rate hits the max duration cap | Phase 1 ends at the cap and transitions to Phase 2 regardless. No user prompt, no warning — seamless transition. Max cap duration is a product decision: see Designer Notes. |
| Tilt Interrupt — Phase 1 | Bubble spawns overlap or cluster in an untappable area | Enforce minimum bubble spacing (recommend 60pt clearance). Bubbles that would overlap reposition on spawn. Never allow an untappable cluster — this breaks the core mechanic. |
| Tilt Interrupt — Phase 1 | User exits mid-Phase 1 (background app or lock screen) | Phase 1 pauses. On return, resume prompt: "Continue your interrupt?" with RESUME and EXIT options. Phase 1 tap data collected so far is preserved. Do not count an abandoned interrupt as completed. |
| Tilt Interrupt — Phase 1 → Phase 2 | Transition between phases | Automatic, no user action required. Screen crossfades from Phase 1 visual (active, energetic) to Phase 2 visual (calm, countdown). Brief transitional copy appears: "Good. Now breathe." 400ms crossfade. No jarring cut. |
| Tilt Interrupt — Phase 2 | User exits mid-Phase 2 (background app or lock screen) | Phase 2 timer continues in background (wall clock anchored). On return, show remaining time accurately. Resume prompt not shown for Phase 2 — timer ran in background, user rejoins where they are. If Phase 2 already completed while backgrounded, show Interrupt Complete screen on wake. |
| Tilt Interrupt — Phase 2 | Interrupt completes but phone is face-down or screen off | Haptic pulse on Phase 2 completion. On screen wake: show Interrupt Complete screen. Do not auto-dismiss. |
| Interrupt Complete | User's first ever interrupt | Add first-use copy: "That's one. Five uses and it becomes automatic." Disappears after 5 completions. |
| Composure Dashboard | Free user on day 8+, history locked | Render full chart blurred. Lock icon over historical weeks. Paywall CTA above the fold. Current week score always visible, never locked. |
| Composure Dashboard | User has only 1 day of data | Show single bar/point in trend chart. "Keep going — your trend builds over time." No misleading chart lines with single data points. |
| Post-Session Review | No tilt events in session | Do not surface post-session review. Only appears when at least one tilt event occurred in session. |
| Post-Session Review | User had 8+ tilt events in one session | Show first 5 with "and 3 more." No scroll list longer than 5 items. Suggest: "Tonight was intense. Take a break if you need one." — neutral, no clinical language. Add passive crisis resources link ("Support resources" — plain text, bottom of screen). |
| Paywall | User is mid-trial (days 1–7) | Paywall screen never appears. Dashboard and history fully accessible. |
| Paywall | User taps CONTINUE FREE | Return to Home instantly. No friction, no guilt. Tilt button works exactly as before. |
| Settings | Crisis resources | Accessible from Settings at all times. Plain list of resources (988 Lifeline, Crisis Text Line, etc.). No clinical framing. Copy: "These resources are here if you need them." |
| Widget | Widget installed but user hasn't set context in onboarding | Widget tap deep-links to Tilt Interrupt directly. No setup required to use the button. |
| Widget | Widget tap while app is open to another screen | Interrupt flow opens as a sheet over current screen. Does not reset navigation state. |
| All screens | Title or label text very long | Truncate with ellipsis at 2 lines max. Composure goal chips truncate at 28 characters. |
| All screens | Dynamic type / large accessibility text | All layouts tested at largest Dynamic Type setting. Tilt button minimum tap target: 80×80pt regardless of text size. |

---

## Animation Notes

- Tilt button press → Immediate haptic (heavy impact) + brief ring-expand pulse (200ms, ease-out). Confirms tap before any loading. Critical: if the user is in a rage moment and the button feels unresponsive, they abandon it.
- Phase 1 bubble spawn → Each bubble appears with a brief scale-in pop (100ms, spring easing). Randomized positions within the screen safe area (away from notch, home indicator, tab bar). Spawn rate adapts loosely to the user's current tap tempo — not so fast it becomes unplayable, not so slow it feels passive. Exact spawn rate algorithm is a CTO decision; UX requirement is that there is always at least one bubble on screen to tap.
- Phase 1 bubble tap → Immediate burst animation (80ms, radial expand then fade) + medium haptic on each tap. Lighter haptic than the tilt button press — this is sustained interaction, not a one-time confirmation. Bubble disappears on tap instantly; no linger.
- Phase 1 tap frequency signal → No visible UI indicator of "your rage is decaying" — the transition to Phase 2 happens automatically. Do not show a progress bar toward Phase 2. User should not be able to game the transition; they should just tap until they feel it shift.
- Phase 1 → Phase 2 transition → 400ms crossfade. Phase 1 visual (dark background, active bubble field) fades to Phase 2 visual (calm, centered countdown). Transitional copy overlays the crossfade: "Good. Now breathe." Copy fades out as Phase 2 countdown appears. No sound effect — visual and haptic only (single light haptic pulse at transition).
- Phase 2 countdown ring → Steady fill animation over 90 seconds. Smooth, continuous. Not segmented. Represents time remaining as a shrinking arc — calm and precise, not anxious.
- Interrupt Complete → Composure score increments with a short count-up animation (300ms). Streak number flips. Both communicate "something changed" without celebration that feels condescending.
- Streak milestone (7 days, 30 days, etc.) → Single brief particle effect over streak counter. Restrained. Not a fireworks show. One acknowledgment, then back to normal.
- Composure Dashboard chart → Bars or line animate in on screen load (400ms staggered). Blurred history animates in already blurred — no visible "blurring" transition that feels like a trick.
- Navigation transitions → Standard iOS push transitions. Do not deviate. The product's originality is in the mechanic, not the navigation chrome.
- No animations on: Welcome screen (load fast), Paywall (no showmanship during a conversion moment), Settings.

---

## Layout Convention Decisions

- Tilt button is centered and dominant on Home screen. It is the largest interactive element on screen by a significant margin. Minimum 140×140pt circle. No visual clutter competing with it. This is not a conventional list-based home screen — the button is the home screen. Deviation justified: the product's entire value proposition is one-tap access to the button. Burying it in a list would contradict the product's reason for existing.
- Bottom tab navigation: Home, Dashboard, Settings. Three tabs only. Standard iOS bottom bar. No hamburger menu. No side drawer. Navigation is invisible — the user should never think about it.
- Composure score and streak live below the tilt button on Home, not above it. The button is always the first element the eye lands on. Score and streak are context, not destination.
- Post-Session Review surfaces as a bottom sheet over Home rather than a full navigation push. User returns to their previous context immediately on dismiss. Keeps the core loop tight.
- Paywall is a full-screen modal (not a tab or a push). It appears over the Dashboard and can be dismissed. It is not a destination in the nav — it is a gate.

---

## Constraints for CTO and Engineers

1. **Widget deep-link must bypass the full app navigation stack and launch directly into Phase 1 of Tilt Interrupt.** Widget tap triggers Phase 1 (bubble tap game) immediately, without loading Home first. This is the non-negotiable constraint from PM and Revenue Strategist. Must function even if the app has been force-quit. Requires iOS WidgetKit configuration with a deep-link intent that launches into Phase 1 directly. If this is not technically achievable with a force-quit cold launch in the required timeline, surface this immediately — it changes the onboarding promise.

2. **Tilt button tap response must be under 100ms to first visual feedback, and Phase 1 bubbles must appear within 200ms of launch.** The haptic and ring animation on the tilt button must fire before any state update completes. Phase 1 must feel instantaneous — if the user waits more than 200ms for the first bubble, the rage moment may have passed. Use optimistic UI — show the response, then process.

3. **Phase 1 tap frequency decay algorithm.** Phase 1 ends when tap frequency falls below a defined threshold for a sustained window. Recommended implementation: rolling 3-second window; if taps-per-second drops below 1.0 for 3 consecutive seconds, trigger Phase 2 transition. Exact threshold values are a product decision — PM must confirm before build. The algorithm must be tunable post-launch without an app update (remote config preferred).

3a. **Phase 1 max duration cap: 60 seconds (confirmed by operator).** Phase 1 must have a hard ceiling to prevent an infinite Phase 1 for users who do not naturally decelerate. At 60 seconds, Phase 2 begins automatically regardless of tap frequency. Maximum total interrupt duration: 60s Phase 1 cap + 90s Phase 2 = 2.5 minutes.

3b. **Phase 1 data capture.** Every Phase 1 session must log: start timestamp, end timestamp, total bubble taps, peak taps-per-second (1-second window), average taps-per-second, Phase 1 exit reason (frequency decay vs. max cap vs. user exit). This data feeds the composure score calculation and pattern tracker. The data model must be defined now — retrofitting it post-launch loses the early user dataset.

3c. **Phase 2 timer must not drift or pause on screen lock.** Use a background-safe timer anchored to wall clock time (Date() diff on resume), not an incremented interval. If the user locks their phone during Phase 2, the timer continues in background. On screen wake, show remaining time accurately. Note: Phase 1 does NOT continue in background on lock — it pauses and shows a resume prompt on return.

4. **Trial state management via StoreKit 2 entitlements** — no custom trial logic on the client. Trial start timestamp stored locally and in StoreKit receipt. On day 8, paywall gate is enforced by entitlement check when Dashboard is loaded beyond current week view.

5. **Composure history data must exist and be rendered (blurred) for the paywall to work.** The backend must write composure data for all users from day 1, regardless of tier. The paywall shows real blurred data, not placeholder graphics. This means the data pipeline cannot be gated — only the display is gated.

6. **Sharing card is a client-side image render.** Composure score card is rendered on-device using the current composure score, streak, and a TiltBreak watermark. Exported to the native share sheet as a PNG. No server-side image generation required.

7. **Post-session review trigger.** There is no automatic session detection in v1. The post-session review is triggered manually — a "End Session" action or by the user returning to the app and seeing it as a contextual prompt. Automatic session detection (biometric, game process detection) is out of scope for v1. Confirm trigger mechanism with PM before build.

8. **Account creation is optional in v1.** If streak and composure data are stored locally only, a reinstall resets them. This is acceptable for v1 but will create negative user reviews. Recommend iCloud KeyValue sync as a lightweight solution that requires no explicit account creation — preserves data across reinstalls without a sign-in screen. Flag this as a build decision with meaningful retention implications.

9. **Notification payload for trial expiry.** Requires server-side push trigger at 24h before trial end. Trial end date must be stored server-side or derivable from StoreKit receipt. If fully client-side, use a scheduled local notification set at trial start. Confirm architecture with CTO — server push is more reliable but requires a backend endpoint.

10. **Crisis resources passive surface on high-tilt sessions.** If a user logs 6+ tilt events in a single session, the Post-Session Review screen should include the "Support resources" link passively. This is a threshold, not a diagnostic — do not frame it as concern or alarm. Requires a simple event count check per session, no ML required.

---

## Designer Notes

**Risk 1 — The widget is load-bearing.** The one-tap widget is central to the product's promise and will be prominently mentioned in marketing. If the widget cannot cold-launch into the interrupt flow (force-quit app), users will feel the product lied to them. This must be validated technically before the onboarding screen promises it. If cold-launch widget behavior cannot be guaranteed, the Widget Prompt screen copy must be adjusted to set accurate expectations.

**Risk 2 — Composure score framing is critical to retention.** If the score display feels like a report card rather than a performance dashboard, users will disengage when their score is low. All score copy must be progress-framed. "Up 12% from last week." Never "You tilted 8 times." The PM flagged this and I am enforcing it in design — the CTO needs to know that score copy is not generic UI text, it is a retention mechanic.

**Risk 3 — The paywall timing feels right but the trigger needs QA.** Day 8, in-context, on analytics navigation. The risk is users who use the tilt button daily but never visit the Dashboard — they will never hit the paywall naturally. These users are getting value and not converting. This is a conversion funnel gap, not a UX mistake, but it should be tracked. If a paid user cohort shows high button usage and zero Dashboard visits, consider a subtle Home screen nudge toward the Dashboard around day 5 of trial. Not aggressive — one line below the composure score: "See your full trend →".

**Risk 4 — Widget Prompt skip rate will be high.** Users in onboarding click through quickly. A significant portion will skip widget installation and never return to do it. Post-tilt-event prompt (the second-chance widget nudge) is the recovery mechanism. If widget adoption is critical to retention (hypothesis: widget users use the button more), track widget install rate as a leading indicator within the first week.

**Assumption — no account creation required in v1.** The spec is built on the assumption that iCloud KeyValue sync or local storage is acceptable for v1 data persistence. If the CTO determines that a backend account is required for any v1 feature (e.g., server-side trial tracking, push notifications), account creation must be added post-value-moment — after first interrupt complete, framed as "Save your progress." This adds one screen to the post-onboarding flow but does not break the screen budget because it is not part of the onboarding sequence.

**Legal compliance is a design constraint, not an afterthought.** Every screen has been reviewed against the legal guardrails from the PM brief. The ToS disclaimer is on the Welcome screen (readable, not buried). Crisis resources are in Settings and surface passively on high-tilt sessions. No screen makes any clinical claim. No screen uses diagnostic language. The word "therapy" does not appear anywhere in the app.

**Phase 1 max duration cap: 60 seconds — confirmed by operator.** Maximum total interrupt duration is 2.5 minutes (60s Phase 1 + 90s Phase 2). This value is resolved — no further PM action needed on this point.

**Risk 6 — Phase 1 tap data is the richest behavioral signal in the product.** Peak tap rate, Phase 1 duration, and frequency decay curve are proxies for rage magnitude — far more granular than a simple tilt event count. This data should be stored from day 1 and factored into composure score calculation. The composure score must be updated to weight Phase 1 data: a user who completes Phase 1 quickly (rage decayed fast) and finishes Phase 2 should score higher than a user who hit the max cap and barely finished Phase 2. CTO and PM must align on the scoring model before launch — it affects the data schema and the dashboard display.

**Risk 7 — The osu!-style mechanic must feel satisfying, not childish.** Bubble aesthetics must match the performance-oriented visual language of the rest of the app. Clean, precise, responsive. Not colorful cartoon bubbles. Think: white or near-white circles on a dark background, precise pop animations, tight haptics. The mechanic is borrowed from rhythm games but the visual execution must stay in the TiltBreak design language. If the bubble game looks like a children's app, users will not take the product seriously.

# Monetization Decision — TiltBreak
Date: 2026-03-18
Agent: Revenue Strategist

## Model
[x] Freemium
    Free tier includes: Unlimited tilt button (one-tap 90-second interrupt), current week composure score only
    Paid tier: $6.99/month or $59.99/year
    Premium onboarding trial: 7 days full paid access, activated at onboarding completion

---

## Why This Model For This User

The tilt button is a one-tap, zero-friction rage interrupt. It must prove value in the first session or it fails entirely — this is confirmed by both the PM and the research. Paywalling it would kill acquisition. The freemium model is the only structure that honors this constraint without abandoning revenue. What justifies the paid tier is the data layer: composure score history, weekly trends, and post-session review. These are the features that reward users who return. They require time to accumulate and compound in value the longer the user stays — the composure curve from week 1 to week 8 is more motivating than any single session's score. The target user is a competitive gamer aged 18–34 who frames emotional control as a performance problem. They track their rank, their KDA, their win rate. A composure score with history and trend lines is not a nice-to-have — it is the performance dashboard this user already wants. The free tier proves the tilt button works. The paid tier turns it into a coaching loop. That is a clean freemium architecture: genuine utility in the free tier, genuine compounding value in the paid tier. There is no crippled demo here.

---

## Trial Length Reasoning

7 days. The tilt button delivers value in session 1 — the mechanic is immediately legible. But the composure score only becomes meaningful after several uses, and the streak mechanic requires daily re-engagement to feel real. 3 days is too short for habit formation to begin. 14 days is longer than needed — this is not a data-accumulation product in v1. 7 days is enough for a user to: use the tilt button 3–5 times, see their first composure score, build a short streak, and feel what they lose when the history gates. The premium trial activates immediately at onboarding completion — users land in full paid access, not free. This is intentional. The first 7 days should feel like the full product. The gate should come after they've seen what they're keeping.

---

## Paywall Placement

Free tier is accessible immediately on first launch with no paywall encountered. The premium trial begins at onboarding completion and runs for 7 days — full access to composure history, weekly trends, and post-session review. On day 8, a soft gate appears when the user navigates to any analytics feature beyond the current week score. The tilt button remains unrestricted at all times. The paywall screen appears in-context — triggered by the action that requires upgrade, not as an interstitial. Lead with the outcome: "Your composure is improving — see how far you've come." Show the full history view blurred behind the paywall. Surface the annual plan as default with savings shown. No dark patterns. Clear "continue free" option that returns to the tilt button and current week score without friction. The gate is at the natural ceiling of free tier usage, not before it.

---

## Comparable Apps

| App | Model | Price | What We Do Differently |
|-----|-------|-------|------------------------|
| Calm | Subscription | $69.99/year | In-the-moment interrupt vs. retrospective; performance language vs. relaxation; gamer identity vs. general wellness |
| Headspace | Subscription | $69.99/year | One-tap activation in the moment; composure gamification; no meditation sessions required |
| MindShift CBT | Freemium | Free / $15.99/year | Performance framing not clinical; gamer language; streak and score mechanics; not anxiety-disorder positioned |
| BetterHelp | Subscription | $240–400/month | Fraction of the cost; no therapist dependency; in-the-moment activation; self-directed performance tool |

---

## Price Sensitivity Assessment

- Established price ceiling in niche: $69.99/year (Calm, Headspace) / $7.99/month
- Our price vs ceiling: Below — $6.99/month and $59.99/year sit under both reference points
- Annual price note: $59.99/year represents approximately 3.5 months free versus monthly (standard is 2 months free). This is a deliberate competitive positioning choice — below Calm on annual price, with a sharper specific use case. Discount depth is a valid acquisition lever when trust and brand recognition are still being established. Accept the PM's specified pricing.
- Risk: Low — pricing below ceiling with a differentiated product and a free acquisition hook. No upward pressure that requires justification.

---

## Conservative Revenue Projection

- Assumed downloads month 1: 5,000 (gaming subreddit organic launch, no paid acquisition)
- Trial-to-paid conversion: 3% (conservative; PM targets 8%+ at 60 days — use 3% for floor planning)
- Paying users month 1: 150
- MRR month 1: $1,049 (150 × $6.99)
- Monthly churn assumption: 5%
- Estimated MRR month 3 (after churn, assuming 2,000–3,000 additional installs/month): ~$1,600–$2,100
- Note: Directional estimates only. Not guarantees. MRR month 3 clears the $200 floor by a wide margin. If organic launch generates fewer than 1,500 downloads month 1, revisit the launch channel strategy before scaling.

---

## Additional Revenue Angles (Creative Expansion)

**Annual plan default selection.** The annual plan should be pre-selected on the paywall screen with savings prominently shown ("Save 29% — less than a coffee a month"). Annual subscribers churn at roughly half the rate of monthly. Every annual conversion at $59.99 is worth approximately 14 months of monthly revenue at standard churn rates. Optimize the paywall for annual-first.

**Composure score as shareable social asset.** Add a one-tap "share your composure score" card — a clean image with the user's composure percentage, streak, and a TiltBreak watermark. No paywall on sharing. This is free word-of-mouth infrastructure. Competitive gamers share performance stats. Let them share this one. Every share is an acquisition event in the exact community that converts best.

**B2B esports angle (v2 consideration, not v1).** Esports organizations, collegiate gaming programs, and gaming coaches already pay for performance tools. A team dashboard showing aggregate composure scores for a roster is a natural v2 offering. This is a separate SKU and pricing model ($X/month per seat or per team), but it uses the same product. Note it in the roadmap now — the data architecture in v1 should not preclude it. Revenue potential per team account: $50–200/month depending on roster size. Even 20 team accounts in v2 adds meaningful MRR with near-zero marginal cost.

**Lifetime purchase option (launch window only).** A time-limited lifetime access offer at $99–$129 during launch can generate a cash injection, reward early adopters, and create a cohort of highly invested users who act as advocates. This is not a permanent pricing tier — it expires after 60–90 days. Announce it as "founding member pricing." Frame it as appreciation, not desperation. Only viable if the product is confident it will not need to offer this indefinitely (it would cannibalize subscription revenue). At $119 lifetime, converting 50 users = $5,950 upfront — meaningful for a solo developer absorbing launch costs.

---

## Constraints for UI/UX Designer and CTO

- StoreKit 2 required for all payment processing. No third-party payment dependency.
- Tilt button must be accessible in one tap from a home screen widget. This is a non-negotiable UX constraint confirmed by PM. The widget must function without opening the full app — it should trigger the interrupt flow directly. This requires widget deep-link configuration in the build.
- Premium trial must activate automatically at onboarding completion. No opt-in required. Users should not have to choose to start a trial — they begin in full access and the gate appears on day 8.
- Trial expiry notification: send a push notification 24 hours before trial ends. "Your composure history access ends tomorrow — see your full progress." One notification. Not a sequence.
- Annual plan is default selection on paywall screen. Monthly is visible but secondary.
- Paywall must include visible "continue free" option. No dark patterns, no hidden exit.
- Composure score history and weekly trend view must be fully rendered behind the paywall gate — blurred or locked, not absent. The user should see the shape of what they're missing.
- Free tier composure score: current week only. No history access. This is the hard line that drives upgrade.
- Terms of service must explicitly state: this app is a general wellness and performance tool, not a substitute for professional mental health support, and does not treat, cure, or diagnose any mental health condition. This language must be readable and accessible — not buried. Link it from onboarding and from settings.
- Crisis resources must be accessible in settings. Passive surfacing after high-tilt sessions is appropriate with neutral language ("It looks like tonight was rough. If you need support, these resources are available."). No clinical claims in this copy.
- Sharing card for composure score: free feature, no paywall. Requires a clean export image template with watermark. Simple build — high organic value.

---

## Strategist Notes

**The freemium choice is PM-constrained, not a hedge.** The PM has explicitly mandated a free tilt button as the acquisition hook. This is correct strategy — the interrupt must prove value before any paywall is encountered. Freemium was chosen because the constraint exists, not to avoid a hard decision. The paid tier is meaningfully differentiated: analytics, history, and trends are genuinely worth $6.99/month to a user who is tracking their performance.

**The 3% conversion floor is the real risk.** The PM's 8% trial-to-paid conversion target is ambitious but achievable if the paywall fires at the right moment and the composure history is genuinely compelling. The risk is users who use the tilt button regularly but never care enough about the analytics to pay. If month-3 data shows tilt button engagement is high but conversion is below 3%, the analytics value proposition needs testing — either the paywall screen isn't landing or the paid feature set isn't compelling enough to upgrade for. Watch this early.

**The lifetime offer is optional and time-limited.** Include it in launch planning as a decision point, not a commitment. Evaluate at launch based on early conversion rate signals.

**Monetization signal from research was strong.** Calm and Headspace at $69.99/year with strong retention validate the WTP tier. TiltBreak's sharper use case and lower price point are advantages, not weaknesses. The conservative projection is directionally sound. The real question is launch community penetration — if the first Reddit post doesn't land, month 1 downloads undershoot significantly. That is a marketing risk, not a monetization risk.

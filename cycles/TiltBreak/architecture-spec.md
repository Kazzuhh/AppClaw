# Architecture Spec — TiltBreak
Date: 2026-03-18
Agent: CTO / Architect

---

## Stack

Language: Swift (latest stable)
UI Framework: SwiftUI
Architecture: MVVM + Clean Architecture
Minimum iOS: iOS 16+
Package Manager: SPM
Payments: StoreKit 2
Local Storage: SwiftData (primary local persistence — full tilt event history) + NSUbiquitousKeyValueStore (iCloud KV sync for cross-device key metrics)
Networking: None — fully client-side in v1. StoreKit 2 handles payment networking internally.
Crash Reporting: Firebase Crashlytics ✓
Analytics: None (not required by product-decision.md in v1)

---

## Third-Party Dependencies

| Dependency | Purpose | Why Not Native | Removable in <1 week |
|------------|---------|----------------|----------------------|
| Firebase Crashlytics | Crash reporting | No native equivalent with equivalent crash symbolication and reporting | Yes — delete SPM package, remove init call |

No other third-party dependencies. Every other requirement is solved by native Apple frameworks:
- WidgetKit (home screen widget)
- StoreKit 2 (payments)
- SwiftData (local persistence)
- NSUbiquitousKeyValueStore (iCloud KV sync)
- UNUserNotificationCenter (local notifications)
- Swift Charts (composure trend visualization, iOS 16+)
- UIGraphicsImageRenderer / SwiftUI ImageRenderer (composure sharing card PNG export)

---

## Data Models

Entity: TiltEvent
- id: UUID
- timestamp: Date
- sessionId: UUID
- interruptCompleted: Bool
- phase1DurationSeconds: Int (wall-clock duration of Phase 1 rage channel; 0 if phase 1 not completed)
- phase1TapCount: Int (total taps registered during Phase 1)
- phase2Completed: Bool (true if user completed the full 90-second Phase 2 guided interrupt)
- phase2DurationSeconds: Int (how far into the 90s the user got in Phase 2; 90 = full completion)

Note: interruptCompleted = phase2Completed. Retained for backward-compat in composure score calculation.

Entity: TapEvent
- id: UUID
- tiltEventId: UUID (foreign key to parent TiltEvent)
- timestamp: Date
- normalizedPosition: CGPoint (x: 0.0–1.0, y: 0.0–1.0 — relative to screen bounds, not absolute pixels)
- reactionTimeMs: Int (milliseconds from bubble appearance to tap; 0 if bubble spawn time not tracked for this tap)

Entity: TiltSession
- id: UUID
- startDate: Date
- endDate: Date?
- tiltEventIds: [UUID] (resolved via repository)
- composureScore: Double (calculated at session close: completedInterrupts / totalTilts * 100)

Entity: WeeklyComposureScore
- weekStart: Date (canonical Monday of the week, normalized)
- score: Double (0.0–100.0)
- totalTilts: Int
- completedInterrupts: Int

Entity: UserProfile
- gamingContext: String (selected chip: "Competitive gaming" / "High-pressure work" / "I just get angry" / "Other")
- composureGoal: String (selected chip)
- notificationsEnabled: Bool
- onboardingCompleted: Bool
- trialStartDate: Date?
- currentStreakDays: Int
- longestStreakDays: Int
- lastActiveDate: Date?

Entity: Entitlement
- status: EntitlementStatus (free / trial / paid)
- expiryDate: Date? (nil for paid, set for trial expiry)

Enum: EntitlementStatus
- free
- trial(expiresAt: Date)
- paid

---

## Architecture Layer Breakdown

### Features

Feature: Onboarding
- View: WelcomeView, QuickSetupView, WidgetPromptView
- ViewModel: OnboardingViewModel
- UseCase: CompleteOnboardingUseCase, ScheduleTrialNotificationUseCase
- Repository: UserProfileRepository

Feature: Home
- View: HomeView
- ViewModel: HomeViewModel
- UseCase: FetchComposureScoreUseCase, FetchStreakUseCase, CheckEntitlementUseCase
- Repository: ComposureRepository, UserProfileRepository, PaymentRepository

Feature: TiltInterrupt
- View: RageChannelView (Phase 1), GuidedInterruptView (Phase 2), InterruptCompleteView
- ViewModel: RageChannelViewModel (Phase 1), GuidedInterruptViewModel (Phase 2), InterruptCompleteViewModel
- UseCase: StartTiltInterruptUseCase, RecordTapEventUseCase, TransitionToPhase2UseCase, CompleteTiltInterruptUseCase, AbandonTiltInterruptUseCase, UpdateStreakUseCase
- Repository: TiltEventRepository, TapEventRepository, SessionRepository, ComposureRepository, SyncRepository

Feature: ComposureDashboard
- View: ComposureDashboardView, ComposureCardView
- ViewModel: ComposureDashboardViewModel
- UseCase: FetchWeeklyTrendUseCase, ExportComposureCardUseCase, CheckEntitlementUseCase
- Repository: ComposureRepository, PaymentRepository

Feature: PostSessionReview
- View: PostSessionReviewView
- ViewModel: PostSessionReviewViewModel
- UseCase: FetchPostSessionSummaryUseCase, CheckCrisisThresholdUseCase
- Repository: SessionRepository, TiltEventRepository

Feature: Paywall
- View: PaywallView
- ViewModel: PaywallViewModel
- UseCase: PurchaseSubscriptionUseCase, RestorePurchasesUseCase, CheckEntitlementUseCase
- Repository: PaymentRepository

Feature: Settings
- View: SettingsView
- ViewModel: SettingsViewModel
- UseCase: UpdateNotificationPreferencesUseCase
- Repository: UserProfileRepository, NotificationRepository

### Domain Layer

UseCases:

StartTiltInterruptUseCase — creates a new TiltEvent record with phase1DurationSeconds = 0, phase1TapCount = 0, phase2Completed = false. Stores phase1StartDate to UserDefaults (wall-clock anchor). Returns the tiltEventId for the active interrupt session. Phase 1 (RageChannel) begins immediately.

RecordTapEventUseCase — inserts a TapEvent record linked to the active tiltEventId. Called on every bubble tap in Phase 1. Increments TiltEvent.phase1TapCount. Input: tiltEventId, normalizedPosition, reactionTimeMs.

TransitionToPhase2UseCase — finalises Phase 1: sets TiltEvent.phase1DurationSeconds from wall-clock diff, clears phase1StartDate from UserDefaults, stores phase2StartDate to UserDefaults. Returns control to TiltInterruptViewModel to present GuidedInterruptView.

CompleteTiltInterruptUseCase — marks TiltEvent.interruptCompleted = true, updates session composure score, triggers streak update, writes updated WeeklyComposureScore to SwiftData and syncs summary to iCloud KV store.

AbandonTiltInterruptUseCase — marks TiltEvent.interruptCompleted = false, updates session composure score. Abandoned interrupts count as tilt events (denominator) but not completions (numerator).

FetchComposureScoreUseCase — returns current week WeeklyComposureScore. Always returns data regardless of entitlement tier (display gating handled at View layer, not use case layer).

FetchWeeklyTrendUseCase — returns array of WeeklyComposureScore ordered by weekStart. Returns all weeks; ViewModel + View apply paywall blur for weeks beyond current based on entitlement.

FetchPostSessionSummaryUseCase — returns all TiltEvents for the most recently closed TiltSession, ordered by timestamp. Returns nil if session had zero tilt events (View does not surface post-session sheet in this case).

CheckCrisisThresholdUseCase — returns Bool: true if session tilt event count >= 6. Used by PostSessionReviewViewModel to conditionally surface crisis resources link.

CheckEntitlementUseCase — queries StoreKit 2 transaction listener via EntitlementManager, returns current Entitlement. Called on every app foreground and on Dashboard navigation.

PurchaseSubscriptionUseCase — initiates StoreKit 2 purchase flow for the specified product ID. Handles success, failure, and pending states. On success, triggers ScheduleTrialNotificationUseCase cancellation and updates entitlement.

RestorePurchasesUseCase — calls StoreKit 2 restore; refreshes entitlement state.

UpdateStreakUseCase — compares lastActiveDate to today. If yesterday: increment streak. If today: no change. If gap > 1 day: reset streak to 1. Writes updated UserProfile to SwiftData and syncs to iCloud KV.

ExportComposureCardUseCase — uses ImageRenderer (iOS 16+) to render ComposureCardView to PNG. Passes PNG data to native share sheet via UIActivityViewController.

ScheduleTrialNotificationUseCase — schedules a UNUserNotificationCenter local notification 6 days after trial start (24h before 7-day trial expiry). One notification, not a sequence. Cancellable on paid conversion.

CompleteOnboardingUseCase — saves UserProfile from onboarding chips, sets onboardingCompleted = true, sets trialStartDate = now, writes to SwiftData and iCloud KV, triggers ScheduleTrialNotificationUseCase.

### Data Layer

TiltEventRepositoryImpl — wraps SwiftData ModelContext. Inserts, fetches, updates TiltEvent records. Fetch by sessionId for post-session summaries.

TapEventRepositoryImpl — wraps SwiftData ModelContext. Batch-inserts TapEvent records during Phase 1. Fetch by tiltEventId for post-session pattern data (v1: stored, not yet surfaced in UI — data foundation for v2 AI analysis).

SessionRepositoryImpl — wraps SwiftData ModelContext. Manages TiltSession lifecycle. Session "close" is triggered when user returns to Home and a session is in-progress state.

ComposureRepositoryImpl — wraps SwiftData for full weekly score history. Aggregates from TiltEvent records on write. Writes weekly summaries to NSUbiquitousKeyValueStore as JSON-encoded WeeklyComposureScore for cross-device sync.

UserProfileRepositoryImpl — wraps SwiftData for local profile. Syncs critical fields (streakCount, longestStreak, lastActiveDate, trialStartDate, onboardingCompleted) to NSUbiquitousKeyValueStore as individual keys.

PaymentRepositoryImpl — wraps StoreKit 2. Product fetch on init. Exposes purchase, restore, and transaction verification. EntitlementManager is injected here.

NotificationRepositoryImpl — wraps UNUserNotificationCenter. Schedule, cancel, and check pending notifications by identifier.

SyncRepositoryImpl — wraps NSUbiquitousKeyValueStore. Handles KV reads/writes and listens for NSUbiquitousKeyValueStoreDidChangeExternallyNotification to merge remote changes on app foreground.

---

## Payment Architecture

Model: Freemium with auto-renewable subscriptions
Trial logic: Yes — 7 days, auto-starts at onboarding completion, configured in App Store Connect as introductory offer on both products

Product IDs (stored in Config.swift — never hardcoded at call sites):
- com.tiltbreak.premium.monthly → $6.99/month
- com.tiltbreak.premium.yearly → $59.99/year

Default paywall selection: Annual (pre-selected, savings shown)

StoreKit 2 requirements:
- [x] Product configuration noted for App Store Connect setup (HUMAN TASK — Bartholomew to configure before submission)
- [x] Purchase flow implemented with loading, success, failure, and pending states
- [x] Restore purchases button in Settings and on Paywall
- [x] Trial period handling — 7-day introductory offer, trial start timestamp stored locally, StoreKit receipt is source of truth
- [x] Subscription status check on every app foreground (scene phase .active transition)
- [x] Entitlement management — EntitlementManager resolves free / trial / paid from latest verified transaction
- [x] Failed purchase error handling — surfaces inline error state in PaywallViewModel, no crash, tilt button unaffected

Trial expiry notification strategy:
- At onboarding completion, schedule a local UNUserNotificationCenter notification with identifier "trial-expiry-warning" for Date(trialStartDate) + 6 days
- Content: "Your composure history access ends tomorrow — see your full progress."
- On paid conversion: UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: ["trial-expiry-warning"])
- Rationale: Fully client-side. No backend endpoint required. Reliable because it is scheduled at trial start on the same device, not derived from a server push. Acceptable for v1.

Free vs. paid data gate:
- ComposureRepository writes data for ALL users from day 1. No tier check at write time.
- Display gate lives in ComposureDashboardViewModel: fetch all weeks, check entitlement, return blurMask = true for weeks outside current week if entitlement is .free
- The paywall visual shows real blurred data, not placeholder graphics — this is the correct architecture

---

## Widget Architecture

Constraint validation: Widget cold-launch into TiltInterruptView bypassing navigation stack.

Implementation:
- Separate WidgetKit target: TiltBreakWidgetExtension
- Widget entry uses .widgetURL(URL(string: "tiltbreak://interrupt")!) on the widget body
- TiltBreakApp.swift handles deep link routing at root level:

```swift
@main
struct TiltBreakApp: App {
    @State private var launchPath: AppPath = .home

    var body: some Scene {
        WindowGroup {
            RootView(initialPath: launchPath)
                .onOpenURL { url in
                    if url.host == "interrupt" {
                        launchPath = .tiltInterrupt
                    }
                }
        }
    }
}
```

- On cold launch (force-quit), iOS passes the widget's URL to the app on launch. The `onOpenURL` fires before the first view renders, setting `launchPath = .tiltInterrupt`.
- RootView checks `initialPath` and presents TiltInterruptView directly if `.tiltInterrupt`, bypassing Home navigation stack.
- This is technically confirmed achievable on iOS 16+ with URL-based widget deep links. WidgetKit does pass the URL on cold launch.
- For iOS 17+, AppIntents can improve this further (direct widget button interaction without app launch), but URL scheme is the correct baseline for iOS 16 minimum.

Constraint: VALIDATED. Cold-launch widget tap into TiltInterruptView is achievable with this architecture. No onboarding promise adjustment required.

---

## 90-Second Wall-Clock Timer

Constraint: Timer must not drift on screen lock. Must not pause on app backgrounding.

Implementation — WallClockTimer (Core/Timer/WallClockTimer.swift):

```swift
class WallClockTimer: ObservableObject {
    private let durationSeconds: TimeInterval = 90
    private var startDate: Date?
    private let startKey = "tiltTimerStartDate"

    func start() {
        let now = Date()
        startDate = now
        UserDefaults.standard.set(now, forKey: startKey)
    }

    func resumeIfActive() {
        guard startDate == nil,
              let saved = UserDefaults.standard.object(forKey: startKey) as? Date else { return }
        startDate = saved
    }

    var remainingSeconds: TimeInterval {
        guard let start = startDate else { return durationSeconds }
        let elapsed = Date().timeIntervalSince(start)
        return max(0, durationSeconds - elapsed)
    }

    var isComplete: Bool { remainingSeconds <= 0 }

    func invalidate() {
        startDate = nil
        UserDefaults.standard.removeObject(forKey: startKey)
    }
}
```

- TiltInterruptViewModel observes ScenePhase. On .active: call resumeIfActive() to pick up correct wall clock position after lock/background.
- No background modes required. The timer calculates remaining time from Date() diff on every tick and on every resume.
- SwiftUI view drives a Timer.publish(every: 0.5, ...) for animation updates; the source of truth is always Date() diff, not the tick count.

---

## Two-Phase Interrupt Architecture

The tilt interrupt is split into two sequential phases managed by TiltInterruptViewModel. Phase sequencing is owned by the ViewModel, not the view layer — views are dumb recipients of phase state.

```
Phase 1: Rage Channel (dynamic duration)
    ↓  [tap frequency decay detected]
Phase 2: Guided Interrupt (90 seconds, WallClockTimer)
    ↓  [countdown complete]
Interrupt Complete
```

### Phase 1 — Rage Channel (RageChannelView / RageChannelViewModel)

Purpose: Physical rage outlet. Osu!-style bubble tap game. Captures tap telemetry. Ends when rage is subsiding, not on a fixed timer.

Bubble generation algorithm (BubbleEngine — Core/RageChannel/BubbleEngine.swift):
- Spawn rate: starts at 2.0 bubbles/second. Maintains 2.0/s for the first 10 seconds, then holds steady at 1.5/s. No acceleration curve — pace is consistent once established. Rage is already present; the game matches it, not escalates it.
- Bubble positions: random CGPoint within safe area insets, subject to a minimum separation constraint of 80pt from any bubble spawned in the last 0.5 seconds. Prevents cluster spawns that punish large fingers.
- Bubble lifetime: 1.5 seconds visible on screen before auto-dismiss. Missed bubbles are acceptable — no penalty, no counter, no failure state. The game is an outlet, not a test.
- Tap capture: on each bubble tap, BubbleEngine calls RecordTapEventUseCase with: normalizedPosition (tap CGPoint / screen bounds), reactionTimeMs (Date().timeIntervalSince(bubble.spawnDate) * 1000).

Phase 1 termination — tap frequency decay detection (TapDecayDetector — Core/RageChannel/TapDecayDetector.swift):

```
Algorithm:
- Track timestamps of all taps in a circular buffer (last 20 taps)
- On each tap (and on a 0.25s heartbeat timer): compute taps-per-second
  in the trailing 3-second rolling window: count(taps where now - timestamp < 3.0) / 3.0
- Phase 1 ends when ALL three conditions are met:
    1. Rolling 3s tap rate drops below 0.5 taps/second (fewer than 1.5 taps in 3 seconds)
    2. This condition has persisted continuously for >= 2 seconds
    3. Minimum phase 1 duration of 10 seconds has elapsed (prevents accidental instant transition)
- Hard cap: if phase 1 reaches 60 seconds without decay detection, auto-transition to Phase 2
  regardless of tap rate. Prevents indefinite phase 1 for users who keep tapping.
- On decay condition met: call TransitionToPhase2UseCase
```

RageChannelViewModel owns: BubbleEngine instance, TapDecayDetector instance, active bubble set as @Published [Bubble]. Bubble is a value type (struct) with id, position, spawnDate. View observes the bubble set and renders/removes bubbles accordingly.

Phase 1 wall-clock tracking: phase1StartDate stored to UserDefaults key "phase1StartDate" at Phase 1 start. On app resume from background during Phase 1, RageChannelViewModel recalculates elapsed time. Bubble positions are reset on resume (no attempt to reconstruct mid-flight bubbles). Tap history is cleared on resume (decay clock starts fresh — correct behaviour, as the rage event has likely passed if the user left the app).

### Phase 2 — Guided Interrupt (GuidedInterruptView / GuidedInterruptViewModel)

No changes from original architecture. WallClockTimer applies with UserDefaults key "phase2StartDate". 90-second breathing/grounding countdown. Existing wall-clock timer implementation unchanged.

GuidedInterruptViewModel is separate from RageChannelViewModel. TiltInterruptViewModel coordinates the phase handoff:

```swift
enum InterruptPhase {
    case rageChannel
    case guidedInterrupt
    case complete
}

class TiltInterruptViewModel: ObservableObject {
    @Published var phase: InterruptPhase = .rageChannel
    // owns RageChannelViewModel and GuidedInterruptViewModel as child VMs
    // transitions phase on TransitionToPhase2UseCase completion
}
```

### Data Captured Across Both Phases

Per TiltEvent after both phases complete:
- phase1DurationSeconds: actual wall-clock duration of Phase 1
- phase1TapCount: total taps landed on bubbles in Phase 1
- phase2Completed: true if Phase 2 ran to 90s completion
- phase2DurationSeconds: how far into Phase 2 the user reached
- Associated TapEvents: full tap telemetry (timestamp, position, reactionTimeMs)

TapEvent data is stored for all users from day 1. In v1 it is not surfaced in the UI. It is the raw data foundation for v2 pattern analysis ("you tap fastest in the first 15 seconds — rage peaks early, then decays"). Do not skip this capture.

---

## iCloud KV Sync Design

NSUbiquitousKeyValueStore constraints: 1MB total, 64KB per key.

Data synced to iCloud KV (key: value):
- "userProfile" → JSON-encoded UserProfile (~500 bytes)
- "streakCount" → Int
- "longestStreak" → Int
- "lastActiveDate" → TimeInterval (Date.timeIntervalSinceReferenceDate)
- "trialStartDate" → TimeInterval
- "weeklyScores" → JSON-encoded [WeeklyComposureScore] (52 entries/year × ~100 bytes = ~5.2KB/year — well within limits for years of use)

Full TiltEvent history is SwiftData local only. Weekly aggregates are what sync.
This means: if a user reinstalls, they recover their streak, composure score history (weekly summaries), and trial start date — the data that matters for retention. Individual tilt events from before reinstall are not recovered (acceptable for v1).

SyncRepositoryImpl listens for NSUbiquitousKeyValueStoreDidChangeExternallyNotification and merges latest cloud values into SwiftData on app foreground. Conflict resolution: iCloud KV is authoritative for streak and profile; local SwiftData is authoritative for tilt event detail.

---

## Composure Score — Calculation and Framing

Score for a week = (completedInterrupts / max(totalTilts, 1)) * 100, rounded to nearest integer, expressed as a percentage.

Display framing (enforced in ViewModels — this is a retention mechanic, not generic copy):
- Never display raw tilt count. Always display ratio framing: "6 of 8 interrupts — 75% composure"
- Weekly score shows delta vs prior week: "+12% from last week" or "Down 8% — keep going"
- Never "you tilted X times" — always "you completed X of Y interrupts"

---

## Sharing Card Export

ExportComposureCardUseCase uses SwiftUI's ImageRenderer (iOS 16+) to render ComposureCardView to a UIImage at @2x scale. Exports to native share sheet as PNG via UIActivityViewController.
ComposureCardView renders: composure percentage, streak count, "TiltBreak" wordmark watermark. No paywall. Free feature. Shareable from ComposureDashboard.

---

## Post-Session Review Trigger

There is no automatic session detection in v1 (biometric/game process detection is out of scope per product-decision.md).

Trigger mechanism: When the user returns to HomeView and a TiltSession is in "open" state (startDate set, endDate nil, and at least one TiltEvent exists), HomeViewModel surfaces the Post-Session Review as a bottom sheet. The session is considered "active" until the user dismisses the review sheet or taps "End Session" explicitly.

This is the simplest viable mechanism. It means the review appears when the user returns to the app after a tilt session — the natural post-game moment. No timer-based auto-trigger, no background processing.

---

## Legal Architecture Constraints

1. ToS disclaimer on WelcomeView: "This app is a general wellness and performance tool. It is not a substitute for professional mental health support and does not treat, diagnose, or cure any mental health condition." — readable footer link, links to full ToS. Not buried.

2. Crisis resources in SettingsView: Static list (988 Lifeline, Crisis Text Line). Copy: "These resources are here if you need them." No clinical framing.

3. Post-session passive crisis surface: If CheckCrisisThresholdUseCase returns true (>= 6 tilt events in session), PostSessionReviewView appends a plain-text link: "Support resources" at bottom of screen. Neutral language. No alarm framing.

4. No clinical language anywhere in the codebase — enforced at architecture level by naming conventions: "composure" not "anger," "interrupt" not "treatment," "tilt" not "rage disorder."

---

## Folder Structure

```
TiltBreak/
├── App/
│   └── TiltBreakApp.swift
├── Features/
│   ├── Onboarding/
│   │   ├── Views/
│   │   │   ├── WelcomeView.swift
│   │   │   ├── QuickSetupView.swift
│   │   │   └── WidgetPromptView.swift
│   │   ├── ViewModels/
│   │   │   └── OnboardingViewModel.swift
│   │   └── Models/
│   │       └── OnboardingState.swift
│   ├── Home/
│   │   ├── Views/
│   │   │   └── HomeView.swift
│   │   ├── ViewModels/
│   │   │   └── HomeViewModel.swift
│   │   └── Models/
│   ├── TiltInterrupt/
│   │   ├── Views/
│   │   │   ├── TiltInterruptView.swift       ← phase coordinator view
│   │   │   ├── RageChannelView.swift         ← Phase 1 bubble game
│   │   │   ├── GuidedInterruptView.swift     ← Phase 2 breathing countdown
│   │   │   └── InterruptCompleteView.swift
│   │   ├── ViewModels/
│   │   │   ├── TiltInterruptViewModel.swift  ← phase state coordinator
│   │   │   ├── RageChannelViewModel.swift    ← Phase 1 logic + BubbleEngine
│   │   │   ├── GuidedInterruptViewModel.swift ← Phase 2 logic + WallClockTimer
│   │   │   └── InterruptCompleteViewModel.swift
│   │   └── Models/
│   │       ├── ActiveInterruptSession.swift
│   │       └── Bubble.swift                  ← value type: id, position, spawnDate
│   ├── ComposureDashboard/
│   │   ├── Views/
│   │   │   ├── ComposureDashboardView.swift
│   │   │   └── ComposureCardView.swift
│   │   ├── ViewModels/
│   │   │   └── ComposureDashboardViewModel.swift
│   │   └── Models/
│   ├── PostSessionReview/
│   │   ├── Views/
│   │   │   └── PostSessionReviewView.swift
│   │   ├── ViewModels/
│   │   │   └── PostSessionReviewViewModel.swift
│   │   └── Models/
│   ├── Paywall/
│   │   ├── Views/
│   │   │   └── PaywallView.swift
│   │   ├── ViewModels/
│   │   │   └── PaywallViewModel.swift
│   │   └── Models/
│   └── Settings/
│       ├── Views/
│       │   └── SettingsView.swift
│       ├── ViewModels/
│       │   └── SettingsViewModel.swift
│       └── Models/
├── Domain/
│   ├── UseCases/
│   │   ├── StartTiltInterruptUseCase.swift
│   │   ├── RecordTapEventUseCase.swift
│   │   ├── TransitionToPhase2UseCase.swift
│   │   ├── CompleteTiltInterruptUseCase.swift
│   │   ├── AbandonTiltInterruptUseCase.swift
│   │   ├── FetchComposureScoreUseCase.swift
│   │   ├── FetchWeeklyTrendUseCase.swift
│   │   ├── FetchPostSessionSummaryUseCase.swift
│   │   ├── CheckCrisisThresholdUseCase.swift
│   │   ├── CheckEntitlementUseCase.swift
│   │   ├── PurchaseSubscriptionUseCase.swift
│   │   ├── RestorePurchasesUseCase.swift
│   │   ├── UpdateStreakUseCase.swift
│   │   ├── ExportComposureCardUseCase.swift
│   │   ├── ScheduleTrialNotificationUseCase.swift
│   │   └── CompleteOnboardingUseCase.swift
│   └── Entities/
│       ├── TiltEvent.swift
│       ├── TapEvent.swift
│       ├── TiltSession.swift
│       ├── WeeklyComposureScore.swift
│       ├── UserProfile.swift
│       └── Entitlement.swift
├── Data/
│   ├── Repositories/
│   │   ├── TiltEventRepositoryImpl.swift
│   │   ├── TapEventRepositoryImpl.swift
│   │   ├── SessionRepositoryImpl.swift
│   │   ├── ComposureRepositoryImpl.swift
│   │   ├── UserProfileRepositoryImpl.swift
│   │   ├── PaymentRepositoryImpl.swift
│   │   ├── NotificationRepositoryImpl.swift
│   │   └── SyncRepositoryImpl.swift
│   └── Services/
│       ├── SwiftDataService.swift
│       ├── StoreKitService.swift
│       ├── iCloudKVService.swift
│       └── NotificationService.swift
├── Core/
│   ├── Payment/
│   │   ├── StoreKitManager.swift
│   │   └── EntitlementManager.swift
│   ├── Timer/
│   │   └── WallClockTimer.swift
│   ├── RageChannel/
│   │   ├── BubbleEngine.swift            ← spawn rate, position, lifetime logic
│   │   └── TapDecayDetector.swift        ← rolling window tap-frequency algorithm
│   ├── Sharing/
│   │   └── ComposureCardRenderer.swift
│   ├── DeepLink/
│   │   └── AppPath.swift
│   └── Extensions/
│       ├── Date+Extensions.swift
│       └── Color+Extensions.swift
├── TiltBreakWidgetExtension/ (separate widget target)
│   ├── TiltBreakWidget.swift
│   └── TiltBreakWidgetBundle.swift
└── Resources/
    ├── Assets.xcassets
    └── Config.swift
```

---

## Portfolio Pattern Compliance

[x] Follows standard MVVM + Clean Architecture
[x] Follows standard naming conventions (Views, ViewModels, UseCases, Repositories, Entities)
[x] Follows standard folder structure
[x] Firebase Crashlytics integrated
[x] StoreKit 2 for payments

Deviations:
- WallClockTimer in Core/Timer/ — not a domain use case; it is a pure utility class with no business logic. Justified: placing it in Domain would violate the "pure Swift, no framework" rule since it observes scenePhase changes. It is injected into TiltInterruptViewModel.
- TiltBreakWidgetExtension as a separate Xcode target — required by Apple for WidgetKit. Shares domain entities via a shared framework or direct target membership. Not a deviation from architectural principles; a build system requirement.
- AppPath.swift in Core/DeepLink/ — routing enum for widget deep link handling at app root level. Not a feature concern; lives in Core.

---

## Complexity Flags

Widget cold-launch into TiltInterruptView: LOW risk — VALIDATED. URL-based widget deep link with onOpenURL handler at root level is the correct iOS 16+ implementation. Cold-launch behavior is confirmed. See Widget Architecture section. No timeline risk.

WallClockTimer on screen lock: LOW risk — wall clock anchoring via Date() diff is a standard iOS pattern. No background modes needed. Implementation is straightforward. Not a timeline risk.

SwiftData + NSUbiquitousKeyValueStore dual-layer sync: LOW-MEDIUM risk — two storage layers require careful merge logic in SyncRepositoryImpl. iCloud KV sync is authoritative for streak/profile; local SwiftData is authoritative for event detail. Conflict scenarios are minimal in a single-user app. Build SyncRepositoryImpl carefully and test reinstall scenario early. One sprint item.

ImageRenderer for sharing card (iOS 16+): LOW risk — native API, no third-party dependency. Composure card renders entirely from SwiftUI view. Test at multiple Dynamic Type sizes and verify PNG output quality.

StoreKit 2 trial introductory offer configuration: MEDIUM risk — App Store Connect must be configured before the trial mechanics can be tested on device with real StoreKit transactions. The HUMAN TASK flag below is load-bearing. Do not build trial gating logic against StoreKit sandbox without product IDs configured first.

Post-session trigger on natural app return: LOW risk — the simplest viable mechanism (open TiltSession detected on HomeView appear). No background processing. No timeline risk.

BubbleEngine + TapDecayDetector (Phase 1): LOW-MEDIUM risk — the algorithm itself is simple (rolling window tap count / 3.0 seconds). The implementation risk is in SwiftUI performance: maintaining a @Published [Bubble] set that updates at up to 2 bubbles/second with 1.5-second auto-dismiss requires careful use of withAnimation and id-based diffing. Use a LazyVStack or ZStack with explicit .id(bubble.id) modifiers. Profile early on an iPhone 12 or older device — this is the performance floor. Build and validate BubbleEngine in isolation (Swift Playgrounds or unit tests) before integrating into TiltInterruptView. Estimated build time: 2–3 days. Not a timeline risk if started in sprint 1.

TiltInterruptViewModel phase coordination: LOW risk — InterruptPhase enum + two child ViewModels is clean and testable. The only coordination complexity is ensuring WallClockTimer UserDefaults keys for Phase 1 and Phase 2 are distinct and cleaned up on abandon/complete. Managed in TransitionToPhase2UseCase and AbandonTiltInterruptUseCase.

---

## Constraints for Tech Lead and Engineers

For Tech Lead (task-breakdown.md):
1. The widget target must be created from day 1 of the build. It cannot be added late. Deep link routing in TiltBreakApp.swift depends on it.
2. WallClockTimer must be the only timer source of truth in TiltInterruptViewModel. No Timer.publish tick counting for elapsed time tracking — only for UI animation drive. Drift is a user-facing failure.
3. ComposureRepository writes data for ALL users regardless of entitlement. The entitlement check happens only in ViewModels at display time. Any engineer who adds a tier check to the data write layer has introduced a paywall architecture bug.
4. StoreKit 2 entitlement check must run on every .active scene phase transition, not just at app launch. Users can convert on another device or via App Store — the app must reflect that on next foreground.
5. Post-session review is a bottom sheet over HomeView, not a navigation push. InterruptCompleteView returns to Home; the sheet surfaces from HomeViewModel detecting an open session with events.
6. Tilt button tap response: haptic (UIImpactFeedbackGenerator .heavy) and ring-expand animation must fire in TiltInterruptViewModel before any SwiftData write or StoreKit call. Optimistic UI on the button state.
7. NSUbiquitousKeyValueStore sync — call synchronize() after every write. Register for NSUbiquitousKeyValueStoreDidChangeExternallyNotification in SyncRepositoryImpl.
8. Phase 1 and Phase 2 each have their own UserDefaults wall-clock key ("phase1StartDate", "phase2StartDate"). Both must be cleared on AbandonTiltInterruptUseCase and on app launch if no active interrupt session exists. Stale keys will cause incorrect timer state on next interrupt.
9. BubbleEngine must be built and profiled early (sprint 1). The SwiftUI rendering of a dynamic bubble set at 2 bubbles/second on lower-end devices is the only unknown performance surface in this app. Everything else is standard.
10. TapEvent records are written for ALL users. This is v2 pattern analysis data. Do not gate writes on entitlement. Do not skip this for free tier users.

For Frontend (SwiftUI) engineer:
- Tilt button minimum tap target: 80×80pt enforced via .frame and .contentShape. Non-negotiable for accessibility and rage-state usability.
- Debounce tilt button: second tap within 2 seconds does nothing (ignore while TiltInterruptViewModel is in .active state).
- Composure score and trend blurring: use .blur(radius:) + .overlay with lock icon on locked weeks. The underlying chart renders at full fidelity — only the display layer is blurred. Do not conditionally omit data.
- All score copy is progress-framed (see Composure Score section above). This is enforced at ViewModel layer via computed properties — do not display raw tilt event counts.
- No markdown, no clinical language, no diagnostic terminology in any visible string.
- RageChannelView: bubbles render as circles with a tap animation (scale-down + opacity fade on tap, 150ms ease-out). No score counter visible during Phase 1 — no "missed: X" display. The game is an outlet, not a graded test.
- Phase transition from Phase 1 to Phase 2: animate out bubble layer (fade 300ms), animate in GuidedInterruptView breathing UI (fade-in 400ms). The transition should feel like moving from turbulence into stillness — do not use a navigation push here. It is a crossfade within TiltInterruptView's content area.

---

## CTO Notes

Risk: App Store Connect product configuration is the critical path dependency for StoreKit 2 testing. Bartholomew must create the subscription group, both products, and the 7-day introductory offer before the payment layer can be validated against sandbox. Flag this as the first human task before the first build sprint begins. This is not a late-cycle concern — it blocks StoreKit integration testing from day 1.

Risk: iCloud KV sync for streak data means a user who deletes the app without iCloud backup will lose their streak. This is accepted for v1 per the architecture constraints, but it will produce App Store reviews. The data most users care about (streak, composure trend) survives reinstall via iCloud KV. Individual tilt events do not — this is acceptable.

Assumption: Trial introductory offer is configured as "pay upfront: $0.00 for 7 days" in App Store Connect (not a paid trial). StoreKit 2 .currentEntitlement will reflect this as an active subscription in the trial phase. EntitlementManager derives trial vs. paid status from Transaction.expirationDate vs. current date and the introductory offer consumed flag.

No backend server risk: The decision to go fully client-side with local notifications for trial expiry is correct for v1. The failure mode (notification not delivered because user denied permission) is acceptable — the paywall fires on Dashboard navigation regardless. Server push would be more reliable but requires infrastructure the product does not yet justify.

The two-phase interrupt design (Rage Channel → Guided Interrupt) adds one meaningful build item: BubbleEngine + TapDecayDetector. The algorithm is simple; the SwiftUI rendering performance needs early validation. Flag BubbleEngine as a sprint-1 task with a performance checkpoint before any other TiltInterrupt UI work proceeds. If SwiftUI cannot render the bubble set at target frame rate on iPhone 12, the fallback is a simpler tap-counter view (tap a single large circle, tap count drives decay detection) — same algorithm, lower rendering complexity. This fallback takes one day to implement. No timeline risk.

This architecture delivers the 4-week timeline. The complexity surface is narrow and well-defined: widget cold-launch (validated), wall-clock timer (standard pattern), BubbleEngine performance (early validation checkpoint, known fallback), dual-layer sync (careful but not complex). No timeline risk from architecture decisions.

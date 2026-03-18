---
title: Data Completeness
prev:
  text: Why Storytelling Works
  link: /explanation/why-storytelling
next:
  text: One Model, Three Views
  link: /explanation/one-model-three-views
---

# Data Completeness

Data completeness is one of the principles that sets NDD apart from looser specification approaches. It's simple to state and powerful in practice: every piece of data visible in your system must trace back, through events, to the commands that caused it. Nothing appears from nowhere.

## The Principle

In NDD, your system's behavior is modeled with three atomic units:

- **Commands**: things the system is told to do (`CreateEvent`, `SubmitRSVP`)
- **Events**: things that happened as a result (`EventCreated`, `RSVPConfirmed`)
- **State**: the current view of data, derived from events (`AvailableEventsView`, `MyRSVPsView`)

Data completeness means the chain from command to event to state is unbroken. If a query moment renders `MyRSVPsView`, then:

1. `MyRSVPsView` must be derived from events like `RSVPConfirmed` and `AddedToWaitlist`
2. Those events must have been produced by a command moment like `SubmitRSVP`
3. That command moment must exist somewhere in the model

If any link is missing, you have a screen showing data that nobody specified how it got there. That's a bug waiting to happen.

## What It Catches

**The phantom data bug.** A designer puts a "total revenue" field on a dashboard. Nobody specified where that number comes from. The developer invents a calculation. The product manager had a different one in mind. With data completeness, you can't show data without specifying the events that produce it.

**The orphan state bug.** A query returns data that depends on events from another part of the system that nobody connected. With data completeness, every projection traces explicitly to its source events.

**The impossible state bug.** A screen shows a status that no command in the system can produce. With data completeness, this gap is visible before code is written.

## In Practice

When you model a scene, the business specs tell you exactly where data comes from:

```
Moment: Browse Available Events (query)

  Given EventPublished { eventId: "evt_123" }
  And EventCreated { eventId: "evt_123", name: "Spring Conference", capacity: 100 }
  Then AvailableEventsView
    { events: [{ eventId: "evt_123", name: "Spring Conference", remainingCapacity: 100 }] }
```

The `Given` steps tell you: this state depends on `EventPublished` and `EventCreated`. Tracing backward, `EventPublished` comes from the Publish Event command moment. `EventCreated` comes from the Create Event Draft command moment. The chain is complete.

Now imagine someone adds a "rating" field without specifying how ratings enter the system. Data completeness flags the gap: there's no `RatingSubmitted` event, no `SubmitRating` command. The field is impossible to populate.

## Data Completeness and AI

This principle becomes critical when AI generates your specifications. AI produces plausible-looking specs. It's less reliable at ensuring every piece of data has an origin.

When the Auto platform generates moments from a prompt, data completeness is a constraint the model enforces. AI can't produce a query that renders state without specifying the events that feed it.

This is one advantage of a model-based approach over prose. A markdown file can say anything. A structured model has integrity constraints.

## Checking Your Model

At every query moment, ask:

1. What state does this moment render?
2. What events produce that state?
3. Do those events exist as outputs of command or react moments elsewhere in the model?
4. Are there any fields in the state that no event populates?

A gap at this level is worth more than a hundred lines of test code, because it exists where it's cheapest to fix.

---

*A [spec dialect](https://specdriven.com/dialects/narrative-driven) by [Auto](https://on.auto). Part of the [spec-driven](https://specdriven.com) movement.*

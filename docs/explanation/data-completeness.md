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

Data completeness is one of the ideas that sets NDD apart from looser specification approaches. The rule is simple: every piece of data visible in your system must trace back, through events, to the commands that caused it. Nothing appears from nowhere.

## The Principle

In NDD, your system's behavior is modeled with three atomic units. Commands are things the system is told to do (`ScheduleShow`, `BookTickets`). Events are things that happened as a result (`ShowScheduled`, `TicketsReserved`). State is the current view of data, derived from events (`AvailableShowsView`, `MyBookingsView`).

Data completeness means the chain from command to event to state is unbroken. If a query moment renders `MyBookingsView`, then:

1. `MyBookingsView` must be derived from events like `TicketsReserved` and `AddedToWaitlist`
2. Those events must have been produced by a command moment like `BookTickets`
3. That command moment must exist somewhere in the model

If any link is missing, you have a screen showing data that nobody specified how it got there. That's a bug waiting to happen.

## What It Catches

The phantom data bug: a designer puts a "total revenue" field on a dashboard. Nobody specified where that number comes from. The developer invents a calculation. The product manager had a different one in mind. With data completeness, you can't show data without specifying the events that produce it.

The orphan state bug: a query returns data that depends on events from another part of the system that nobody connected. Data completeness forces every projection to trace explicitly to its source events.

The impossible state bug: a screen shows a status that no command in the system can produce. Data completeness makes this gap visible before code is written.

## In Practice

When you model a scene, the business specs tell you exactly where data comes from:

```
Moment: Browse Available Shows (query)

  Given ShowPublished { showId: "shw_123" }
  And ShowScheduled { showId: "shw_123", title: "Neon Drift Live", tickets: 500 }
  Then AvailableShowsView
    { shows: [{ showId: "shw_123", title: "Neon Drift Live", remainingTickets: 500 }] }
```

The `Given` steps tell you: this state depends on `ShowPublished` and `ShowScheduled`. Tracing backward, `ShowPublished` comes from the Publish Show command moment in the "Listing a Show" narrative. `ShowScheduled` comes from the Schedule Show command moment in the same narrative. The chain crosses narrative boundaries but remains complete.

Now imagine someone adds a "rating" field without specifying how ratings enter the system. Data completeness flags the gap: there's no `RatingSubmitted` event, no `SubmitRating` command. The field is impossible to populate.

## Data Completeness and AI

This principle matters most when AI generates your specifications. AI produces plausible-looking specs. It's less reliable at making sure every piece of data has an origin.

When the Auto platform generates moments from a prompt, data completeness is a constraint the model enforces. The AI can't produce a query that renders state without specifying the events that feed it.

That's an advantage of a model-based approach over prose. A markdown file can say anything. A structured model has integrity constraints.

## Checking Your Model

At every query moment, ask:

1. What state does this moment render?
2. What events produce that state?
3. Do those events exist as outputs of command or react moments elsewhere in the model?
4. Are there any fields in the state that no event populates?

Catching a gap here is worth more than a hundred lines of test code, because you're fixing it where it's cheapest to fix.


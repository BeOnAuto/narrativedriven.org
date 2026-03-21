---
title: Your First Narrative in 10 Minutes
next:
  text: Build the Concert Booking Platform
  link: /guides/build-concert-platform
---

# Your First Narrative in 10 Minutes

In 10 minutes, you'll create a single scene with three moments and see how NDD captures a complete, verifiable story of user behavior. No tools required for the concepts. To build it for real, you'll use the [Auto platform](https://on.auto).

## Start with a Story

Think of a story your application tells. Not a feature list. A story — with actors, a beginning, and an outcome. For this tutorial, let's use: "A promoter lists a new show."

That's a narrative. It has one scene (the happy path) with three moments. Let's build it.

## Three Moments

**Moment 1: Schedule Show** (command)

The promoter fills in a form with the show title, date, venue, and ticket capacity. They submit it. The system records that a show was scheduled.

*Interaction specs:*
```
Show scheduling form
  it should show fields for title, date, venue, tickets, description
  it should enable submit when required fields are complete
```

*Business specs:*
```
Rule: Draft show scheduling
  Example: Promoter schedules a new show
    When ScheduleShow { title: "Neon Drift Live", tickets: 500 }
    Then ShowScheduled { showId: "shw_123", title: "Neon Drift Live", tickets: 500 }
```

**Moment 2: Preview Draft Show** (query)

The promoter sees a preview of their show as fans would see it.

*Interaction specs:*
```
Draft preview display
  it should display show card with all draft details
  it should show edit button linking back to form
  it should show publish button when draft is complete
```

*Business specs:*
```
Rule: Draft show projection
  Example: Show details are available after scheduling
    Given ShowScheduled { showId: "shw_123", title: "Neon Drift Live" }
    When GetShowDetails { showId: "shw_123" }
    Then ShowDetails { showId: "shw_123", title: "Neon Drift Live", status: "Draft" }
```

**Moment 3: Publish Show** (command)

The promoter publishes the show, making it visible to fans.

*Business specs:*
```
Rule: Show publishing
  Example: Draft show publishes successfully
    Given Show { showId: "shw_123", status: "Draft" }
    When PublishShow { showId: "shw_123" }
    Then ShowPublished { showId: "shw_123" }

  Example: Already-published show is rejected
    Given Show { showId: "shw_123", status: "Published" }
    When PublishShow { showId: "shw_123" }
    Then PublishRejected { reason: "Already published" }
```

## Check Data Completeness

Read the scene aloud: "Promoter schedules a show, previews it, then publishes it."

Does every piece of data trace back? The Preview query shows ShowDetails with status "Draft." That state comes from the ShowScheduled event, which came from the ScheduleShow command in Moment 1. The Publish command checks Show status, which is also derived from ShowScheduled. The chain is complete.

## What You Just Built

One narrative. One scene. Three moments. You've captured UI behavior (interaction specs), business rules (business specs), the happy path AND an edge case (already published), and the data flow (data completeness). That's more than most PRDs capture in three pages.

Notice the "already-published" rejection. That's an edge case within the Publish Show moment — it lives as an additional business spec, not as a separate scene. The promoter sees an error and stays on the same screen. Their journey doesn't fundamentally change. That's incidental detail, not an alternative path.

## What About Alternative Paths?

What happens when a fan tries to book tickets and the show is sold out? That IS a fundamentally different journey — the fan sees a waitlist instead of a confirmation. That deserves its own scene, branching from the "Book Tickets" moment.

The [Build the Concert Booking Platform](/guides/build-concert-platform) tutorial shows you how: three narratives, five scenes with branching, all four moment types, and the full data completeness chain across narratives.

## Structuring Your Own Narratives

Not sure when something is a scene vs. incidental detail? The [Structuring Narratives and Scenes](/guides/structuring-narratives) guide gives you a rubric for deciding.

---

**[Build the Concert Booking Platform →](/guides/build-concert-platform)** · **[Try it on Auto →](https://on.auto)**

---

*A [spec dialect](https://specdriven.com/dialects/narrative-driven) by the [Auto](https://on.auto) team.*

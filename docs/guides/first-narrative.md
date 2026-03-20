---
title: Your First Narrative in 10 Minutes
next:
  text: Build the Theater Booking Platform
  link: /guides/build-theater-platform
---

# Your First Narrative in 10 Minutes

In 10 minutes, you'll create a single scene with three moments and see how NDD captures a complete, verifiable story of user behavior. No tools required for the concepts. To build it for real, you'll use the [Auto platform](https://on.auto).

## Start with a Story

Think of the simplest thing a user does in your application. For this tutorial, let's use: "A producer schedules a new show."

That's a scene. Let's break it into moments.

## Three Moments

**Moment 1: Schedule Show** (command)

The producer fills in a form with the show title, date, venue, and seat capacity. They submit it. The system records that a show was scheduled.

*Interaction specs:*
```
Show scheduling form
  it should show fields for title, date, venue, seats, description
  it should enable submit when required fields are complete
```

*Business specs:*
```
Rule: Draft show scheduling
  Example: Producer schedules a new show
    When ScheduleShow { title: "Romeo and Juliet", seats: 150 }
    Then ShowScheduled { showId: "shw_123", title: "Romeo and Juliet", seats: 150 }
```

**Moment 2: Preview Draft Show** (query)

The producer sees a preview of their show as patrons would see it.

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
    Given ShowScheduled { showId: "shw_123", title: "Romeo and Juliet" }
    When GetShowDetails { showId: "shw_123" }
    Then ShowDetails { showId: "shw_123", title: "Romeo and Juliet", status: "Draft" }
```

**Moment 3: Publish Show** (command)

The producer publishes the show, making it visible to patrons.

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

Read the scene aloud: "Producer schedules a show, previews it, then publishes it."

Does every piece of data trace back? The Preview query shows ShowDetails with status "Draft." That state comes from the ShowScheduled event, which came from the ScheduleShow command in Moment 1. The Publish command checks Show status, which is also derived from ShowScheduled. The chain is complete.

## What You Just Built

In three moments, you've captured the UI behavior (interaction specs), the business rules (business specs), the happy path AND the edge case (already published), and the data flow (data completeness). That's more than most PRDs capture in three pages.

## Next Steps

This was one scene. A real application has multiple scenes organized into narratives. The [Build the Theater Booking Platform](/guides/build-theater-platform) tutorial walks you through a complete example with three narratives, multiple scenes, all four moment types, and the full data completeness chain.

---

**[Build the Theater Booking Platform →](/guides/build-theater-platform)** · **[Try it on Auto →](https://on.auto)**

---

*A [spec dialect](https://specdriven.com/dialects/narrative-driven) by the [Auto](https://on.auto) team.*

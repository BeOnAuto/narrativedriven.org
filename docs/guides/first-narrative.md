---
title: Your First Narrative in 10 Minutes
next:
  text: Build the RSVP Platform
  link: /guides/build-rsvp-platform
---

# Your First Narrative in 10 Minutes

In 10 minutes, you'll create a single scene with three moments and see how NDD captures a complete, verifiable story of user behavior. No tools required for the concepts. To build it for real, you'll use the [Auto platform](https://on.auto).

## Start with a Story

Think of the simplest thing a user does in your application. For this tutorial, let's use: "An organizer creates a new event."

That's a scene. Let's break it into moments.

## Three Moments

**Moment 1: Create Event Draft** (command)

The organizer fills in a form with the event name, date, location, and capacity. They submit it. The system records that an event was created.

*Interaction specs:*
```
Event creation form
  it should show fields for name, date, location, capacity, description
  it should enable submit when required fields are complete
```

*Business specs:*
```
Rule: Draft event creation
  Example: Organizer creates a new event
    When CreateEvent { name: "Spring Conference", capacity: 100 }
    Then EventCreated { eventId: "evt_123", name: "Spring Conference", capacity: 100 }
```

**Moment 2: Preview Draft Event** (query)

The organizer sees a preview of their event as attendees would see it.

*Interaction specs:*
```
Draft preview display
  it should display event card with all draft details
  it should show edit button linking back to form
  it should show publish button when draft is complete
```

*Business specs:*
```
Rule: Draft event projection
  Example: Event details are available after creation
    Given EventCreated { eventId: "evt_123", name: "Spring Conference" }
    When GetEventDetails { eventId: "evt_123" }
    Then EventDetails { eventId: "evt_123", name: "Spring Conference", status: "Draft" }
```

**Moment 3: Publish Event** (command)

The organizer publishes the event, making it visible to attendees.

*Business specs:*
```
Rule: Event publishing
  Example: Draft event publishes successfully
    Given Event { eventId: "evt_123", status: "Draft" }
    When PublishEvent { eventId: "evt_123" }
    Then EventPublished { eventId: "evt_123" }

  Example: Already-published event is rejected
    Given Event { eventId: "evt_123", status: "Published" }
    When PublishEvent { eventId: "evt_123" }
    Then PublishRejected { reason: "Already published" }
```

## Check Data Completeness

Read the scene aloud: "Organizer creates an event draft, previews it, then publishes it."

Does every piece of data trace back? The Preview query shows EventDetails with status "Draft." That state comes from the EventCreated event, which came from the CreateEvent command in Moment 1. The Publish command checks Event status, which is also derived from EventCreated. The chain is complete.

## What You Just Built

In three moments, you've captured the UI behavior (interaction specs), the business rules (business specs), the happy path AND the edge case (already published), and the data flow (data completeness). That's more than most PRDs capture in three pages.

## Next Steps

This was one scene. A real application has multiple scenes organized into narratives. The [Build the RSVP Platform](/guides/build-rsvp-platform) tutorial walks you through a complete example with three narratives, multiple scenes, all four moment types, and the full data completeness chain.

---

**[Build the RSVP Platform →](/guides/build-rsvp-platform)** · **[Try it on Auto →](https://on.auto)**

---

*A [spec dialect](https://specdriven.com/dialects/narrative-driven) by the [Auto](https://on.auto) team.*

---
title: Moment Types
next:
  text: Glossary
  link: /reference/glossary
---

# The Four Moment Types

Every moment in NDD is one of four types. The type determines what specifications it carries and what role it plays in the narrative.

## Command

**What it is**: The actor does something that changes state.

**When to use it**: Whenever a user submits data, triggers an action, or causes the system to do something.

**Specs**: Interaction specs (UI behavior) and business specs (Given/When/Then rules).

**Pattern**: Given [events/state] + When [Command] → Then [Event(s)]

**Example** (RSVP Platform):

```
Interaction specs:
  RSVP submission form
    it should show RSVP confirmation dialog
    it should enable RSVP button
    it should show loading during submission

Business specs:
  Rule: RSVP capacity processing
    Example: Event has capacity
      Given Event { status: "published" }
      When SubmitRSVP { eventId: "evt_123", attendeeId: "att_456" }
      Then RSVPConfirmed { rsvpId: "rsvp_789" }

    Example: Event is full
      Given Event { status: "full" }
      When SubmitRSVP { eventId: "evt_123", attendeeId: "att_999" }
      Then AddedToWaitlist { rsvpId: "rsvp_888" }
```

## Query

**What it is**: The actor receives or views data.

**When to use it**: Whenever a user loads a page, views a list, checks a status, or reads information.

**Specs**: Interaction specs and business specs.

**Pattern**: Given [events] + When [Query] → Then [State]

**Example** (RSVP Platform):

```
Interaction specs:
  Events grid display
    it should display events with name, date, remaining capacity
    it should show RSVP button for events with capacity
    it should show waitlist button for full events

Business specs:
  Rule: Available events projection
    Example: Published event appears in listing
      Given EventPublished { eventId: "evt_123" }
      And EventCreated { eventId: "evt_123", name: "Spring Conference", capacity: 100 }
      Then AvailableEventsView {
        events: [{ eventId: "evt_123", remainingCapacity: 100 }]
      }
```

Note the data completeness: the state (AvailableEventsView) is built entirely from prior events.

## React

**What it is**: The system responds to an event automatically, with no actor involved.

**When to use it**: Automated workflows: sending notifications, promoting from waitlists, triggering downstream processes.

**Specs**: Business specs only. No interaction specs (no UI).

**Pattern**: Given [state] + When [Event] → Then [Event(s)]

**Example** (RSVP Platform):

```
Business specs:
  Rule: Waitlist promotion process
    Example: Next waitlisted attendee is promoted
      Given WaitlistPosition { attendeeId: "att_999", position: 1 }
      When RSVPCancelled { rsvpId: "rsvp_789", eventId: "evt_123" }
      Then ConfirmationEmailSent { attendeeId: "att_999" }
```

## Experience

**What it is**: The actor interacts with the UI without involving the server.

**When to use it**: Navigation, modals, popups, tooltips, loading states, and any client-side-only behavior.

**Specs**: Interaction specs only. No business specs.

**Example**:

```
Interaction specs:
  Homepage
    it should show a hero section with a welcome message
    it should allow user to start the questionnaire
```

## Choosing the Right Type

1. **Does it change state?** → Command
2. **Does it read state?** → Query
3. **Does the system react automatically to an event?** → React
4. **Is it UI-only behavior?** → Experience

---

*A [spec dialect](https://specdriven.com/dialects/narrative-driven) by the [Auto](https://on.auto) team.*

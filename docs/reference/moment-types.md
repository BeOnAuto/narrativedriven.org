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

**Example** (Theater Booking Platform):

```
Interaction specs:
  Seat booking form
    it should show booking confirmation dialog
    it should enable book button
    it should show loading during submission

Business specs:
  Rule: Booking capacity processing
    Example: Show has seats available
      Given Show { status: "published" }
      When BookSeats { showId: "shw_123", patronId: "pat_456" }
      Then SeatsReserved { bookingId: "bkng_789" }

    Example: Show is sold out
      Given Show { status: "sold_out" }
      When BookSeats { showId: "shw_123", patronId: "pat_999" }
      Then AddedToWaitlist { bookingId: "bkng_888" }
```

## Query

**What it is**: The actor receives or views data.

**When to use it**: Whenever a user loads a page, views a list, checks a status, or reads information.

**Specs**: Interaction specs and business specs.

**Pattern**: Given [events] + When [Query] → Then [State]

**Example** (Theater Booking Platform):

```
Interaction specs:
  Shows grid display
    it should display shows with title, date, remaining seats
    it should show book button for shows with availability
    it should show waitlist button for sold-out shows

Business specs:
  Rule: Available shows projection
    Example: Published show appears in listing
      Given ShowPublished { showId: "shw_123" }
      And ShowScheduled { showId: "shw_123", title: "Romeo and Juliet", seats: 150 }
      Then AvailableShowsView {
        shows: [{ showId: "shw_123", remainingSeats: 150 }]
      }
```

Note the data completeness: the state (AvailableShowsView) is built entirely from prior events.

## React

**What it is**: The system responds to an event automatically, with no actor involved.

**When to use it**: Automated workflows: sending notifications, promoting from waitlists, triggering downstream processes.

**Specs**: Business specs only. No interaction specs (no UI).

**Pattern**: Given [state] + When [Event] → Then [Event(s)]

**Example** (Theater Booking Platform):

```
Business specs:
  Rule: Waitlist promotion process
    Example: Next waitlisted patron is promoted
      Given WaitlistPosition { patronId: "pat_999", position: 1 }
      When BookingCancelled { bookingId: "bkng_789", showId: "shw_123" }
      Then ConfirmationEmailSent { patronId: "pat_999" }
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

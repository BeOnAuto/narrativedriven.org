---
title: Moment Types
next:
  text: Glossary
  link: /reference/glossary
---

# The Four Moment Types

A moment is a single step that moves a scene toward its outcome. Every moment in NDD has one of four types. The type determines what specifications it carries and what role it plays in the scene.

## Command

The actor does something that changes state. Use it whenever a user submits data, triggers an action, or causes the system to do something.

Carries both interaction specs (UI behavior) and business specs (Given/When/Then rules).

Pattern: Given [events/state] + When [Command] → Then [Event(s)]

Example (Concert Booking Platform):

```
Interaction specs:
  Ticket booking form
    it should show booking confirmation dialog
    it should enable book button
    it should show loading during submission

Business specs:
  Rule: Booking capacity processing
    Example: Show has tickets available
      Given Show { status: "published" }
      When BookTickets { showId: "shw_123", fanId: "fan_456" }
      Then TicketsReserved { bookingId: "bkng_789" }

    Example: Show is sold out
      Given Show { status: "sold_out" }
      When BookTickets { showId: "shw_123", fanId: "fan_999" }
      Then AddedToWaitlist { bookingId: "bkng_888" }
```

## Query

The actor receives or views data. Use it whenever a user loads a page, views a list, checks a status, or reads information.

Carries interaction specs and business specs.

Pattern: Given [events] + When [Query] → Then [State]

Example (Concert Booking Platform):

```
Interaction specs:
  Shows grid display
    it should display shows with title, date, remaining tickets
    it should show book button for shows with tickets available
    it should show waitlist button for sold-out shows

Business specs:
  Rule: Available shows projection
    Example: Published show appears in listing
      Given ShowPublished { showId: "shw_123" }
      And ShowScheduled { showId: "shw_123", title: "Neon Drift Live", tickets: 500 }
      Then AvailableShowsView {
        shows: [{ showId: "shw_123", remainingTickets: 500 }]
      }
```

Notice the data completeness: the state (AvailableShowsView) is built entirely from prior events.

## React

The system responds to an event automatically, with no actor involved. Use it for automated workflows: sending notifications, promoting from waitlists, triggering downstream processes.

Carries business specs only. No interaction specs (there's no UI).

Pattern: Given [state] + When [Event] → Then [Event(s)]

Example (Concert Booking Platform):

```
Business specs:
  Rule: Waitlist promotion process
    Example: Next waitlisted fan is promoted
      Given WaitlistPosition { fanId: "fan_999", position: 1 }
      When BookingCancelled { bookingId: "bkng_789", showId: "shw_123" }
      Then ConfirmationEmailSent { fanId: "fan_999" }
```

## Experience

The actor interacts with the UI without involving the server. Use it for navigation, modals, popups, tooltips, loading states, and any client-side-only behavior.

Carries interaction specs only. No business specs.

Example:

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


---
title: "Build the Concert Booking Platform"
prev:
  text: Your First Narrative in 10 Minutes
  link: /guides/first-narrative
---

# Build the Concert Booking Platform

![Phone wireframe showing tickets next to a Concert Booking narrative card](/images/heroes/build-concert-platform.png){.page-hero}

This is the worked NDD example. We'll model a concert booking platform end to end using the taxonomy: one domain, multiple narratives, scenes that capture distinct outcomes, all four moment types, rules, and examples.

The goal is to show how the vocabulary works.

## The domain

**Concert Booking** is our domain: a coherent business capability for scheduling shows, selling tickets, and managing bookings.

| Concept | Value |
| ------- | ----- |
| Capability | Promoters list shows, fans book tickets, the system manages capacity and waitlists |
| Actors | Promoter, Fan, System |
| Entities | Show, Booking, Ticket, Waitlist |

Everything below the domain reuses these actors and concepts.

## The narratives

Inside Concert Booking, three narratives cover the broader product goals:

- **Listing a Show**: a published, bookable show exists.
- **Getting Tickets**: tickets are reserved, or the fan is on the waitlist.
- **Managing Your Booking**: booking state stays correct after the fact.

Each narrative groups one or more scene outcomes.

---

## Narrative 1: Listing a Show

**Goal:** a published, bookable show exists.

**Actors:** Promoter.

**Introduces:** Show entity, draft/published lifecycle.

This is the simplest narrative: one actor, one main outcome.

### Scene: Show published

The promoter's path from blank form to live listing.

| Moment | Type | What happens |
| ------ | ---- | ------------ |
| Schedule Show | Command | Promoter fills in show details and creates a draft listing |
| Preview Draft Show | Query | Promoter sees the draft as fans would see it |
| Publish Show | Command | Promoter publishes the draft and the show becomes bookable |

This scene creates the product facts that later fan-facing narratives depend on: the show exists, it has a title, venue, date, capacity, and publication status.

The "already published" rejection is an edge case inside the Publish Show moment, not a separate scene. The promoter sees an error and stays on the same screen. Their journey does not meaningfully change.

#### Moment: Schedule Show

```text
Outcome: A new show is recorded as a draft listing.

The promoter sees a scheduling form with fields for title, date,
venue, ticket count, and description. Submit is disabled until required
fields are complete.

Rule: Valid show details create a draft listing.

Example: Promoter schedules Neon Drift Live
When the promoter submits title, date, venue, ticket count, and description
Then the show exists as a draft
And the draft has title "Neon Drift Live"
And the draft has venue "The Foundry"
And the draft has 500 available tickets
```

#### Moment: Preview Draft Show

```text
Outcome: The promoter sees the draft rendered as a fan would see it.

The promoter sees a card view with title, date, venue, ticket count,
and description in the same layout fans will later see. A status badge
reads "Draft" so the promoter knows the show is not live yet.

Rule: Draft preview reflects the scheduled show.

Example: A scheduled show appears as a draft
Given the promoter scheduled Neon Drift Live
When the promoter opens the preview
Then the draft card shows the title, venue, date, and ticket count
And the status is "Draft"
```

#### Moment: Publish Show

```text
Outcome: A draft show becomes live and bookable.

The promoter sees a publish button on the draft preview. After publishing,
the status changes to "Published" and the show becomes visible to fans.

Rule: A draft can be published once.

Example: The promoter publishes the draft
Given Neon Drift Live is in draft
When the promoter clicks publish
Then Neon Drift Live is published
And fans can see it as bookable

Rule: A published show cannot be published again.

Example: The promoter tries to publish twice
Given Neon Drift Live is already published
When the promoter clicks publish again
Then the action is rejected
And the promoter stays on the preview
And the show remains published
```

---

## Narrative 2: Getting Tickets

**Goal:** tickets are reserved, or the fan is on the waitlist.

**Actors:** Fan.

**Introduces:** Booking, ticket capacity, waitlist.

This narrative has two scene outcomes. The fan can successfully reserve tickets, or the fan can end up on a waitlist when capacity is exhausted.

### Scene: Tickets reserved

| Moment | Type | What happens |
| ------ | ---- | ------------ |
| Browse Available Shows | Query | Fan views published shows with remaining tickets |
| Book Tickets | Command | Fan books tickets when capacity is available |
| Booking Confirmed | Query | Fan sees confirmation with booking details |

What the product shows: available shows come from promoter-published shows. Remaining ticket count must reflect existing reservations.

#### Moment: Browse Available Shows

```text
Outcome: The fan sees shows that can be booked.

The fan sees a grid of published shows with title, date, venue,
and remaining ticket count.

Rule: Only published shows appear as bookable.

Example: Published show appears in browsing
Given Neon Drift Live is published
And Neon Drift Live has tickets remaining
When the fan browses available shows
Then Neon Drift Live appears in the list
And the remaining ticket count is visible
```

#### Moment: Book Tickets

```text
Outcome: Tickets are reserved for the fan.

The fan selects a show, chooses a quantity, and confirms the booking.

Rule: Tickets cannot be reserved beyond remaining capacity.

Example: Fan books available tickets
Given Neon Drift Live has 5 tickets remaining
When the fan books 2 tickets
Then the booking is accepted
And 2 tickets are reserved for the fan
And the remaining ticket count decreases

Example: Fan requests more tickets than remain
Given Neon Drift Live has 1 ticket remaining
When the fan tries to book 2 tickets
Then the booking is rejected
And no tickets are reserved
And the fan stays on the booking screen
```

#### Moment: Booking Confirmed

```text
Outcome: The fan can see the booking details.

The confirmation shows show title, date, venue, ticket quantity,
booking status, and booking reference.

What the product shows: the booking reference is created when the booking is accepted.

Rule: Confirmation reflects the accepted booking.

Example: Fan sees confirmed booking
Given the fan reserved 2 tickets for Neon Drift Live
When the confirmation screen appears
Then the booking status is "Reserved"
And the confirmation shows 2 tickets
And the booking reference is visible
```

### Scene: Fan added to waitlist

A different outcome occurs when capacity is exhausted at the moment of booking.

| Moment | Type | What happens |
| ------ | ---- | ------------ |
| Book Tickets (sold out) | Command | Fan attempts to book, but no capacity remains |
| Waitlist Confirmation | Query | Fan sees waitlist position and expectations |

This is a separate scene because the fan ends up in a meaningfully different state. They do not have tickets; they are waiting for availability.

#### Moment: Book Tickets (sold out)

```text
Outcome: The fan joins the waitlist instead of reserving tickets.

Rule: Sold-out shows add the fan to the waitlist when waitlisting is open.

Example: Fan books after sellout
Given Neon Drift Live has no tickets remaining
And the waitlist is open
When the fan tries to book 2 tickets
Then the fan is added to the waitlist
And no tickets are reserved
```

#### Moment: Waitlist Confirmation

```text
Outcome: The fan understands their waitlist state.

The fan sees their waitlist position, show details, and what happens if
tickets become available.

Rule: Waitlist confirmation explains the fan's next state.

Example: Fan sees waitlist position
Given the fan is added to the waitlist
When the confirmation appears
Then the fan sees their waitlist position
And the fan sees that no tickets have been reserved yet
```

---

## Narrative 3: Managing Your Booking

**Goal:** booking state stays correct after the fact.

**Actors:** Fan, System.

**Introduces:** Cancellation, waitlist promotion, notifications.

### Scene: Booking cancelled

The fan changes their mind.

| Moment | Type | What happens |
| ------ | ---- | ------------ |
| View My Bookings | Query | Fan sees their bookings with status badges |
| Cancel Booking | Command | Fan cancels a reserved booking |

#### Moment: Cancel Booking

```text
Outcome: A reserved booking is cancelled.

Rule: A fan can cancel their own reserved booking.

Example: Fan cancels reserved booking
Given the fan has a reserved booking for Neon Drift Live
When the fan cancels the booking
Then the booking status becomes "Cancelled"
And the tickets are no longer held for that fan
```

### Scene: Waitlist promotion confirmed

The system responds after a cancellation when someone is waiting.

| Moment | Type | What happens |
| ------ | ---- | ------------ |
| Promote Waitlist Automatically | React | System promotes the next eligible fan |
| Send Confirmation Email | Command | System sends confirmation to the promoted fan |

This is the react moment type in action. No human clicks a button. The system responds to a meaningful product situation.

#### Moment: Promote Waitlist Automatically

```text
Outcome: The next waitlisted fan receives the newly available ticket.

Rule: The earliest eligible waitlist entry is promoted when capacity returns.

Example: Cancellation opens capacity
Given one booking is cancelled
And a fan is first on the waitlist
When the system processes the cancellation
Then the first waitlisted fan is promoted
And that fan now has a reserved booking
```

#### Moment: Send Confirmation Email

```text
Outcome: The promoted fan is notified.

Rule: Promoted fans receive confirmation.

Example: Promoted fan receives email
Given a fan has been promoted from the waitlist
When confirmation is sent
Then the fan receives an email with show and booking details
```

---

## Data completeness in plain language

Data completeness means important screen content has an explained source.

For this example:

1. A promoter schedules and publishes a show.
2. Fans browse published shows.
3. Fans reserve tickets or join the waitlist.
4. Confirmations show the booking or waitlist state that resulted.
5. Cancellations can make capacity available.
6. The system can promote the next waitlisted fan.

Every important field on screen should tie back to one of those product facts. If a screen shows a booking reference, the story should say when that reference exists. If a screen shows remaining tickets, the story should explain what changes that count.

## Transitions in action

The Concert Booking domain has two meaningful transition points:

| Moment | From scene | Leads into | Condition |
| ------ | ---------- | ---------- | --------- |
| Book Tickets | Tickets reserved | Fan added to waitlist | Show sold out |
| Cancel Booking | Booking cancelled | Waitlist promotion confirmed | Waitlist has entries |

Transitions are NDD vocabulary: a moment can lead to a different scene when the actor or system reaches a meaningfully different outcome.

## How to read this example

Read from broad to specific:

1. Domain: what business capability is this?
2. Narrative: what goal thread are we following?
3. Scene: what outcome becomes true?
4. Moment: what behavior slice moves the scene forward?
5. Rule: what must hold?
6. Example: what concrete case proves it?
7. Screen content: what information needs a product source?

That is the method.

## Try it yourself

- [Use NDD with existing tools](/using-ndd-without-auto.html) to practice the taxonomy.
- [Join the Discord](https://discord.com/invite/B8BKcKMRm8) if you want to talk through your model with others.

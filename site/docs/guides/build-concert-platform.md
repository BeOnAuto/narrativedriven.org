---
title: "Build the Concert Booking Platform"
prev:
  text: Your First Narrative in 10 Minutes
  link: /guides/first-narrative
---

# Build the Concert Booking Platform

This is the worked NDD example. We'll model a concert booking platform end-to-end: one domain, multiple narratives, scenes that capture distinct outcomes, all four moment types, and data completeness that crosses narrative boundaries. You'll see the model in visual, document, and code views.

## The Domain

**Concert Booking** is our domain — a coherent business capability for scheduling shows, selling tickets, and managing bookings.

| Field | Value |
|-------|-------|
| Capability | Promoters list shows, fans book tickets, the system manages capacity and waitlists |
| Actors | Promoter, Fan, System |
| Entities | Show, Booking, Ticket, Waitlist |

Everything below the domain reuses these actors and entities.

## The Narratives

Inside Concert Booking, three narratives cover the platform's broader goals:

- **Listing a Show** — promoter goal: a published, bookable show exists
- **Getting Tickets** — fan goal: tickets are reserved or the fan is on the waitlist
- **Managing Your Booking** — fan goal: booking state stays correct after the fact

Each narrative groups one or more scene outcomes.

---

## Narrative 1: Listing a Show

*Goal: a published, bookable show exists. Actors: Promoter. Introduces: Show entity, draft/published lifecycle.*

The simplest narrative here. One scene, one actor, straight line to the outcome.

### Scene: Show published

The promoter's path from blank form to live listing.

| Moment | Type | What Happens |
|--------|------|-------------|
| Schedule Show | Command | Promoter fills in show details, system records ShowScheduled |
| Preview Draft Show | Query | Promoter sees show card as fans would see it |
| Publish Show | Command | Promoter publishes; system emits ShowPublished |

This scene produces the events — ShowScheduled and ShowPublished — that every downstream narrative depends on.

Note: the "already published" rejection is an edge case within the Publish Show moment's business specs, not a separate scene. The promoter sees an error and stays on the same screen. Their journey doesn't change.

---

## Narrative 2: Getting Tickets

*Goal: tickets are reserved, or the fan is on the waitlist. Actors: Fan. Introduces: Booking entity, ticket capacity, waitlist.*

Two scenes — two distinct outcomes. The fan's "Book Tickets" moment leads into one or the other depending on whether the show has capacity.

### Scene: Tickets reserved

| Moment | Type | What Happens |
|--------|------|-------------|
| Browse Available Shows | Query | Fan views grid of published shows with remaining tickets |
| Book Tickets | Command | Fan books tickets; system emits TicketsReserved |
| Booking Confirmed | Query | Fan sees confirmation with booking details |

Data completeness: Browse Available Shows renders AvailableShowsView, built from ShowPublished and ShowScheduled events. Those events came from Narrative 1. The chain crosses narrative boundaries but stays unbroken.

**The Book Tickets moment is a transition point.** If the show is sold out, that same moment leads into the next scene instead.

### Scene: Fan added to waitlist

A different outcome, reached when capacity is exhausted at the moment of booking. Two stakeholders, two business rules, completely different state for the fan going forward — by the [scene-worthiness rubric](/guides/structuring-narratives) this is its own scene, not a branch off the previous one.

| Moment | Type | What Happens |
|--------|------|-------------|
| Book Tickets (sold out) | Command | Fan attempts to book; system emits AddedToWaitlist |
| Waitlist Confirmation | Query | Fan sees waitlist position and estimated availability |

The fan sees different screens (waitlist position instead of booking confirmation), has different expectations (hoping for a cancellation), and the system treats them differently from here on.

---

## Narrative 3: Managing Your Booking

*Goal: booking state stays correct after the fact. Actors: Fan, System. Introduces: Cancellation, waitlist promotion, notifications.*

Two scenes — what happens after the ticket is booked, and the system-driven outcome that ripples out from a cancellation.

### Scene: Booking cancelled

The fan changes their mind.

| Moment | Type | What Happens |
|--------|------|-------------|
| View My Bookings | Query | Fan sees their bookings with status badges |
| Cancel Booking | Command | Fan cancels; system emits BookingCancelled |

**The Cancel Booking moment is a transition point.** The BookingCancelled event triggers the system to check the waitlist. If someone is waiting, the next scene happens automatically.

### Scene: Waitlist promotion confirmed

The system responds on its own. No human triggers this.

| Moment | Type | What Happens |
|--------|------|-------------|
| Auto Promote Waitlist | React | System checks waitlist, promotes next fan, emits WaitlistPromotionConfirmed |
| Send Confirmation Email | Command (no UI) | System sends confirmation to promoted fan |

This is the react moment type in action. When BookingCancelled fires, the system promotes the next waitlisted fan. No UI, just business logic responding to an event.

---

## Data Completeness Across Narratives

Let's trace the full chain across all three narratives within the Concert Booking domain:

1. **Promoter** runs ScheduleShow → **ShowScheduled** *(Narrative 1, Scene: Show published)*
2. **Promoter** runs PublishShow → **ShowPublished** *(Narrative 1, Scene: Show published)*
3. **Fan** queries Browse Available Shows → reads ShowPublished + ShowScheduled → **AvailableShowsView** *(Narrative 2, Scene: Tickets reserved)*
4. **Fan** runs BookTickets → **TicketsReserved** *(Narrative 2, Scene: Tickets reserved)*, or transitions into **Fan added to waitlist** → **AddedToWaitlist**
5. **Fan** runs CancelBooking → **BookingCancelled** *(Narrative 3, Scene: Booking cancelled)*
6. **System** reacts to BookingCancelled → checks **WaitlistPosition** → **WaitlistPromotionConfirmed** → **ConfirmationEmailSent** *(Narrative 3, Scene: Waitlist promotion confirmed)*

Every state shown on screen traces back to events. Every event traces back to commands. The chain crosses narrative boundaries but stays complete. Data completeness doesn't stop at the edge of a narrative. It spans the entire domain.

## Transitions in Action

The Concert Booking domain has two transition points where one moment leads into the start of a different scene:

| Exit Moment | From scene | Leads into | Condition |
|-------------|------|-----|-----------|
| Book Tickets | Tickets reserved | Fan added to waitlist | Show sold out |
| Cancel Booking | Booking cancelled | Waitlist promotion confirmed | Waitlist has entries |

On the visual canvas, these appear as connecting lines between moments and scene cards. In the code view, they're expressed as exit points on moments with references to target scenes.

## The Three Views

### Visual View

<!-- Screenshot: visual canvas showing three narrative cards with scene transitions -->

On the canvas, you see one domain (Concert Booking) holding three narrative cards: "Listing a Show," "Getting Tickets," and "Managing Your Booking." Each narrative has its storyboard image. Scene cards sit under each narrative — one per outcome — with filmstrip moments inside. Transition lines connect the Book Tickets moment to the "Fan added to waitlist" scene and the Cancel Booking moment to the "Waitlist promotion confirmed" scene.

### Document View

<!-- Screenshot: document view showing Tickets reserved scene with moments -->

In the document editor, each scene is its own page. "Tickets reserved" shows the scene heading (the outcome), then each moment as a structured block. Expand a moment to see its interaction specs and business specs. Transition points are marked with callouts linking to the target scene.

### Code View

<!-- Screenshot: code view showing TypeScript DSL -->

In the code editor, the same model appears as TypeScript:

```typescript
const ScheduleShow = defineCommand<{
  title: string;
  dateTime: Date;
  venue: string;
  tickets: number;
  description: string;
}>('ScheduleShow');

const ShowScheduled = defineEvent<{
  showId: string;
  title: string;
  tickets: number;
}>('ShowScheduled');

narrative('Listing a Show', () => {
  scene('Show published', () => {
    command('Schedule Show')
      .client(() => {
        describe('Show scheduling form', () => {
          it('show form with title, date, venue, tickets, description fields');
          it('enable submit when required fields complete');
        });
      })
      .server(() => {
        specs(() => {
          rule('Draft show scheduling', () => {
            example('Promoter schedules a new show')
              .when(ScheduleShow, 'the promoter schedules a new show', {
                title: 'Neon Drift Live',
                dateTime: new Date('2024-04-15T19:30:00Z'),
                venue: 'The Roundhouse',
                tickets: 500,
                description: 'An evening of electronic beats and live visuals',
              })
              .then(ShowScheduled, 'the show is recorded as a draft', {
                showId: 'shw_123',
                title: 'Neon Drift Live',
                tickets: 500,
              });
          });
        });
      });

    // ... Preview Draft Show, Publish Show moments
  });
});

narrative('Getting Tickets', () => {
  scene('Tickets reserved', () => {
    // ... Browse Available Shows, Book Tickets (with transition), Booking Confirmed
  });

  scene('Fan added to waitlist', { reachedFrom: 'Book Tickets' }, () => {
    // ... Book Tickets (sold out), Waitlist Confirmation
  });
});
```

All three views show the same model. Edit one, the others update.

## Try It Yourself

- [Join the Auto waitlist](https://on.auto) to build this on the platform
- [Clone Auto Engineer](https://github.com/BeOnAuto/auto-engineer) to run it locally
- [Join the Discord](https://discord.com/invite/B8BKcKMRm8) if you want to talk through your model with others

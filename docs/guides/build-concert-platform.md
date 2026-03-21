---
title: "Build the Concert Booking Platform"
prev:
  text: Your First Narrative in 10 Minutes
  link: /guides/first-narrative
---

# Build the Concert Booking Platform

This is the worked NDD example. We'll model a concert booking platform end-to-end: multiple narratives, scenes that branch, all four moment types, and data completeness that crosses narrative boundaries. You'll see the model in visual, document, and code views.

## The Application

A concert booking platform where promoters schedule and publish shows, fans browse and book tickets, and the system manages capacity and waitlists automatically. Two actors: Promoter and Fan.

## The Narratives

Our platform tells three stories. Each is a narrative — a distinct arc involving actors, entities, and outcomes.

---

## Narrative 1: Listing a Show

*Actors: Promoter. Introduces: Show entity, draft/published lifecycle.*

This is the simplest narrative — one scene, one actor, one straight line.

### Scene 1: Schedule and Publish (happy path)

The Promoter's journey from blank form to live listing.

| Moment | Type | What Happens |
|--------|------|-------------|
| Schedule Show | Command | Promoter fills in show details, system records ShowScheduled |
| Preview Draft Show | Query | Promoter sees show card as fans would see it |
| Publish Show | Command | Promoter publishes; system emits ShowPublished |

This scene introduces the foundation events — ShowScheduled and ShowPublished — that every downstream narrative depends on.

Note: the "already published" rejection is an edge case within the Publish Show moment's business specs, not a separate scene. The promoter sees an error and stays on the same screen. Their journey doesn't change.

---

## Narrative 2: Getting Tickets

*Actors: Fan. Introduces: Booking entity, ticket capacity, waitlist.*

This narrative has two scenes. The happy path and an alternative that branches when the show is sold out.

### Scene 1: Browse and Book (happy path)

The Fan's journey from browsing to confirmed booking.

| Moment | Type | What Happens |
|--------|------|-------------|
| Browse Available Shows | Query | Fan views grid of published shows with remaining tickets |
| Book Tickets | Command | Fan books tickets; system emits TicketsReserved |
| Booking Confirmed | Query | Fan sees confirmation with booking details |

Data completeness: Browse Available Shows renders AvailableShowsView, which is built from ShowPublished and ShowScheduled events. Those events came from Narrative 1. The chain crosses narrative boundaries but remains unbroken.

**Book Tickets is an exit point.** If the show is sold out, the story branches to Scene 2.

### Scene 2: Sold Out — Join Waitlist (branches from Book Tickets)

The Fan tries to book but there are no tickets left. Their journey takes a fundamentally different direction.

| Moment | Type | What Happens |
|--------|------|-------------|
| Book Tickets (sold out) | Command | Fan attempts to book; system emits AddedToWaitlist |
| Waitlist Confirmation | Query | Fan sees waitlist position and estimated availability |

This scene passes the [scene-worthiness rubric](/guides/structuring-narratives): the fan sees different screens (waitlist position instead of booking confirmation), has different expectations (hoping for a cancellation), and the system behaves differently toward them going forward.

---

## Narrative 3: Managing Your Booking

*Actors: Fan, System. Introduces: Cancellation, waitlist promotion, notifications.*

What happens after the ticket is booked. Two scenes: the happy path of cancelling, and the alternative where a waitlisted fan gets promoted.

### Scene 1: Cancel Booking (happy path)

The Fan changes their mind.

| Moment | Type | What Happens |
|--------|------|-------------|
| View My Bookings | Query | Fan sees their bookings with status badges |
| Cancel Booking | Command | Fan cancels; system emits BookingCancelled |

**Cancel Booking is an exit point.** The BookingCancelled event triggers the system to check the waitlist. If someone is waiting, the story branches to Scene 2.

### Scene 2: Waitlist Promotion (branches from Cancel Booking react)

The system responds automatically — no human triggers this.

| Moment | Type | What Happens |
|--------|------|-------------|
| Auto Promote Waitlist | React | System checks waitlist, promotes next fan, emits WaitlistPromotionConfirmed |
| Send Confirmation Email | Command (no UI) | System sends confirmation to promoted fan |

This scene demonstrates the react moment type: when BookingCancelled fires, the system automatically promotes the next waitlisted fan. Pure business logic reacting to events.

---

## Data Completeness Across Narratives

Let's trace the full chain across all three narratives:

1. **Promoter** runs ScheduleShow → **ShowScheduled** *(Narrative 1)*
2. **Promoter** runs PublishShow → **ShowPublished** *(Narrative 1)*
3. **Fan** queries Browse Available Shows → reads ShowPublished + ShowScheduled → **AvailableShowsView** *(Narrative 2, Scene 1)*
4. **Fan** runs BookTickets → **TicketsReserved** *(Narrative 2, Scene 1)* — or branches to Scene 2 → **AddedToWaitlist**
5. **Fan** runs CancelBooking → **BookingCancelled** *(Narrative 3, Scene 1)*
6. **System** reacts to BookingCancelled → checks **WaitlistPosition** → **WaitlistPromotionConfirmed** → **ConfirmationEmailSent** *(Narrative 3, Scene 2)*

Every state shown on screen traces back to events. Every event traces back to commands. The chain crosses narrative boundaries but remains complete. Data completeness doesn't stop at the edge of a narrative — it spans the entire model.

## Branching in Action

The concert booking platform has two branch points:

| Exit Moment | From | To | Condition |
|-------------|------|-----|-----------|
| Book Tickets | Getting Tickets, Scene 1 | Getting Tickets, Scene 2 | Show sold out |
| Cancel Booking | Managing Your Booking, Scene 1 | Managing Your Booking, Scene 2 | Waitlist has entries |

On the visual canvas, these appear as connecting lines between moments and scene cards. In the code view, they're expressed as exit points on moments with references to target scenes.

## The Three Views

### Visual View

<!-- Screenshot: visual canvas showing three narrative cards with branching scene connections -->

On the canvas, you see three narrative cards — "Listing a Show," "Getting Tickets," and "Managing Your Booking." Each has its storyboard image. Scene cards branch from each narrative, with filmstrip moments inside. Branch lines connect the Book Tickets moment to the Sold Out scene, and the Cancel Booking moment to the Waitlist Promotion scene.

### Document View

<!-- Screenshot: document view showing Browse and Book scene with moments -->

In the document editor, each scene is its own page. "Browse and Book" shows the scene heading, then each moment as a structured block. Expand a moment to see its interaction specs and business specs. Branch points are marked with callouts linking to the target scene.

### Code View

<!-- Screenshot: code view showing TypeScript DSL -->

In the code editor, the same model appears as TypeScript:

```typescript
narrative('Listing a Show', () => {
  scene('Schedule and Publish', () => {
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
              .when<ScheduleShow>({
                title: 'Neon Drift Live',
                dateTime: new Date('2024-04-15T19:30:00Z'),
                venue: 'The Roundhouse',
                tickets: 500,
                description: 'An evening of electronic beats and live visuals',
              })
              .then<ShowScheduled>({
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
  scene('Browse and Book', () => {
    // ... Browse Available Shows, Book Tickets (with exit point), Booking Confirmed
  });

  scene('Sold Out — Join Waitlist', { branchesFrom: 'Book Tickets' }, () => {
    // ... Book Tickets (sold out), Waitlist Confirmation
  });
});
```

All three views show the same model. Edit one, the others update.

## Try It Yourself

1. **[Join the Auto waitlist](https://on.auto)** to build this on the platform
2. **[Clone Auto Engineer](https://github.com/BeOnAuto/auto-engineer)** to run it locally
3. **[Join the Discord](https://discord.com/invite/B8BKcKMRm8)** to discuss with the community

---

**[Your First Narrative →](/guides/first-narrative)** · **[Structuring Narratives →](/guides/structuring-narratives)** · **[Moment Types Reference →](/reference/moment-types)** · **[Data Completeness →](/explanation/data-completeness)**

---

*A [spec dialect](https://specdriven.com/dialects/narrative-driven) by the [Auto](https://on.auto) team.*

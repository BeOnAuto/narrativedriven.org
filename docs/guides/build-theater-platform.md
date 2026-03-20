---
title: "Build the Theater Booking Platform"
prev:
  text: Your First Narrative in 10 Minutes
  link: /guides/first-narrative
---

# Build the Theater Booking Platform

This is the canonical NDD example. We'll model a theater booking platform with three narratives, multiple scenes, all four moment types, and full data completeness. You'll see the model in all three views: visual, document, and code.

## The Application

A theater booking platform where producers schedule and publish shows, patrons browse and book seats, and the system manages capacity and waitlists automatically. Two actors: Producer and Patron.

## The Narratives

Our theater booking platform tells three stories:

**"Theater Booking"** is the overarching narrative. Within it, three scenes play out:

### Scene 1: Schedule and Publish Show

The Producer's journey from blank form to live listing.

| Moment | Type | What Happens |
|--------|------|-------------|
| Schedule Show | Command | Producer fills in show details, system records ShowScheduled |
| Preview Draft Show | Query | Producer sees show card with draft details |
| Publish Show | Command | Producer publishes; system emits ShowPublished or PublishRejected |

This scene introduces the core data that everything else depends on. ShowScheduled and ShowPublished are the foundation events that downstream scenes reference.

### Scene 2: Browse and Book Seats

The Patron's journey from browsing to confirmation.

| Moment | Type | What Happens |
|--------|------|-------------|
| Browse Available Shows | Query | Patron views grid of published shows with remaining seats |
| Book Seats | Command | Patron books seats; system confirms or adds to waitlist based on capacity |
| Show Details with Availability | Query | Patron views full show details with seat availability |

Note the data completeness: Browse Available Shows shows AvailableShowsView, which is built from ShowPublished and ShowScheduled events. Those events came from Scene 1. The chain is unbroken.

### Scene 3: Manage Bookings and Waitlist Promotion

What happens when things change.

| Moment | Type | What Happens |
|--------|------|-------------|
| View My Bookings | Query | Patron sees their bookings with status badges |
| Cancel Booking | Command | Patron cancels; system emits BookingCancelled |
| Auto Promote Waitlist | React | System automatically promotes next waitlisted patron when a seat opens |
| Send Confirmation Email | Command (no UI) | System sends confirmation to promoted patron |
| Send Promotion Notification | Command (no UI) | System notifies promoted patron |
| Promote From Waitlist | Command (no UI) | System confirms the waitlist promotion |

This scene demonstrates the react moment type: when BookingCancelled fires, the system automatically checks the waitlist and promotes the next person. No human triggers this. It's pure business logic reacting to events.

## Data Completeness in Action

Let's trace one chain end to end:

1. **Producer** runs ScheduleShow command → system emits **ShowScheduled**
2. **Producer** runs PublishShow command → system emits **ShowPublished**
3. **Patron** queries Browse Available Shows → system reads **ShowPublished** + **ShowScheduled** → renders **AvailableShowsView**
4. **Patron** runs BookSeats command → system emits **SeatsReserved** (or **AddedToWaitlist**)
5. **Patron** runs CancelBooking command → system emits **BookingCancelled**
6. **System** reacts to BookingCancelled → checks **WaitlistPosition** → emits **ConfirmationEmailSent**

Every state shown on screen traces back to events. Every event traces back to commands. The model is data-complete.

## The Three Views

### Visual View

<!-- Screenshot: visual canvas showing Theater Booking narrative with three scene cards -->

On the canvas, you see the "Theater Booking" narrative with its storyboard image. Three scene cards branch from it, each with their own storyboard images and filmstrip of moment wireframes.

### Document View

<!-- Screenshot: document view showing Schedule and Publish Show scene -->

In the document editor, "Schedule and Publish Show" shows as a structured document. The scene heading and description at the top, then each moment as a controlled block. Expand a moment to see its interaction specs and business specs. Add free-form context between moments.

### Code View

<!-- Screenshot: code view showing TypeScript DSL -->

In the code editor, the same model appears as TypeScript:

```typescript
narrative('Schedule and Publish Show', () => {
  command('Schedule Show')
    .client(() => {
      describe('Show scheduling form', () => {
        it('show form with title, date, venue, seats, description fields');
        it('enable submit when required fields complete');
        it('show seat capacity validation numeric only');
      });
    })
    .server(() => {
      specs(() => {
        rule('Draft show scheduling', () => {
          example('Producer schedules a new show')
            .when<ScheduleShow>({
              title: 'Romeo and Juliet',
              dateTime: new Date('2024-04-15T19:30:00Z'),
              venue: 'Grand Theatre',
              seats: 150,
              description: 'Shakespeare\'s timeless love story',
            })
            .then<ShowScheduled>({
              showId: 'shw_123',
              title: 'Romeo and Juliet',
              seats: 150,
            });
        });
      });
    });

  // ... more moments
});
```

All three views show the same model. Edit one, the others update.

## Try It Yourself

1. **[Join the Auto waitlist](https://on.auto)** to build this on the platform
2. **[Clone Auto Engineer](https://github.com/BeOnAuto/auto-engineer)** to run it locally
3. **[Join the Discord](https://discord.com/invite/B8BKcKMRm8)** to discuss with the community

---

**[Your First Narrative →](/guides/first-narrative)** · **[Moment Types Reference →](/reference/moment-types)** · **[Data Completeness →](/explanation/data-completeness)**

---

*A [spec dialect](https://specdriven.com/dialects/narrative-driven) by the [Auto](https://on.auto) team.*

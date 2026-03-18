---
title: "Build the RSVP Platform"
prev:
  text: Your First Narrative in 10 Minutes
  link: /guides/first-narrative
---

# Build the RSVP Platform

This is the canonical NDD example. We'll model an event RSVP platform with three narratives, multiple scenes, all four moment types, and full data completeness. You'll see the model in all three views: visual, document, and code.

## The Application

An event RSVP platform where organizers create and publish events, attendees browse and RSVP, and the system manages capacity and waitlists automatically. Two actors: Organizer and Attendee.

## The Narratives

Our RSVP platform tells three stories:

**"Event Management"** is the overarching narrative. Within it, three scenes play out:

### Scene 1: Create and Publish Event

The Organizer's journey from blank form to live event.

| Moment | Type | What Happens |
|--------|------|-------------|
| Create Event Draft | Command | Organizer fills in event details, system records EventCreated |
| Preview Draft Event | Query | Organizer sees event card with draft details |
| Publish Event | Command | Organizer publishes; system emits EventPublished or PublishRejected |

This scene introduces the core data that everything else depends on. EventCreated and EventPublished are the foundation events that downstream scenes reference.

### Scene 2: RSVP and Capacity Management

The Attendee's journey from browsing to confirmation.

| Moment | Type | What Happens |
|--------|------|-------------|
| Browse Available Events | Query | Attendee views grid of published events with remaining capacity |
| Submit RSVP | Command | Attendee RSVPs; system confirms or adds to waitlist based on capacity |
| Event Details with Capacity | Query | Attendee views full event details with attendee count |

Note the data completeness: Browse Available Events shows AvailableEventsView, which is built from EventPublished and EventCreated events. Those events came from Scene 1. The chain is unbroken.

### Scene 3: Manage RSVPs and Waitlist Promotion

What happens when things change.

| Moment | Type | What Happens |
|--------|------|-------------|
| View My RSVPs | Query | Attendee sees their RSVPs with status badges |
| Cancel RSVP | Command | Attendee cancels; system emits RSVPCancelled |
| Auto Promote Waitlist | React | System automatically promotes next waitlisted attendee when a spot opens |
| Send Confirmation Email | Command (no UI) | System sends confirmation to promoted attendee |
| Send Promotion Notification | Command (no UI) | System notifies promoted attendee |
| Promote From Waitlist | Command (no UI) | System confirms the waitlist promotion |

This scene demonstrates the react moment type: when RSVPCancelled fires, the system automatically checks the waitlist and promotes the next person. No human triggers this. It's pure business logic reacting to events.

## Data Completeness in Action

Let's trace one chain end to end:

1. **Organizer** runs CreateEvent command → system emits **EventCreated**
2. **Organizer** runs PublishEvent command → system emits **EventPublished**
3. **Attendee** queries Browse Available Events → system reads **EventPublished** + **EventCreated** → renders **AvailableEventsView**
4. **Attendee** runs SubmitRSVP command → system emits **RSVPConfirmed** (or **AddedToWaitlist**)
5. **Attendee** runs CancelRSVP command → system emits **RSVPCancelled**
6. **System** reacts to RSVPCancelled → checks **WaitlistPosition** → emits **ConfirmationEmailSent**

Every state shown on screen traces back to events. Every event traces back to commands. The model is data-complete.

## The Three Views

### Visual View

<!-- Screenshot: visual canvas showing Event Management narrative with three scene cards -->

On the canvas, you see the "Event Management" narrative with its storyboard image. Three scene cards branch from it, each with their own storyboard images and filmstrip of moment wireframes.

### Document View

<!-- Screenshot: document view showing Create and Publish Event scene -->

In the document editor, "Create and Publish Event" shows as a structured document. The scene heading and description at the top, then each moment as a controlled block. Expand a moment to see its interaction specs and business specs. Add free-form context between moments.

### Code View

<!-- Screenshot: code view showing TypeScript DSL -->

In the code editor, the same model appears as TypeScript:

```typescript
narrative('Create and Publish Event', () => {
  command('Create Event Draft')
    .client(() => {
      describe('Event creation form', () => {
        it('show event form with name, date, location, capacity, description fields');
        it('enable submit when required fields complete');
        it('show capacity validation numeric only');
      });
    })
    .server(() => {
      specs(() => {
        rule('Draft event creation', () => {
          example('Organizer creates a new event')
            .when<CreateEvent>({
              name: 'Spring Conference',
              dateTime: new Date('2024-04-15T09:00:00Z'),
              location: 'Conference Hall A',
              capacity: 100,
              description: 'Annual tech conference',
            })
            .then<EventCreated>({
              eventId: 'evt_123',
              name: 'Spring Conference',
              capacity: 100,
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

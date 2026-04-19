---
title: Your First Narrative in 10 Minutes
next:
  text: Build the Concert Booking Platform
  link: /guides/build-concert-platform
---

# Your First Narrative in 10 Minutes

In 10 minutes, you'll create a single scene with a few moments and see how NDD captures a complete, verifiable outcome. No tools required for the concepts. To build it for real, you'll use the [Auto platform](https://on.auto).

## Start with a Domain

Every NDD model lives inside a domain — a coherent business capability. For this tutorial, our domain is **Show Listing**: a small slice of a concert booking business where promoters create and publish shows.

Inside that domain, we'll model one narrative: **"Promoter publishes a show."** That narrative groups one scene whose outcome is **"Show published."** Three moments fulfil that outcome.

```
Domain: Show Listing
└── Narrative: Promoter publishes a show
    └── Scene: Show published
        ├── Moment: Schedule Show (command)
        ├── Moment: Preview Draft Show (query)
        └── Moment: Publish Show (command)
```

## Three Moments Toward One Outcome

**Moment 1: Schedule Show** (command)

The promoter fills in a form with the show title, date, venue, and ticket capacity. They submit it. The system records that a show was scheduled.

*Interaction specs:*
```
Show scheduling form
  it should show fields for title, date, venue, tickets, description
  it should enable submit when required fields are complete
```

*Business specs:*
```
Rule: Draft show scheduling
  Example: Promoter schedules a new show
    When ScheduleShow { title: "Neon Drift Live", tickets: 500 }
    Then ShowScheduled { showId: "shw_123", title: "Neon Drift Live", tickets: 500 }
```

**Moment 2: Preview Draft Show** (query)

The promoter sees a preview of their show as fans would see it.

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
    Given ShowScheduled { showId: "shw_123", title: "Neon Drift Live" }
    When GetShowDetails { showId: "shw_123" }
    Then ShowDetails { showId: "shw_123", title: "Neon Drift Live", status: "Draft" }
```

**Moment 3: Publish Show** (command)

The promoter publishes the show, making it visible to fans. This is the moment that *delivers the outcome*.

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

Read the scene aloud: "The promoter schedules a show, previews it, then publishes it."

Does every piece of data trace back? The Preview query shows ShowDetails with status "Draft." That state comes from the ShowScheduled event, which came from the ScheduleShow command in Moment 1. The Publish command checks Show status, which is also derived from ShowScheduled. The chain is complete.

## What You Just Built

One domain. One narrative. One scene with one outcome. Three moments that fulfil it. You've captured UI behaviour (interaction specs), business rules (business specs), the outcome and an edge case (already published), and the data flow (data completeness). That's more than most PRDs manage in three pages.

Notice the "already-published" rejection. That's an edge case within the Publish Show moment. It lives as an additional business spec, not as a separate scene. The promoter sees an error and stays on the same screen. Their journey doesn't change. That's incidental detail, not a separate outcome.

## What About Other Outcomes?

What happens when a fan tries to book tickets and the show is sold out? That's a different outcome — the fan ends up on a waitlist instead of with a confirmed booking. In NDD, that's its own scene ("Fan added to waitlist"), reached by a transition from the same "Book Tickets" moment that delivers "Tickets reserved."

The [Build the Concert Booking Platform](/guides/build-concert-platform) tutorial shows you how, with a full domain, three narratives, multiple scene outcomes, all four moment types, and data completeness that crosses narrative boundaries.

## Structuring Your Own Domains

Not sure when something is a scene vs incidental detail? The [Structuring Domains, Narratives, and Scenes](/guides/structuring-narratives) guide gives you the outcome-based rubric for deciding.

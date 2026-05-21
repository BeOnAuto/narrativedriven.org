---
title: Your First Narrative in 10 Minutes
next:
  text: Build the Concert Booking Platform
  link: /guides/build-concert-platform
---

# Your First Narrative in 10 Minutes

![Speech bubble with a lightbulb above it, arrow to a small narrative card with a green checkmark](/images/heroes/first-narrative.png){.page-hero}

In 10 minutes, you'll create a single scene with a few moments and see how NDD captures a complete, reviewable outcome. No tools required for the concepts. Use [Auto](https://on.auto) when you want the productized workflow.

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

The promoter fills in a form with the show title, date, venue, and ticket capacity. They submit it. The show now exists as a draft.

*Should statements:*
```
Show scheduling form
  it should show fields for title, date, venue, tickets, description
  it should enable submit when required fields are complete
```

*Business rule and example:*
```
Rule: Draft show scheduling
  Example: Promoter schedules a new show
    When the promoter submits title "Neon Drift Live" with 500 tickets
    Then the show exists as a draft
    And the draft has title "Neon Drift Live"
    And the draft has 500 tickets
```

**Moment 2: Preview Draft Show** (query)

The promoter sees a preview of their show as fans would see it.

*Should statements:*
```
Draft preview display
  it should display show card with all draft details
  it should show edit button linking back to form
  it should show publish button when draft is complete
```

*Business rule and example:*
```
Rule: Draft show preview
  Example: Show details are available after scheduling
    Given the promoter scheduled Neon Drift Live
    When the promoter opens the preview
    Then the preview shows title "Neon Drift Live"
    And the status is "Draft"
```

**Moment 3: Publish Show** (command)

The promoter publishes the show, making it visible to fans. This is the moment that *delivers the outcome*.

*Business rule and example:*
```
Rule: Show publishing
  Example: Draft show publishes successfully
    Given Neon Drift Live is a draft
    When the promoter clicks publish
    Then Neon Drift Live is published
    And fans can see it as bookable

  Example: Already-published show is rejected
    Given Neon Drift Live is already published
    When the promoter clicks publish again
    Then the action is rejected
    And Neon Drift Live remains published
```

## Check Data Completeness

Read the scene aloud: "The promoter schedules a show, previews it, then publishes it."

Does every visible piece of data have an explained source? The preview shows title, venue, date, ticket count, and draft status because the promoter entered those details during scheduling. The publish moment changes the status from draft to published. The story is complete enough for review.

## What You Just Built

One domain. One narrative. One scene with one outcome. Three moments that fulfil it. You've captured UI behavior, business rules, examples, the outcome, an edge case, and the important screen content. That's more than most PRDs manage in three pages.

Notice the "already-published" rejection. That's an edge case within the Publish Show moment. It lives as an additional business spec, not as a separate scene. The promoter sees an error and stays on the same screen. Their journey doesn't change. That's incidental detail, not a separate outcome.

## What About Other Outcomes?

What happens when a fan tries to book tickets and the show is sold out? That's a different outcome — the fan ends up on a waitlist instead of with a confirmed booking. In NDD, that's its own scene ("Fan added to waitlist"), reached by a transition from the same "Book Tickets" moment that delivers "Tickets reserved."

The [Build the Concert Booking Platform](/guides/build-concert-platform) tutorial shows you how, with a full domain, three narratives, multiple scene outcomes, all four moment types, and data completeness that crosses narrative boundaries.

## Structuring Your Own Domains

Not sure when something is a scene vs incidental detail? The [Structuring Domains, Narratives, and Scenes](/guides/structuring-narratives) guide gives you the outcome-based rubric for deciding.

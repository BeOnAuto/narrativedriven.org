---
title: Data Completeness
next:
  text: Cohesion
  link: /explanation/cohesion
---

# Data Completeness

![Command to event to state to screen as an unbroken chain](/images/heroes/data-completeness.png){.page-hero}

Data completeness is a review principle in NDD:

> If the product shows data, the narrative should explain where that data comes from.

That is the idea. It keeps reviewers from accepting screens that look plausible but contain fields nobody has actually accounted for.

## The principle

When a moment displays information, ask what product fact makes that information true.

If a booking screen shows a status, the narrative should explain what created or changed that status.

If a dashboard shows revenue, the narrative should explain the source of that revenue number.

If a list shows available shows, the narrative should explain what makes a show available.

The goal is not to publish an implementation design. The goal is to make sure product intent is complete enough that teams can review it before build.

## What it catches

**Phantom data**

A dashboard includes "total revenue," but nobody has agreed what counts as revenue. Gross sales? Net sales? Paid invoices? Booked orders? Data completeness turns that hidden question into an explicit product decision.

**Impossible fields**

A screen shows a "booking reference," but the narrative never says when a booking reference is created. Reviewers can catch the missing product fact before implementation.

**Conflicting meanings**

Two scenes use "active customer" differently. Data completeness forces the team to name the source and meaning of the visible information.

## In practice

A query moment can stay plain-language:

```text
Moment: Browse Available Shows
Type: Query

The fan sees published shows with title, venue, date, and remaining ticket count.

What the product shows:
- Shows appear here only after a promoter publishes them.
- Remaining ticket count reflects reservations already made.
- Sold-out shows move to the sold-out state instead of appearing as bookable.
```

That is enough for NDD. It tells reviewers what the screen content means.

## Review questions

At every read-heavy moment, ask:

1. What information is visible?
2. What product fact makes that information true?
3. Where did that product fact enter the story?
4. Does the team agree on the meaning of each field?
5. Is anything visible that the narrative has not explained?

If the answer is unclear, the narrative is not ready.

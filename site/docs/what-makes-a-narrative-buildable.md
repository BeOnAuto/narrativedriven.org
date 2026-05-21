---
title: What Makes a Narrative Buildable?
prev:
  text: What Is NDD?
  link: /what-is-ndd
next:
  text: How it Works
  link: /how-it-works
---

# What Makes a Narrative Buildable?

![Vague prompt versus a structured buildable narrative with actors, outcomes, slices, rules, examples](/images/heroes/what-makes-a-narrative-buildable.png){.page-hero}

A narrative is buildable when it makes the important product decisions explicit before implementation.

A vague prompt says:

> Build me a timesheet app.

A buildable narrative says:

- who uses it
- what they are trying to achieve
- what outcomes matter
- what moments happen
- what rules apply
- what examples prove the rules
- what individual components should do
- what screen content means
- how important outcomes relate to each other

That is the difference between prompt soup and structured intent.

## It starts with a goal

A buildable narrative begins with what someone is trying to achieve.

Not a feature list. Not a collection of screens. A goal.

Examples:

- A fan gets tickets
- A submitter files a timesheet
- A controller validates team entries
- A promoter publishes a show

The goal gives the app direction.

## It breaks the goal into outcomes

Goals are too large to build directly.

NDD breaks a goal into outcomes.

Examples:

- Timesheet submitted
- Entry validated
- Booking cancelled
- Show published
- Fan added to waitlist

An outcome is something that becomes true.

This matters because vague features sprawl. Outcomes can be reviewed, implemented, and verified.

## It shows the moments

Each outcome is achieved through behavior slices.

In NDD, these slices are called moments.

A moment might be:

- a user filling in a form
- a user viewing available data
- the system responding automatically
- the interface guiding the user from one place to another

A good narrative does not just say the outcome. It shows the path.

## It captures the rules

Serious apps have rules.

Examples:

- A submitted timesheet cannot be edited unless reopened.
- A controller can validate entries individually.
- Tickets cannot be reserved when capacity is exhausted.
- A user cannot approve their own request.
- A booking cancellation may trigger waitlist promotion.

If those rules stay hidden in chat, they get rediscovered late.

NDD makes the rules explicit before the code is written.

## It proves rules with examples

Rules are not enough.

Every important rule needs examples that prove the behavior.

Example:

```text
Given a show has 1 ticket remaining
When a fan books 2 tickets
Then the booking is rejected
And no tickets are reserved
```

This is where NDD carries forward the strongest idea from BDD and Specification by Example.

The example turns prose into something inspectable.

## It captures component behavior

Business rules describe what must be true at the product level. They do not describe every interaction detail.

A submit button should be disabled when the form is invalid. A list view should show an empty state when there are no entries. A service should reject an invalid request. These are should statements: what UI elements, services, and lower-level parts do and do not do.

```text
describe SubmitTimesheet button
  it should be disabled when no team is selected
  it should be disabled when required hours are missing
  it should show validation feedback inline
  it should not allow double-submission
```

Business rules say what behavior is required. Should statements say how parts should behave.

## It explains screen content

A buildable narrative explains what screen content means.

If a screen shows a booking status, the narrative should say what product situation creates that status.

If a dashboard shows revenue, the narrative should say what counts as revenue.

If a list shows available shows, the narrative should say what makes a show available.

This prevents phantom data: fields that appear in the UI but have no agreed source or meaning.

## It connects outcomes

A buildable narrative is not just a list.

Scenes can lead to other scenes. A booking cancellation can create the conditions for a waitlist promotion. A sold-out booking attempt can lead the fan to a waitlist outcome instead of a ticket outcome.

Those relationships matter because they show the product story across time.

## It makes screens reviewable without making screens the model

Screens and wireframes are how people inspect the narrative visually.

They are not the structure itself.

The structure is:

```text
Narrative -> Scene -> Moment -> Rule -> Example
```

Screens help humans review the slices. The narrative keeps the product intent stable.

## It gives humans something to review

A buildable narrative lets humans catch problems before the code exists:

- missing outcomes
- broken flows
- vague rules
- impossible states
- unexplained data
- unhandled branches
- inconsistent terms
- incorrect assumptions

The earlier those problems surface, the cheaper they are to fix.

## It stays alive

The narrative is not disposable scaffolding.

When the app changes, the narrative should change with it:

- new behavior becomes new moments
- new rules get examples
- new components get should statements
- new screens connect to outcomes
- new data gets explained
- new integrations become explicit in product language
- new relationships between scenes become visible

The narrative remains the thing humans review before implementation.

## The test

A narrative is buildable when you can answer these questions:

1. What is the goal?
2. What outcomes make the goal true?
3. What moments achieve each outcome?
4. What rules apply?
5. What examples prove the rules?
6. What do the individual components do and not do?
7. What data appears, and what does it mean?
8. How do moments and scenes relate to each other?
9. What should be built first?
10. What can wait until later?

Once you can answer those questions, you have a buildable narrative.

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

A narrative is buildable when it gives a coding agent enough explicit structure to build from without guessing the important parts.

A vague prompt says:

> Build me a timesheet app.

A buildable narrative says:

- who uses it
- what they are trying to achieve
- what outcomes matter
- what steps happen
- what rules apply
- what examples prove the behavior
- what data appears
- where the data comes from
- what changes when actions happen

That is the difference between prompt soup and structured intent.

## It starts with a goal

A buildable narrative begins with what someone is trying to achieve.

Not a feature list.

Not a collection of screens.

A goal.

Examples:

- A fan gets tickets
- A submitter files a timesheet
- A controller validates team entries
- A promoter publishes a show
- A manager reviews exceptions

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

This matters because coding agents need boundaries. A vague feature can sprawl. An outcome can be reviewed, implemented, and verified.

## It shows the steps

Each outcome is achieved through steps.

In NDD, these steps are called moments.

A moment might be:

- a user filling in a form
- a user viewing available data
- the system reacting to an event
- the interface guiding the user from one state to another

A good narrative does not just say the outcome. It shows the path.

## It captures the rules

Serious apps have rules.

Examples:

- A submitted timesheet cannot be edited unless reopened.
- A controller can validate entries individually.
- Tickets cannot be reserved when capacity is exhausted.
- A user cannot approve their own request.
- A booking cancellation may trigger waitlist promotion.

If those rules stay hidden in chat, the coding agent will invent them.

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

The example turns prose into something inspectable and testable.

## It tracks the data

A buildable narrative shows what data exists and where it comes from.

If a screen shows a booking status, the narrative should know what created that status.

If a dashboard shows revenue, the narrative should know what events or integrations produce the number.

If a query returns a list, the narrative should know what state or source feeds it.

This prevents phantom data: fields that appear in the UI but have no specified origin.

## It makes screens reviewable without making screens the model

Screens and wireframes are how people inspect the narrative visually.

They are not the structure itself.

The structure is:

```text
Goal → Outcome → Step → Rule → Example → Data
```

Screens help humans review the steps. Specs help agents build them.

Both are views into the same narrative.

## It gives agents a build plan

A coding agent performs better when it has explicit boundaries.

A buildable narrative tells the agent:

- what to build now
- what context matters
- what rules must hold
- what examples should pass
- what data is needed
- what can be ignored for this task

That is progressive disclosure.

The agent does not need the whole app in every prompt. It needs the right slice.

## It gives humans something to review

A buildable narrative is not just for the agent.

It lets humans catch problems before the code exists:

- missing outcomes
- broken flows
- vague rules
- impossible states
- missing data
- unhandled branches
- incorrect assumptions

The earlier those problems surface, the cheaper they are to fix.

## It stays alive

The narrative is not disposable scaffolding.

Today, the narrative is the starting point your coding agent builds from.

The direction NDD points toward is a closed loop where narrative, code, and tests evolve together.

When the app changes, the narrative should change with it:

- new behavior becomes new moments
- new rules get examples
- new screens connect to outcomes
- new data gets traced
- new integrations become explicit

The narrative remains the thing humans review and agents build from.

## The test

A narrative is buildable when you can answer these questions:

1. What is the goal?
2. What outcomes make the goal true?
3. What steps achieve each outcome?
4. What rules apply?
5. What examples prove the rules?
6. What data appears?
7. Where does that data come from?
8. What should the coding agent build first?
9. What can be safely ignored until later?

If you cannot answer those questions, you do not have a buildable narrative yet.

You have a prompt.

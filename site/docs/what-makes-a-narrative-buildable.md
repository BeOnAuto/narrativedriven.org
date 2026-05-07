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

A narrative is buildable when it gives a coding agent enough explicit structure to build from without guessing the important parts.

A vague prompt says:

> Build me a timesheet app.

A buildable narrative says:

- who uses it
- what they are trying to achieve
- what outcomes matter
- what slices happen
- what rules apply at the business level
- what examples prove the rules
- what individual components do and do not do
- what data appears and where it comes from
- how the moments connect to each other

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

This matters because coding agents need boundaries. A vague feature can sprawl. An outcome can be reviewed, implemented, and verified.

## It shows the slices

Each outcome is achieved through slices.

In NDD, these slices are called moments.

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

## It captures component behavior

Business rules describe what must be true at the system level. They do not describe what individual components do.

A submit button should be disabled when the form is invalid. A validation function should reject negative numbers. A list view should show an empty state when there are no entries. A service endpoint should return a specific shape on success and another on failure.

These are component specs: what UI elements, services, and lower-level modules do and do not do. They live inside moments alongside business rules, captured in describe/it/should form.

```text
describe SubmitTimesheet button
  it should be disabled when no team is selected
  it should be disabled when required hours are missing
  it should show validation feedback inline
  it should not allow double-submission
```

Business rules tell the agent what behavior is required. Component specs tell the agent how the parts behave. Both belong in a buildable narrative.

## It tracks the data

A buildable narrative shows what data exists and where it comes from.

If a screen shows a booking status, the narrative should know what created that status.

If a dashboard shows revenue, the narrative should know what events or integrations produce the number.

If a query returns a list, the narrative should know what state or source feeds it.

This prevents phantom data: fields that appear in the UI but have no specified origin.

## It connects across the narrative

A buildable narrative is not a tree of separate items. It is a graph.

Scenes connect to other scenes. A booking cancellation in one scene produces an event a waitlist react moment in another scene consumes. The two scenes share a real cause-and-effect chain that the narrative makes explicit.

Data flows the same way. A command in one moment produces state. A query in another moment reads it. A screen in a third moment displays it. Every visible field traces back through this chain.

Story mapping gives you the tree of journeys, scenes, and slices. NDD adds the graph: the cross-references between moments, the events that travel across scenes, the data that flows through the structure.

This is where vibe-coded apps fall apart. They look right scene by scene. The connections get invented at code-time, not specified upfront. By the time the inconsistencies surface, the app is brittle.

(For the longer treatment, see [Cohesion](/explanation/cohesion).)

## It makes screens reviewable without making screens the model

Screens and wireframes are how people inspect the narrative visually.

They are not the structure itself.

The structure is:

```text
Narrative → Scene → Moment → Rule → Example → Data → Connection
```

Screens help humans review the slices. Specs help agents build them.

Both are views into the same narrative.

## It gives agents a build plan

A coding agent performs better when it has explicit boundaries.

A buildable narrative tells the agent:

- what to build now
- what context matters
- what rules must hold
- what examples should pass
- what components must behave a specific way
- what data is needed
- which other moments this one depends on
- what can be ignored for this task

That is progressive disclosure.

The agent does not need the whole app in every prompt. It needs the right slice with the right cross-references.

## It gives humans something to review

A buildable narrative is not just for the agent.

It lets humans catch problems before the code exists:

- missing outcomes
- broken flows
- vague rules
- impossible states
- missing data
- unhandled branches
- broken cross-references between scenes
- incorrect assumptions

The earlier those problems surface, the cheaper they are to fix.

## It stays alive

The narrative is not disposable scaffolding.

Today, the narrative is the starting point your coding agent builds from.

The direction NDD points toward is a closed loop where narrative, code, and tests evolve together.

When the app changes, the narrative should change with it:

- new behavior becomes new moments
- new rules get examples
- new components get specs
- new screens connect to outcomes
- new data gets traced
- new integrations become explicit
- new connections between scenes become explicit references

The narrative remains the thing humans review and agents build from.

## The test

A narrative is buildable when you can answer these questions:

1. What is the goal?
2. What outcomes make the goal true?
3. What slices achieve each outcome?
4. What rules apply?
5. What examples prove the rules?
6. What do the individual components do and not do?
7. What data appears, and where does it come from?
8. How do moments and scenes connect to each other?
9. What should the coding agent build first?
10. What can be safely ignored until later?

Once you can answer those questions (often with the help of AI), you have a buildable narrative.

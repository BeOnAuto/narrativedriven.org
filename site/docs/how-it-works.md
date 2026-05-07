---
title: How it Works
prev:
  text: What Makes a Narrative Buildable?
  link: /what-makes-a-narrative-buildable
next:
  text: For Practitioners
  link: /for-practitioners
---

# How NDD Works

![Prompt to narrative to coding agent to running app](/images/heroes/how-it-works.png){.page-hero}

NDD turns a rough app idea into a buildable narrative, then uses that narrative to guide implementation.

The path is simple:

```text
Prompt
↓ Buildable narrative
↓ Review
↓ Drill down
↓ Coding agent
↓ App
↓ Narrative stays alive
```

## 1. Start with a prompt

Start with the app idea in plain language.

Example:

```text
A concert booking app where promoters publish shows
and fans reserve tickets. If a show sells out, fans can
join a waitlist. If someone cancels, the next fan is promoted.
```

The prompt is not the spec. The prompt is the seed.

## 2. Extract the goals

NDD identifies what people are trying to achieve.

For the concert booking app, goals might be:

- A promoter publishes a show
- A fan gets tickets
- A fan waits for a sold-out show
- A promoter cancels a show

These become narratives.

## 3. Break goals into outcomes

Each goal breaks into outcomes.

For "A fan gets tickets," outcomes might be:

- Tickets reserved
- Booking blocked because show is sold out
- Booking cancelled
- Fan added to waitlist

These become scenes.

Outcomes matter because they create clean build boundaries.

## 4. Break outcomes into slices

Each outcome breaks into slices.

For "Tickets reserved," slices might be:

- Browse published shows [Query]
- View show details [Query]
- Reserve tickets [Command]
- Confirm reservation [Experience]
- System reduces capacity [React]

These become moments.

Moments are where the narrative becomes concrete.

## 5. Add rules and examples

Rules describe what must be true. Examples prove those rules.

```text
Rule: Tickets cannot be reserved beyond capacity.

Given a show has 1 ticket remaining
When a fan books 2 tickets
Then the booking is rejected
And no tickets are reserved
```

In the typed DSL the same example lives inside a moment's specs block. See the [DSL reference](/reference/dsl).

This is where the narrative stops being a story and starts becoming executable specification.

## 6. Add component specs

Business rules describe system behavior. Component specs describe how the parts behave.

```text
describe ReserveTickets button
  it should be disabled when capacity is zero
  it should show remaining-ticket count next to the action
  it should not allow a quantity above capacity

describe AvailableShows query
  it should return only Published shows
  it should exclude shows that have started
  it should order by show date ascending
```

Both forms render from the same DSL. See the [DSL reference](/reference/dsl).

Both kinds of spec live inside moments.

## 7. Add data and connect the moments

The narrative tracks the data the app depends on. For concert booking:

- Show
- Booking
- Waitlist Entry
- Capacity
- Status

It also tracks where data comes from and what changes it. The booking status field is set by the ReserveTickets command. The capacity decrement happens through the React moment that fires after reservation.

This is also where moments connect across scenes. The CancelBooking command in the "Booking cancelled" scene produces an event the React moment in the "Fan added to waitlist" scene consumes. The link is explicit, not implied.

These cross-references are the cohesion that makes the narrative coherent. (See [Cohesion](/explanation/cohesion).)

## 8. Review through screens and wireframes

Screens make the narrative visible.

A moment can include desktop and mobile wireframes so humans can see how the slice feels.

But the screen is not the whole spec. Behind the screen are the rules, examples, component specs, requests, responses, state, and system behavior.

## 9. Drill down only when needed

NDD does not force every user into full manual control.

Start with goals, outcomes, and slices.

Drill into wireframes, component specs, business rules, commands, queries, events, state, integrations, auth, and data syncs only when the app demands the precision.

The method reveals complexity as the app requires it.

## 10. Give the narrative to a coding agent

The coding agent should not build from a vague prompt.

It should build from the narrative slice that matters:

- the domain context
- the current goal
- the outcome under work
- the moments involved
- the rules and examples
- the component specs
- the data dependencies
- the cross-references to other scenes

That gives the agent a coherent build target.

## 11. Keep the narrative alive

The narrative should not disappear after the first generation.

When the app changes, the narrative changes with it.

Today, the narrative gives your coding agent a coherent starting point.

The direction NDD points toward is a closed loop where narrative, code, and tests evolve together. That is the long-term shape: not prompts creating code, but narratives guiding software as it changes.

## How Auto fits

Auto applies NDD to your prompt and produces the buildable narrative for you. You can practice NDD by hand. Auto does the structural work.

[Try NDD in Auto →](https://on.auto)

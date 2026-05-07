---
title: For Practitioners
prev:
  text: How it Works
  link: /how-it-works
next:
  text: Build the Concert Booking Platform
  link: /guides/build-concert-platform
---

# For Practitioners

![Browser with narrative document and code-bracket card alongside a SPEC card](/images/heroes/for-practitioners.png){.page-hero}

NDD is what happens when BDD, DDD, EventStorming, and story mapping are rebuilt around AI agents instead of human handoffs.

Those methods each solved part of the problem:

- BDD and Specification by Example captured behavior through concrete examples.
- TDD captured component-level behavior through describe/it/should specs.
- DDD captured domain language and boundaries.
- EventStorming captured commands, events, and flow.
- Story mapping captured journeys.

NDD unifies those parts into one buildable narrative.

## The shift

Older methods were built for human handoff.

They assumed:

- a workshop produces artifacts
- artifacts are translated into tickets
- tickets are translated into code
- tests are written separately
- docs drift unless someone maintains them
- context is carried by people

That world still exists.

But AI changes the pressure.

A coding agent needs structured intent, not a pile of documents. It needs the right slice of context, concrete examples, component specs, data dependencies, and clear cross-references to the rest of the model.

NDD is built for that reader.

## What NDD adds

NDD does not discard the older methods.

It composes them.

| Prior practice | What it contributes | How NDD uses it |
|---|---|---|
| BDD and Specification by Example | Behavior captured through concrete examples | Business rules with Given/When/Then examples inside moments |
| TDD and component-level specs | What components, services, and modules do and do not do | describe/it/should specs alongside business rules |
| DDD | Domain language and boundaries | Domain as the top-level capability model |
| EventStorming | Commands, events, flow | Data completeness and system behavior |
| CQRS and Event Sourcing | Commands, events, state | Specification-level data tracing |
| Story Mapping | Journey structure | Goals, outcomes, and slices |

The difference is not the ingredients. The difference is the unification.

For the deeper lineage, see [Standing on Shoulders](/explanation/standing-on-shoulders).

## Why not just compose what you already use?

This is the obvious objection. If you already practice BDD with your team, run EventStorming workshops, maintain a domain glossary, and write executable specifications, the value of a new method is fair to question.

The honest answer is that those methods were not designed for the same reader.

When the reader was a developer, fragmentation was tolerable. The developer carried context across artifacts. They reconciled the domain glossary with the BDD scenarios with the event model with the screens. That reconciliation work was part of the job.

A coding agent does not do that reconciliation. It builds from what is in front of it. If the domain language is in one place, the rules in another, the events in a third, and the UI specs in a fourth, the agent will not unify them. It will guess.

NDD holds them together as one structure so the agent does not have to.

The same shift matters for the team. When the artifact is unified, the review surface is unified. Product, design, QA, and engineering can review the same narrative without translating across separate documents that drift the moment the workshop ends.

You can compose the methods yourself. You can keep doing that. NDD is what it looks like when the composition becomes the artifact.

## Cohesion is the spine

The hierarchy (Domain → Narrative → Scene → Moment) is the visible structure. The graph beneath it is what makes the model coherent.

Moments cross-reference moments. Scenes connect through events. Data flows from commands through state to queries to screens. A change in one part of the narrative propagates through the references that depend on it.

This is what most spec methods do not capture. EventStorming gets the events. DDD gets the domain. BDD gets the behavior. None of them encode the cross-references between scenes as first-class structure that an agent can reason about.

NDD does. (See [Cohesion](/explanation/cohesion) for the longer treatment.)

## One artifact, not a handoff chain

NDD aims to hold intent, UI, behavior, examples, component specs, and data together.

That means the same narrative can serve multiple readers:

- product reviews the goal and outcome
- design reviews the screen and interaction
- QA reviews the examples and component specs
- engineering reviews the commands, events, state, and connections
- the coding agent builds from the relevant slice

The narrative becomes the coordination surface.

## Executable behavior

Rules should not remain prose.

NDD carries behavior through examples.

```text
Given a timesheet entry is Submitted
When a submitter edits the hours
Then the edit is rejected
And the entry remains Submitted
```

In the typed DSL, the same example sits inside a moment's specs block. See the [DSL reference](/reference/dsl) for the full form.

This lets behavior become inspectable, testable, and useful to agents.

## Component-level specifications

Behavior at the system level is not enough.

NDD captures what the parts do too:

```text
describe TimesheetSubmit endpoint
  it should reject submission when required days are missing
  it should respond with 400 and a field-level error map
  it should not change entry status on rejection

describe TimesheetForm
  it should disable submit while validation is pending
  it should show inline feedback for missing fields
```

Both forms render from the same DSL. See the [DSL reference](/reference/dsl).

Component specs sit inside the same moment as the business rules. The agent gets both layers in one place.

## Data completeness

NDD also asks where visible data comes from.

If a view displays a field, the narrative should trace that field back to its source:

```text
Command → Event → State → Query → Screen
```

This catches phantom data before implementation.

## Progressive context for agents

A coding agent should not receive the whole app every time.

It should receive:

- the domain language
- the goal under work
- the outcome under work
- the moments involved
- the rules and examples
- the component specs
- the relevant data chain
- the cross-references to other scenes

That is progressive disclosure applied to specifications.

## Progressive control for humans

A practitioner can work at whatever depth is needed.

Start with:

```text
Domain → Narrative → Scene → Moment
```

Then drill into:

```text
Moment type
Component specs
Business rules
Examples
Commands
Queries
Events
State
Integrations
Auth
Data flows
Cross-references
```

The method is not lightweight because it lacks depth. It is lightweight because depth is optional until it matters.

## NDD and Auto

NDD can be practiced by hand. Auto applies the method as a product, generating a buildable narrative from a prompt and giving your coding agent structured intent to build from. The long-term direction is a closed loop where narrative, implementation, and tests evolve together.

To see the method on a real app, walk through [Build the Concert Booking Platform](/guides/build-concert-platform).

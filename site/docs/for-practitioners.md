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

NDD is what happens when BDD, DDD, EventStorming, and story mapping are rebuilt around AI-era product work.

Those methods each solved part of the problem:

- BDD and Specification by Example captured behavior through concrete examples.
- TDD captured component-level behavior through describe/it/should specs.
- DDD captured domain language and boundaries.
- EventStorming captured business changes over time.
- Story mapping captured journeys.

NDD unifies those parts into one taxonomy.

## The shift

Older methods were built for human handoff.

They assumed:

- a workshop produces documents
- documents are translated into tickets
- tickets are translated into code
- tests are written separately
- docs drift unless someone maintains them
- context is carried by people

That world still exists.

But AI changes the pressure.

If intent is scattered across chats, tickets, diagrams, and code comments, the implementation will drift. NDD gives the team a shared product story to review before build.

## What NDD adds

NDD does not discard the older methods.

It composes them.

| Prior practice | What it contributes | How NDD uses it |
| --- | --- | --- |
| BDD and Specification by Example | Behavior captured through concrete examples | Business rules with Given/When/Then examples inside moments |
| TDD and component-level specs | What components, services, and modules do and do not do | Should statements alongside business rules |
| DDD | Domain language and boundaries | Domain as the top-level capability |
| EventStorming | Business changes over time | Outcome and reaction thinking |
| Story Mapping | Journey structure | Goals, outcomes, and behavior slices |

The difference is not the ingredients. The difference is the unification.

For the deeper lineage, see [Standing on Shoulders](/explanation/standing-on-shoulders).

## Why not just compose what you already use?

This is the obvious objection. If you already practice BDD with your team, run EventStorming workshops, maintain a domain glossary, and write examples, the value of a new method is fair to question.

The honest answer is that those methods were not designed for the same pressure.

When the reader was a developer, fragmentation was tolerable. The developer carried context across documents. They reconciled the domain glossary with the examples, flow diagrams, and screen designs. That reconciliation work was part of the job.

AI-assisted development makes that fragmentation expensive. If the domain language is in one place, rules in another, and screens in a third, the system will not reliably preserve the intent.

NDD holds the product story together so the team can review it.

## Cohesion is the spine

The hierarchy (Domain -> Narrative -> Scene -> Moment) is the visible structure. Cohesion is what makes it coherent.

Moments should support scenes. Scenes should support narratives. Rules should match the outcomes. Examples should prove the rules. Important screen content should have an explained source.

This is what most spec methods do not capture in one place. EventStorming gets flow. DDD gets language. BDD gets behavior. NDD gives the team a shared frame for all of them.

See [Cohesion](/explanation/cohesion) for the longer treatment.

## One narrative, not a handoff chain

NDD aims to hold intent, UI expectations, behavior, examples, and important screen content together.

That means the same narrative can serve multiple readers:

- product reviews the goal and outcome
- design reviews the screen and interaction
- QA reviews the examples and should statements
- engineering reviews whether the intent is precise enough to implement

The narrative becomes the coordination surface.

## Behavior through examples

Rules should not remain vague prose.

NDD carries behavior through examples.

```text
Given a timesheet entry is Submitted
When a submitter edits the hours
Then the edit is rejected
And the entry remains Submitted
```

This lets behavior become inspectable before implementation.

## Component-level expectations

Behavior at the product level is not enough.

NDD captures what the parts should do too:

```text
describe TimesheetSubmit endpoint
  it should reject submission when required days are missing
  it should respond with a field-level error
  it should not change entry status on rejection

describe TimesheetForm
  it should disable submit while validation is pending
  it should show inline feedback for missing fields
```

Should statements sit near the business rules they support.

## Data completeness

NDD also asks where screen content comes from.

If a view displays a field, the narrative should explain that field's product source:

```text
Booking confirmation screen displays "Booking Reference"
  -> Booking reference is created when the booking is accepted
```

This catches phantom data before implementation.

## Progressive control

A practitioner can work at whatever depth is needed.

Start with:

```text
Domain -> Narrative -> Scene -> Moment
```

Then drill into:

```text
Moment type
Should statements
Business rules
Examples
Screen content
Permissions
Integrations in product language
Open questions
```

The method is not lightweight because it lacks depth. It is lightweight because depth is optional until it matters.

To see the method on a real app, walk through [Build the Concert Booking Platform](/guides/build-concert-platform).

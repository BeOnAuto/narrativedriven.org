---
title: What Is NDD?
next:
  text: What Makes a Narrative Buildable?
  link: /what-makes-a-narrative-buildable
---

# What Is Narrative-Driven Development?

Narrative-Driven Development turns an app idea into a buildable narrative.

Instead of asking an AI to guess its way from prompt to code, NDD pulls the design into the open first: who uses the app, what they are trying to achieve, what outcomes matter, what steps happen, what rules apply, and what data the app depends on.

Under the hood, that narrative is a structured model. To the builder, it is the app story the coding agent can follow.

## The problem NDD solves

Prompting alone leaves too many decisions hidden.

The AI decides:

- what screens should exist
- what rules should apply
- what data should be stored
- what happens when something fails
- what edge cases matter
- how one part of the app connects to another

Those decisions become code before anyone reviews them.

That is how a promising prototype turns into prompt soup.

NDD changes the order. First, make the important decisions visible. Then let the agent build.

## The beginner translation

NDD has canonical terms, but the idea is simple.

| Plain language | NDD term | Meaning |
|---|---|---|
| Capability | Domain | The app or business area |
| Goal | Narrative | The larger thing someone is trying to achieve |
| Outcome | Scene | Something that becomes true |
| Step | Moment | A low-level slice of behavior, UI, rule, or system response |

So the structure is:

```text
Capability
└── Goal
    └── Outcome
        └── Step
```

In NDD language:

```text
Domain
└── Narrative
    └── Scene
        └── Moment
```

Use the plain-language terms first. Learn the canonical terms as you need more control.

## Domain

A domain is the capability area.

Examples:

- Concert Booking
- Timesheet Management
- Identity and Access
- Scheduling
- Billing

The domain holds the shared language: actors, entities, rules, and data concepts that everything else uses.

A domain answers:

> What world does this app live in?

## Narrative

A narrative is a goal inside the domain.

Examples:

- A fan gets tickets
- A controller validates timesheets
- A promoter publishes a show
- A user resets access

A narrative is bigger than one screen and smaller than the whole app. It is the thread that gives the work direction.

A narrative answers:

> What is someone trying to achieve?

## Scene

A scene is an outcome.

Examples:

- Tickets reserved
- Fan added to waitlist
- Timesheet submitted
- Booking cancelled
- Access restored

A scene is something that becomes true. It is independently understandable and independently verifiable.

A scene answers:

> What outcome are we trying to make true?

## Moment

A moment is a step toward the outcome.

A moment can be a user action, a screen interaction, a system reaction, or a data retrieval step.

The four moment types are:

| Moment type | Meaning | Example |
|---|---|---|
| Command | Something changes | Book tickets |
| Query | Something is read | Browse shows |
| React | The system responds automatically | Promote from waitlist |
| Experience | The user moves through the interface | Navigate to dashboard |

A moment answers:

> What happens at this step?

## A moment is more than a screen

Screens matter. They make the narrative reviewable.

But a moment is not only a screen.

A moment can include:

- desktop and mobile wireframes
- client specs
- service specs
- rules
- examples
- commands
- queries
- events
- state
- data sources
- integrations
- syncs
- auth behavior

Beginners do not need to see all of this at once. NDD starts with the story and reveals the controls when the app needs them.

## Rules come with examples

NDD inherits a core idea from BDD and Specification by Example:

> Behavior is not really specified until it has examples.

A rule should not sit alone as vague prose.

A rule should have concrete examples that show:

- given this situation
- when this action happens
- then this outcome should occur

That is what makes the narrative testable.

## What NDD gives your coding agent

A coding agent should not build from a vague prompt and a long chat history.

It should build from explicit intent:

- the goal
- the outcome
- the steps
- the rules
- the examples
- the data
- the UI expectations
- the system behavior

That is what a buildable narrative provides.

## What NDD is not

NDD is not a static requirements document.

NDD is not a prompt template.

NDD is not a design workshop artifact that gets thrown away.

NDD is not a film metaphor pasted onto software.

NDD is a structured way to make software intent visible, reviewable, testable, and useful to coding agents.

## A Spec Dialect by Auto

NDD is a **spec dialect**: a structured, schema-backed specification language built for applications with real users and real stakes. It is part of the [spec-driven development](https://specdriven.com) movement and the first dialect with a model-based architecture, multimodal views, and executable specifications.

NDD is one of the few dialects in the current wave to keep specs executable rather than regressing to prose. The wider [executability gap on the spec-driven landscape](https://specdriven.com/landscape/#the-executability-gap) tracks this directly.

[NDD as a spec dialect →](/explanation/spec-dialect) | [Standing on shoulders →](/explanation/standing-on-shoulders) | [NDD on specdriven.com →](https://specdriven.com/dialects/narrative-driven)

## Where Auto fits

NDD is the method.

Auto is how NDD ships as a product.

Auto applies NDD to your prompt, turns it into a buildable narrative, and helps your coding agent build from structured intent instead of prompt soup.

You can apply NDD by hand. Auto does the structural work for you.

[Try NDD in Auto →](https://on.auto)

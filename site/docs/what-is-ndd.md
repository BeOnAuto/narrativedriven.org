---
title: What Is NDD?
next:
  text: What Makes a Narrative Buildable?
  link: /what-makes-a-narrative-buildable
---

# What Is Narrative-Driven Development?

![Prompt becomes a four-level NDD model (Domain, Narrative, Scene, Moment) becomes a built app](/images/heroes/what-is-ndd.png){.page-hero}

Narrative-Driven Development turns an app idea into a buildable narrative.

Instead of asking an AI to guess its way from prompt to code, NDD pulls the design into the open first: who uses the app, what they are trying to achieve, what outcomes matter, what slices happen, what rules apply, and what data the app depends on.

Under the hood, that narrative is a structured model. To the builder, it is the app story the coding agent can follow.

## The problem NDD solves

![Prompt soup vs buildable narrative](/images/what-is-ndd/prompt-vs-narrative.png){.what-is-ndd-illustration}

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

## The four-level hierarchy

NDD organises every system into four levels. Each one names a different scope of meaning.

| Level | What it is | Example | Answers |
|---|---|---|---|
| **Domain** | The capability area | Concert Booking | What world does this app live in? |
| **Narrative** | A goal inside the domain | A fan gets tickets | What is someone trying to achieve? |
| **Scene** | An outcome (something becomes true) | Tickets reserved | What outcome are we trying to make true? |
| **Moment** | A slice of the outcome | Reserve tickets [Command] | What happens in this slice? |

The hierarchy is the visible structure. The cross-references between moments (events one scene produces and another consumes, data flowing from commands through state to screens) are the cohesion underneath. Both matter.

A moment carries a type. The four moment types are:

| Moment type | Meaning | Example |
|---|---|---|
| **Command** | Something changes | Book tickets |
| **Query** | Something is read | Browse shows |
| **React** | The system responds automatically | Promote from waitlist |
| **Experience** | The user moves through the interface | Navigate to dashboard |

## A moment is more than a screen

Screens matter. They make the narrative reviewable.

But a moment is not only a screen.

![A single moment expanded into its parts](/images/what-is-ndd/moment-expanded.png){.what-is-ndd-illustration}

A moment can include:

- desktop and mobile wireframes
- business rules with examples (Given/When/Then)
- component specs (describe/it/should for UI elements, services, and modules)
- commands, queries, events, and state
- data sources, syncs, and integrations
- auth behavior
- references to other moments and scenes

That last point matters. Moments are not isolated. The cancellation moment in one scene produces an event the waitlist react in another scene consumes. The graph of cross-references between moments is what gives the narrative cohesion. (See [What Makes a Narrative Buildable?](/what-makes-a-narrative-buildable) and [Cohesion](/explanation/cohesion).)

Beginners do not need to see all of this at once. NDD starts with the story and reveals the controls when the app needs them.

## What NDD is not

NDD is not a static requirements document.

NDD is not a prompt template.

NDD is not a design workshop artifact that gets thrown away.

NDD is not a film metaphor pasted onto software.

NDD is a structured way to make software intent visible, reviewable, testable, and useful to coding agents.

## A spec dialect, shipped as a product

NDD is a spec dialect: a structured, schema-backed specification language built for applications with real users and real stakes. It is part of the [spec-driven](https://specdriven.com) movement and one of the few dialects with a model-based architecture, multimodal views, and executable specifications.

You can practice NDD by hand. Auto applies the method as a product, turning a prompt into a buildable narrative and giving your coding agent structured intent to build from.

[Try NDD in Auto →](https://on.auto)

Related: [Standing on Shoulders](/explanation/standing-on-shoulders) | [NDD on specdriven.com](https://specdriven.com/dialects/narrative-driven)

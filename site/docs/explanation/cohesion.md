---
title: Cohesion
prev:
  text: Data Completeness
  link: /explanation/data-completeness
next:
  text: Narrative Review Views
  link: /explanation/one-model-three-views
---

# Cohesion

![Four scene cards connected by criss-crossing arrows showing event and data references](/images/heroes/cohesion.png){.page-hero}

A narrative is cohesive when its parts agree.

The hierarchy (Domain -> Narrative -> Scene -> Moment) gives the visible shape. Cohesion is what keeps that shape from becoming a list of disconnected labels.

## The hierarchy is the visible part

When you first see a narrative, you see a tree:

```text
Concert Booking
├── Listing a Show
│   └── Show published
└── Getting Tickets
    ├── Tickets reserved
    └── Fan added to waitlist
```

That tree is useful. It tells you the capability, the goals, the outcomes, and the behavior slices.

But a tree alone does not prove the product story hangs together.

## Cohesion is the product logic

Cohesion asks whether the concepts line up across the narrative:

- Does the same term mean the same thing everywhere?
- Does each scene support the narrative goal?
- Does each moment move its scene toward the stated outcome?
- Do the rules explain the behavior users will actually experience?
- Do examples cover the cases stakeholders care about?
- Does important screen content have an explained source?
- Do alternative outcomes become their own scenes instead of hidden branches?

For example, if "Tickets reserved" and "Fan added to waitlist" are both possible after a fan tries to book, they should be separate scenes because the fan ends up in meaningfully different states. Cohesion makes that distinction visible.

## What weak cohesion looks like

Weak cohesion usually shows up as small inconsistencies:

- A scene is named after a screen instead of an outcome.
- A rule uses a term the glossary has not defined.
- A field appears in the UI with no agreed product meaning.
- An edge case changes the actor's state but remains buried inside one moment.
- Two moments describe similar behavior in different language.

Each inconsistency is a place where implementation can drift.

## Why cohesion matters

NDD is meant to give humans a shared review surface before build.

Product can check outcomes. Design can check interactions. QA can check examples. Engineering can check whether the behavior is precise enough to implement. Everyone is reviewing the same product story instead of reconciling separate documents.

## What to check

When you review a narrative, look for:

1. Every scene names one outcome.
2. Every moment contributes to its scene.
3. Every rule has at least one concrete example when the behavior matters.
4. Every visible field has an explained product source.
5. Every important alternative outcome is represented explicitly.
6. Shared terms are used consistently across scenes.

If a connection is missing, fix the narrative before implementation.

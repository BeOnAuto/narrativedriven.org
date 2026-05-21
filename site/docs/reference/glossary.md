---
title: Glossary
---

# Glossary

![A glossary card with five entry rows, each with a coloured marker and a term/definition stroke](/images/heroes/glossary.png){.page-hero}

## Domain

The top-level NDD concept.

A domain is a coherent business capability area with shared actors, entities, rules, and language.

## Narrative

A goal thread inside a domain.

A narrative groups related scenes that serve a broader user or business goal.

## Scene

A self-contained outcome achieved through one or more moments.

Scenes are named for what becomes true, not for screens or implementation tasks.

## Moment

A single behavior slice inside a scene.

Moment types are Command, Query, React, and Experience.

## Command

A moment where something changes.

Example:

> Submit timesheet

## Query

A moment where something is read or inspected.

Example:

> View submitted entries

## React

A moment where the system responds automatically.

Example:

> Promote next fan from waitlist

## Experience

A moment where the user moves through the interface.

Example:

> Navigate to dashboard

## Business rule

A statement about behavior at the product or system level that must hold.

Rules should have examples.

## Example

A concrete case that proves a business rule.

Usually shaped as:

```text
Given...
When...
Then...
```

## Should statement

A statement about what an individual UI element, service, or module should or should not do.

Usually shaped as:

```text
describe SubmitButton
  it should be disabled when the form is invalid
  it should not allow double-submission
```

## Interaction rule

A rule about how an actor experiences or uses a moment.

Interaction rules often cover visible states, navigation, disabled controls, empty states, errors, accessibility, and feedback.

## Data completeness

The review principle that important screen content should have an explained source.

If a screen shows a field, the narrative should say where that information comes from in product terms.

## Cohesion

The quality of a narrative whose goals, scenes, moments, rules, examples, and visible information agree with one another.

See [Cohesion](/explanation/cohesion).

## Progressive control

NDD's pattern of starting with the simple taxonomy and revealing deeper product detail only when it helps the team make a better decision.

## Spec dialect

A repeatable language for describing software intent.

NDD is the vocabulary and review method described on this site.

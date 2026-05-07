---
title: Glossary
---

# Glossary

![A glossary card with five entry rows, each with a coloured marker and a term/definition stroke](/images/heroes/glossary.png){.page-hero}

## Buildable narrative

A structured app narrative that a coding agent can build from.

It contains goals, outcomes, slices, business rules, examples, component specs, data, and cross-references between moments.

## Domain

The top-level NDD structure.

A coherent capability area with shared actors, entities, rules, and language.

## Narrative

A goal thread inside a domain.

Contains scenes.

## Scene

A self-contained outcome achieved through one or more moments.

## Moment

A single slice of a scene outcome.

Moment types are Command, Query, React, and Experience.

## Command

A moment where something changes.

Example:

> Submit timesheet

## Query

A moment where something is read.

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

A statement about behavior at the system level that must hold.

Rules should have examples.

## Example

A concrete case that proves a business rule.

Usually shaped as:

```text
Given...
When...
Then...
```

## Component spec

A statement about what an individual UI element, service, or module does and does not do.

Usually shaped as describe/it/should:

```text
describe SubmitButton
  it should be disabled when the form is invalid
  it should not allow double-submission
```

Component specs sit inside moments alongside business rules.

## Cohesion

The cross-references between moments, scenes, events, and data flows that make a narrative coherent.

The graph beneath the Domain → Narrative → Scene → Moment hierarchy.

Three kinds: event cohesion (commands produce events that other scenes consume), data cohesion (visible data traces back to its source), and reference cohesion (moments link to other moments directly).

See [Cohesion](/explanation/cohesion).

## Data completeness

The principle that visible data should trace back to its source.

A specific form of cohesion.

## Prompt soup

A build state where important design decisions are scattered across prompts, chat history, generated code, and undocumented assumptions.

## Progressive control

NDD's pattern of starting simple and revealing deeper controls only when needed.

## Spec dialect

A structured specification language with enough form for tools and agents to process.

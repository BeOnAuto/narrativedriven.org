---
title: Narrative Review Views
prev:
  text: Cohesion
  link: /explanation/cohesion
next:
  text: Progressive Disclosure for Specs
  link: /explanation/progressive-disclosure
---

# Narrative Review Views

![Narrative cards rendered for visual and document review](/images/heroes/one-model-three-views.png){.page-hero}

Different people inspect product intent differently.

NDD gives them a shared vocabulary so those inspections do not drift apart.

## The narrative

At the center is the NDD taxonomy:

- domain
- narrative
- scene
- moment
- moment type
- rule
- example
- should statement

That vocabulary is enough for a team to discuss intent clearly before implementation.

## Visual review

Visual review helps people see the app as a flow through outcomes.

A canvas can show:

- domains
- narrative cards
- scene outcomes
- moments
- rough screens or storyboards
- transitions between meaningful outcomes

This is useful when the question is:

> Does the app make sense as an experience?

## Document review

Document review helps people read the behavior.

A page can show:

- scene descriptions
- moment descriptions
- rules
- examples
- interaction notes
- open questions

This is useful when the question is:

> Is the behavior right?

This is where non-technical review happens. A product manager can follow the moments, check the rules, and inspect examples without reading implementation details.

## Code production

When used with Auto, the reviewed NDD model is used to produce code.

The team still reviews the narrative first: goals, outcomes, moments, rules, examples, and interaction expectations. Auto then uses that reviewed product model inside its workflow to support AI-assisted implementation.

That is why the illustration includes code. Code is an output of the product workflow, not something a reviewer needs to read to understand the narrative.

## Why this matters

Separate documents drift.

A design file says one thing.

A requirements doc says another.

A chat thread says whatever the team last corrected.

NDD reduces drift by giving those conversations the same names for the same ideas. The method is the taxonomy.

## The rule

Views are for review.

The narrative is the shared product story.

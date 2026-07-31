---
title: Progressive Control
prev:
  text: Narrative Review Views
  link: /explanation/one-model-three-views
next:
  text: NDD as a Spec Dialect
  link: /explanation/spec-dialect
---

# Progressive Control

![Layered cards from goal to outcomes to specs, revealing depth](/images/heroes/progressive-control.png){.page-hero}

NDD starts with the story and reveals manual controls as the product demands precision.

The method should not force a beginner to understand every detail before they can model an app. It should also not trap an advanced builder inside vague prose.

Progressive disclosure is about what reviewers see first. Progressive control is about what they can open when they need more precision. In NDD, those are one idea.

## Start in automatic mode

At the first layer, the structure is simple:

```text
Domain -> Narrative -> Scene -> Moment
```

A beginner can review this from the narrative alone.

They can ask:

- Is this the right domain?
- Are these the right narratives?
- Are these the scenes that matter?
- Do these moments make sense?

That is the automatic mode. The model has a shape, but the reviewer is not staring at every rule, data source, permission, and edge case at once.

## Open controls when behavior matters

When a scene becomes important, the builder reviews how the app behaves moment by moment.

A moment might describe:

- the actor
- the user action
- the system response
- the visible state
- the next meaningful outcome

This is where the app becomes concrete.

## Drill into rules and examples

A rule should have examples.

```text
Given this situation
When this action happens
Then this result follows
```

Examples make rules reviewable.

## Add product detail only when it matters

Serious apps depend on detail.

At this layer, NDD captures the product decisions reviewers need:

- important screen content
- interaction rules
- edge cases
- permissions
- integrations in plain language
- workflow reversal
- facts the product must record
- accessibility expectations
- open questions

## The SLR metaphor

The camera metaphor belongs to the broader spec-driven movement, but NDD adds a specific idea:

> Start with the story. Drill down when you need manual controls.

At first, describe the app and review the narrative.

When the app demands more precision, open the controls: rules, examples, access, facts, workflows, and review views.

That is how NDD avoids becoming either prompt chaos or heavyweight methodology.

---
title: Progressive Control
prev:
  text: Progressive Disclosure for Specs
  link: /explanation/progressive-disclosure
next:
  text: Standing on Shoulders
  link: /explanation/standing-on-shoulders
---

# Progressive Control

![Layered cards from goal to outcomes to specs, revealing depth](/images/heroes/progressive-control.png){.page-hero}

NDD starts simple and reveals control as the app gets serious.

That is the point.

The method should not force a beginner to understand every detail before they can model an app. It should also not trap an advanced builder inside vague prose.

## The first layer: the app story

At the first layer, the structure is simple:

```text
Domain -> Narrative -> Scene -> Moment
```

A beginner can review this from the story alone.

They can ask:

- Is this the right domain?
- Are these the right narratives?
- Are these the scenes that matter?
- Do these moments make sense?

## The second layer: moments and interactions

At the next layer, the builder reviews how the app behaves moment by moment.

A moment might describe:

- the actor
- the user action
- the system response
- the visible state
- the next meaningful outcome

This is where the app becomes concrete.

## The third layer: rules and examples

When behavior matters, the builder drills into rules.

A rule should have examples.

```text
Given this situation
When this action happens
Then this result follows
```

Examples make rules reviewable.

## The fourth layer: product detail

Serious apps depend on detail.

At this layer, NDD captures the product facts reviewers need:

- important screen content
- interaction rules
- edge cases
- permissions
- integrations in plain language
- accessibility expectations
- open questions

## Automatic flow and manual controls

The camera metaphor belongs to the broader spec-driven movement, but NDD adds a specific idea:

> Start with the story. Drill down when you need manual controls.

At first, describe the app and review the narrative.

When the app demands more precision, open the controls.

That is how NDD avoids becoming either prompt chaos or heavyweight methodology.

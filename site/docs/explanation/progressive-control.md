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

NDD starts simple and reveals control as the app gets serious.

That is the point.

The method should not force a beginner to understand commands, events, state, auth, integrations, and service specs before they can model an app.

It should also not trap an advanced builder inside a toy abstraction.

NDD supports both.

## The first layer: the app story

At the first layer, the structure is simple:

```text
Domain → Narrative → Scene → Moment
```

A beginner can review this without learning the full dialect.

They can ask:

- Is this the right domain?
- Are these the right narratives?
- Are these the scenes that matter?
- Do these moments make sense?

This is enough to catch many missing pieces before code exists.

## The second layer: screens and moments

At the next layer, the builder reviews how the app behaves moment by moment.

A moment might show:

- a desktop wireframe
- a mobile wireframe
- the user action
- the system response
- the visible state
- the next step

This is where the app becomes concrete.

## The third layer: rules and examples

When behavior matters, the builder drills into rules.

A rule should have examples.

```text
Given this situation
When this action happens
Then this result follows
```

Examples make rules reviewable and testable.

They also give coding agents something precise to build against.

## The fourth layer: data and system behavior

Serious apps depend on data.

At this layer, NDD captures:

- commands
- queries
- events
- state
- projections
- data sources
- data syncs
- integrations
- auth behavior

This is where NDD stops being a storyboarding exercise and becomes a specification dialect.

## Progressive disclosure for agents

Coding agents need the same principle.

Too little context and they invent.

Too much context and they lose focus.

NDD gives the agent the right slice:

```text
Domain context
↓ Current narrative
↓ Current scene
↓ Current moments
↓ Rules and examples
↓ Relevant data chain
```

The hierarchy is not just organization.

It is the loading mechanism.

For the deeper treatment of how this works inside an agent's context window, see [Progressive Disclosure for Specs](/explanation/progressive-disclosure).

## Auto mode and manual controls

The camera metaphor belongs to the broader spec-driven movement, but NDD adds a specific idea:

> Start in Auto mode. Drill down when you need manual controls.

At first, describe the app and review the narrative.

When the app demands more precision, open the controls.

That is how NDD avoids becoming either prompt chaos or heavyweight methodology.

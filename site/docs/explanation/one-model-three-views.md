---
title: One Narrative, Multiple Views
prev:
  text: Data Completeness
  link: /explanation/data-completeness
next:
  text: Progressive Disclosure for Specs
  link: /explanation/progressive-disclosure
---

# One Narrative, Multiple Views

NDD gives different people different ways to inspect the same underlying narrative.

The visual view, document view, and code view should not become separate artifacts.

They are controls over the same structure.

## The narrative

At the center is the buildable narrative:

- goals
- outcomes
- steps
- rules
- examples
- data
- specs
- system behavior

The narrative is the thing being built from. It is a structured model defined by a Zod schema, JSON under the hood, with integrity constraints (like [data completeness](/explanation/data-completeness)). Tools parse, validate, and transform it.

The views are how different people work with it.

## Visual view

The visual view lets people see the app through flow and interaction.

A canvas where the domain holds narrative cards with AI-generated storyboard images. Each scene appears as its outcome, with a filmstrip of moments inside it, each with a wireframe thumbnail. It looks like a storyboard you would find on a design team's wall.

It can show:

- goals
- outcomes
- moments
- wireframes
- desktop and mobile views
- relationships between steps

This is useful when the question is:

> Does the app make sense as an experience?

*Coming soon: expandable event model view with commands (blue), events (orange), and state (green). Figma plugin for bidirectional storyboard sync.*

## Document view

The document view lets people read the behavior.

A Notion-like block editor, one page per scene. Rich text, images, videos, whatever context you need. Moments show up as structured blocks you can expand to see interaction specs and business specs.

It can show:

- scene descriptions
- moment descriptions
- client specs
- service specs
- rules
- examples
- notes and explanations

This is useful when the question is:

> Is the behavior right?

This is where non-technical review happens. A product manager can follow the moments, check the behavior, and inspect the business specs to see what the AI decided about domain logic. No code required.

## Code view

The code view lets practitioners work directly with the structured specification.

A Monaco editor with the TypeScript DSL. Full IntelliSense, type safety, and enough expressiveness for complex domain logic. TypeScript is one interface. The model is JSON underneath, so other language interfaces are possible.

It can show:

- typed DSL
- commands
- queries
- events
- state
- specs
- rules
- examples

This is useful when the question is:

> Can this drive implementation and verification?

## Why this matters

Separate artifacts drift.

A Figma screen says one thing.

A Notion doc says another.

The code says a third.

The chat history says whatever the agent last guessed.

NDD reduces drift by keeping the important decisions in one narrative and letting people inspect that narrative through the view that fits their role. When a designer moves a screen in the visual view, the developer sees the change in code. When a developer adds a business spec, the product manager sees it in the document view. Everyone is looking at the same model.

## Current state and vision

Today, the visual canvas, document editor, and code editor are live on [Auto](https://on.auto). All three read and write the same model. Git sync is configurable.

Coming soon: Figma plugin, visual event model editing, Notion and Google Docs integrations, realtime multi-user collaboration, component-level spec drill-down.

The goal is to meet every team member where they already work, all contributing to one model.

## The rule

The view is not the source of truth.

The narrative is.

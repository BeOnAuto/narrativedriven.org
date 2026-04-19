---
title: One Model, Three Views
prev:
  text: Data Completeness
  link: /explanation/data-completeness
next:
  text: Standing on Shoulders
  link: /explanation/standing-on-shoulders
---

# One Model, Three Views

Most teams store their knowledge in separate artifacts. Requirements in Notion. Designs in Figma. Architecture in diagrams. Code in the repo. They start aligned, then drift apart. After a few weeks, the Notion doc describes a system that no longer exists.

NDD takes a different approach. One model. Three views.

## The Model

At the core of NDD is a structured model defined by a Zod schema. It's JSON under the hood. The top-level model is the domain — capability, actors, entities — and inside it sit narratives, scenes, moments, messages (commands, events, state, queries), data flows, integrations, and design assets.

The model isn't a document. It's a data structure with integrity constraints (like [data completeness](/explanation/data-completeness)). It has a schema that tools can parse, validate, and transform.

## Three Views, One Truth

### For Designers and Product Teams: The Visual View

A canvas where the domain holds narrative cards with AI-generated storyboard images. Each scene appears as its outcome, with a filmstrip of moments inside it, each with a wireframe thumbnail. It looks like a storyboard you'd find on a design team's wall.

*Coming soon: expandable event model view with commands (blue), events (orange), and state (green). Figma plugin for bidirectional storyboard sync.*

### For Product, QA, and Stakeholders: The Document View

A Notion-like block editor, one page per scene. Rich text, images, videos, whatever context you need. Moments show up as structured blocks you can expand to see interaction specs and business specs.

This is where non-technical review happens. A product manager can follow the moments, check the behavior, and inspect the business specs to see what the AI decided about domain logic. No code required.

### For Developers: The Code View

A Monaco editor with the TypeScript DSL. Full IntelliSense, type safety, and enough expressiveness for complex domain logic.

TypeScript is one interface. The model is JSON underneath, so other language interfaces are possible.

## Why This Matters

When a designer moves a screen in the visual view, the developer sees the change in code. When a developer adds a business spec, the product manager sees it in the document view. When a product manager edits a moment's description, it's reflected everywhere.

No handoff. No translation step. No "let me update the spec to match what we actually built." Everyone's looking at the same model.

## Current State and Vision

Today, the visual canvas, document editor, and code editor are live on [Auto](https://on.auto). All three read and write the same model. Git sync is configurable.

Coming soon: Figma plugin, visual event model editing, Notion/Google Docs integrations, realtime multi-user collaboration, component-level spec drill-down.

The goal is to meet every team member where they already work, all contributing to one model.


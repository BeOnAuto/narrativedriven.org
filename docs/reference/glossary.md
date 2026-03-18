---
title: Glossary
---

# Glossary

A complete reference of NDD terminology.

## Core Constructs

### Narrative
The top-level unit. A complete user journey that tells the full story arc of how actors interact with the system to achieve an outcome. Contains one or more scenes. Has a name, description, and storyboard image.

### Scene
A coherent chapter within a narrative. Groups related moments that happen together. Has a name, description, storyboard image, and a sequential list of moments. In the document view, each scene is its own document.

### Moment
A single point in time where something happens. The atomic unit of NDD. One of four types: command, query, react, or experience. Has a name, type, and specifications attached.

### Actor
A named persona involved in the narrative. Can be a human ("Organizer," "Attendee") or a system ("Payment Gateway," "Email Service"). Gives context to moments.

## Moment Types

| Type | What It Does | Interaction Specs? | Business Specs? |
|------|-------------|-------------------|----------------|
| **Command** | Actor triggers a state change | Yes | Yes |
| **Query** | Actor receives/views data | Yes | Yes |
| **React** | System reacts to an event automatically | No | Yes |
| **Experience** | UI-only behavior (navigation, popups) | Yes | No |

See [Moment Types](/reference/moment-types) for the full reference.

## Specification Types

### Interaction Specs
Describe what the user interface should do using the **describe/it/should** pattern. Present in command, query, and experience moments.

### Business Specs
Define business rules with concrete data using the **Given/When/Then** pattern. Present in command, query, and react moments.

## Event Model Constructs

### Command
An action that requests a state change. Describes intent. Examples: CreateEvent, SubmitRSVP. Appears as "When" in business specs. Blue in visual representations.

### Event
A fact that has happened. Always past tense. Examples: EventCreated, RSVPConfirmed. Appears as "Given" or "Then" in specs. Orange in visual representations.

### State
A current view of accumulated events. Examples: AvailableEventsView, EventDetails. Appears as "Given" or "Then" in specs. Green in visual representations.

## Principles

### Data Completeness
Every piece of state shown in a query must trace back through events to commands. Nothing appears from nowhere.

### One Model, Three Views
A single model powers visual (canvas), document (Notion-like editor), and code (TypeScript DSL) views. All views read from and write to the same model.

### Collaborative Modeling
Multiple people and AI agents contributing to the same model, synchronously or asynchronously.

---

*A [spec dialect](https://specdriven.com/dialects/narrative-driven) by the [Auto](https://on.auto) team.*

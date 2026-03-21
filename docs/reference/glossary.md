---
title: Glossary
---

# Glossary

Reference for NDD terminology.

## Core Constructs

### Narrative
The top-level unit. Describes how actors and entities interact through time, their attributes, behaviours, and the outcomes of those interactions. Can span multiple actors. Contains one or more scenes, starting with the happy path. Has a name, description, and storyboard image.

### Scene
A path within a narrative. Scenes represent the different ways a story can unfold: the happy path and its alternatives. A scene branches from a specific moment when the actor's journey diverges (e.g., "show sold out" branches from the "Book Tickets" moment). Scenes are always entered from the beginning, keeping each one self-contained. Has a name, description, storyboard image, and a sequential list of moments. In the document view, each scene is its own document.

### Moment
A single point in time where something happens. The atomic unit of NDD. One of four types: command, query, react, or experience. Has a name, type, and specifications attached. Can also be an exit point that branches to the beginning of another scene.

### Branching
How scenes connect. A moment in one scene can branch to the beginning of another scene, in the same narrative or a different one. The exit is from a specific moment; the entry is always the start of the target scene. On the visual canvas, branches appear as connecting lines between moments and scenes.

### Actor
A named persona involved in the narrative. Can be a human ("Promoter," "Fan") or a system ("Payment Gateway," "Email Service"). Gives context to moments.

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
An action that requests a state change. Expresses intent. Examples: ScheduleShow, BookTickets. Appears as "When" in business specs. Blue in visual representations.

### Event
A fact that has happened. Always past tense. Examples: ShowScheduled, TicketsReserved. Appears as "Given" or "Then" in specs. Orange in visual representations.

### State
A current view of accumulated events. Examples: AvailableShowsView, ShowDetails. Appears as "Given" or "Then" in specs. Green in visual representations.

## Principles

### Data Completeness
Every piece of state shown in a query must trace back through events to commands. Nothing appears from nowhere.

### One Model, Three Views
A single model powers visual (canvas), document (Notion-like editor), and code (TypeScript DSL) views. All views read from and write to the same model.

### Collaborative Modeling
Multiple people and AI agents contributing to the same model, synchronously or asynchronously.


---
title: Glossary
---

# Glossary

Reference for NDD terminology.

## The Structural Hierarchy

NDD organises every system into four levels:

```
Domain (business capability)
└── Narrative (goal thread)
    └── Scene (single outcome)
        └── Moment (single step toward that outcome)
```

### Domain
A coherent business capability area that groups related narratives sharing the same core concepts, rules, and outcomes. The top-level model in NDD. One workspace = one domain. Examples: Billing, Scheduling, Identity and Access, Concert Booking. Holds the actors, entities, and capability statement that all narratives within it share.

### Narrative
A cohesive thread of related scenes that together fulfil a broader user or business goal within a domain. Narratives sit between the domain and its individual outcomes. Examples within Concert Booking: "Listing a Show," "Getting Tickets," "Managing Your Booking." A narrative has a goal, the actors and entities it touches, and an ordered set of scene outcomes.

### Scene
A self-contained outcome achieved through one or more moments. Scenes are outcome-centred: each one names a single thing that becomes true. Examples: "Show published," "Tickets reserved," "Fan added to waitlist," "Booking cancelled." A scene has a name (the outcome), a description, the actors and entities involved, and a sequential list of moments.

### Moment
A single interaction or system step that moves a scene toward its outcome. The atomic unit of NDD. One of four types: command, query, react, or experience. Has a name, type, and specifications attached. A moment can also be the entry point that another scene transitions into.

## Outcome Scopes

Different levels of the hierarchy own different scopes of outcome. Don't conflate them.

| Level | Scope |
|-------|-------|
| Domain | A family of related outcomes within one business capability |
| Narrative | A broader goal achieved through multiple scene outcomes |
| Scene | A single, self-contained outcome |
| Moment | A single step toward that outcome |

## Transitions

How scenes connect. A moment can lead into the start of another scene whose outcome differs. The exit is from a specific moment; the entry is always the start of the target scene. The target scene can be in the same narrative or a different one. On the visual canvas, transitions appear as connecting lines between moments and scenes. Scenes are always entered from the beginning, never mid-way.

## Actors and Entities

### Actor
A named person or system involved in the domain. Can be human ("Promoter," "Fan") or system ("Payment Gateway," "Email Service"). Declared on the domain and referenced by narratives, scenes, and moments.

### Entity
A domain noun — something actors interact with ("Show," "Booking," "Ticket"). Declared on the domain alongside actors.

## Moment Types

| Type | What It Does | Interaction Specs? | Business Specs? |
|------|-------------|-------------------|----------------|
| **Command** | Actor triggers a state change | Yes | Yes |
| **Query** | Actor receives/views data | Yes | Yes |
| **React** | System reacts to an event automatically | No | Yes |
| **Experience** | UI-only behaviour (navigation, popups) | Yes | No |

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

### Collaborative Modelling
Multiple people and AI agents contributing to the same model, synchronously or asynchronously.

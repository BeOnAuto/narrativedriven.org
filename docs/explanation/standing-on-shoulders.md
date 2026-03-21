---
title: Standing on Shoulders
prev:
  text: One Model, Three Views
  link: /explanation/one-model-three-views
next:
  text: NDD as a Spec Dialect
  link: /explanation/spec-dialect
---

# Standing on Shoulders

NDD synthesizes patterns from some of the most important work in software development. Understanding where it draws from helps you see why it works the way it does.

## Behavior-Driven Development

**What NDD takes:** Given/When/Then. The insight that specs should describe behavior in a shared language. The principle that specs should be executable.

**Where NDD diverges:** BDD scenarios are flat lists by feature. NDD organizes them into time-based narrative structure (narratives > scenes > moments). NDD also unifies Given/When/Then for domain logic with describe/it/should for interface contracts, what BDD and component testing traditionally kept separate.

**Key figures:** Dan North, Aslak Hellesoy (Cucumber/Gherkin), Matt Wynne (Example Mapping), Seb Rose, Gojko Adzic (Specification by Example).

## EventStorming

**What NDD takes:** Collaborative domain discovery workshops. Domain events as the backbone of understanding. Facilitation techniques for group focus.

**Where NDD diverges:** EventStorming produces diagrams (sticky notes on walls). NDD produces a model (structured, machine-parseable data). The facilitation principles remain. The medium shifted from stickies to a unified model.

**Key figures:** Alberto Brandolini.

## Event Sourcing and CQRS

**What NDD takes:** The three atomic units: commands, events, state. Events as source of truth. CQRS separation of command and query processing.

**Where NDD diverges:** NDD doesn't require event sourcing at the architecture level. The command/event/state model is used at the specification level for [data completeness](/explanation/data-completeness), regardless of implementation architecture.

**Key figures:** Greg Young.

## Domain-Driven Design

**What NDD takes:** Ubiquitous Language. Bounded Contexts. Deep domain understanding before code.

**Where NDD diverges:** DDD focuses on domain models and strategic patterns. NDD focuses on user journeys and the narrative structure connecting domain concepts through time. They're complementary.

**Key figures:** Eric Evans.

## Specification by Example

**What NDD takes:** Concrete examples for specifying behavior. Living documentation.

**Where NDD diverges:** Specification by Example is a practice pattern. NDD provides the structured dialect that captures examples in an executable form within a time-based model.

**Key figures:** Gojko Adzic.

## User Story Mapping

**What NDD takes:** Organizing work around the user's journey through the system.

**Where NDD diverges:** Story Mapping produces a planning artifact. NDD produces an executable specification. Each moment carries concrete specs, not just titles.

**Key figures:** Jeff Patton.

## Storyboarding: Disney and Airbnb

**What NDD takes:** The insight that storyboarding — visual, moment-by-moment storytelling — is a powerful way to design experiences. Disney invented storyboarding to plan Snow White, their first full-length film. Decades later, Airbnb's CEO Brian Chesky adopted the same technique: mapping every moment of the customer journey as a storyboard panel, then crafting the experience at each moment. Airbnb mapped 45 moments from "planning a trip" to "sharing the experience." Each panel was a discrete point in time worth designing for.

**Where NDD diverges:** Disney and Airbnb used storyboards as planning artifacts — posters on walls, slides in decks. NDD makes the storyboard the model itself. Each panel is a moment with structured specifications. The storyboard is executable, not decorative.

## The Synthesis

NDD's contribution is the synthesis: a single model combining Disney/Airbnb's storyboard-based experience design, BDD's executable specs, EventStorming's collaborative discovery, event sourcing's data integrity, DDD's domain focus, Specification by Example's concrete examples, and Story Mapping's journey-based organization.

The result is the first full [spec dialect](https://specdriven.com/dialects/): a specification language with a schema, machine-parseability, and a direct path to executable output.

For the complete landscape, see [specdriven.com](https://specdriven.com).

---

*A [spec dialect](https://specdriven.com/dialects/narrative-driven) by [Auto](https://on.auto). Part of the [spec-driven](https://specdriven.com) movement.*

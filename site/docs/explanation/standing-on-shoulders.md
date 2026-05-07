---
title: Standing on Shoulders
prev:
  text: Progressive Disclosure for Specs
  link: /explanation/progressive-disclosure
next:
  text: NDD as a Spec Dialect
  link: /explanation/spec-dialect
---

# Standing on Shoulders

![NDD card on top with arrows to source method cards: BDD, DDD, EventStorming, CQRS, Story Mapping](/images/heroes/standing-on-shoulders.png){.page-hero}

NDD pulls together patterns from work that's shaped how we build software. Knowing where it draws from helps you see why it works the way it does.

## Behavior-Driven Development

NDD takes Given/When/Then from BDD, along with the idea that specs should describe behaviour in a shared language and be executable.

Where it diverges: BDD scenarios are flat lists by feature. NDD organises them into a four-level structure (domain > narratives > scenes > moments) where each level owns a different scope of outcome. It also unifies Given/When/Then for domain logic with describe/it/should for interface contracts, which BDD and component testing traditionally kept separate.

Key figures: Dan North, Aslak Hellesoy (Cucumber/Gherkin), Matt Wynne (Example Mapping), Seb Rose, Gojko Adzic (Specification by Example).

## EventStorming

NDD takes EventStorming's collaborative domain discovery workshops, its use of domain events as the backbone of understanding, and its facilitation techniques.

Where it diverges: EventStorming produces diagrams (sticky notes on walls). NDD produces a model (structured, machine-parseable data). The facilitation principles carry over. The medium shifted from stickies to a unified model.

Key figures: Alberto Brandolini.

## Event Sourcing and CQRS

NDD takes the three atomic units (commands, events, state), events as source of truth, and CQRS separation of command and query processing.

Where it diverges: NDD doesn't require event sourcing at the architecture level. The command/event/state model is used at the specification level for [data completeness](/explanation/data-completeness), regardless of how you implement things.

Key figures: Greg Young.

## Domain-Driven Design

NDD takes Ubiquitous Language, Bounded Contexts, the insistence on deep domain understanding before code, and the idea that the *domain* is a first-class structural element. The top level of every NDD model is the domain — a coherent business capability with its actors, entities, and capability statement.

Where it diverges: DDD focuses on domain models and strategic patterns. NDD focuses on the narrative structure connecting domain concepts through time, with explicit goal threads, outcomes, and slices below the domain. They're complementary, and you'll often want both.

Key figures: Eric Evans.

## Specification by Example

NDD takes the use of concrete examples for specifying behavior, and the idea of living documentation.

Where it diverges: Specification by Example is a practice pattern. NDD provides a structured dialect that captures examples in executable form within a time-based model.

Key figures: Gojko Adzic.

## User Story Mapping

NDD takes the idea of organizing work around the user's journey through the system.

Where it diverges: Story Mapping produces a planning artifact. NDD produces an executable specification. Each moment carries concrete specs, not just titles.

Key figures: Jeff Patton.

## Storyboarding: Disney and Airbnb

NDD takes the insight that storyboarding, visual moment-by-moment storytelling, is a good way to design experiences. Disney invented storyboarding to plan Snow White. Decades later, Airbnb's CEO Brian Chesky adopted the same technique: mapping every moment of the customer journey as a storyboard panel, then crafting the experience at each one. Airbnb mapped 45 moments from "planning a trip" to "sharing the experience." Each panel was a discrete point in time worth designing for.

Where it diverges: Disney and Airbnb used storyboards as planning artifacts, posters on walls, slides in decks. NDD makes the storyboard the model itself. Each panel is a moment with structured specifications. The storyboard is executable, not decorative.

## The Synthesis

What NDD adds is the combination: a single model that pulls together Disney/Airbnb's storyboard-based experience design, BDD's executable specs, EventStorming's collaborative discovery, event sourcing's data integrity, DDD's domain as a first-class structural element, Specification by Example's concrete examples, and Story Mapping's journey-based organisation — all stacked into one four-level hierarchy (Domain → Narrative → Scene → Moment). None of these ideas are new on their own. Wiring them into one coherent model is.

The result is the first full [spec dialect](https://specdriven.com/dialects/): a specification language with a schema, machine-parseability, and a direct path to executable output. For the typed form on this site, see the [DSL reference](/reference/dsl).

For the complete landscape, see [specdriven.com](https://specdriven.com).


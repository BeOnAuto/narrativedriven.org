---
title: Standing on Shoulders
prev:
  text: Progressive Control
  link: /explanation/progressive-control
next:
  text: NDD as a Spec Dialect
  link: /explanation/spec-dialect
---

# Standing on Shoulders

![NDD card on top with arrows to source method cards: BDD, DDD, EventStorming, CQRS, Story Mapping](/images/heroes/standing-on-shoulders.png){.page-hero}

NDD pulls together patterns from work that shaped how teams build software. Knowing where it draws from helps you see why the taxonomy works the way it does.

## Behavior-Driven Development

NDD takes Given/When/Then from BDD, along with the idea that examples should describe behavior in a shared language.

Where it diverges: BDD scenarios are usually grouped by feature. NDD organizes examples inside a four-level hierarchy where each level owns a different scope of outcome.

Key figures: Dan North, Aslak Hellesoy, Matt Wynne, Seb Rose, Gojko Adzic.

## EventStorming

NDD takes EventStorming's collaborative domain discovery style and its focus on how meaningful business changes unfold over time.

Where it diverges: EventStorming is usually a workshop and diagramming practice. NDD turns the discovered language into a repeatable narrative taxonomy: domain, narrative, scene, and moment.

Key figures: Alberto Brandolini.

## Domain-Driven Design

NDD takes Ubiquitous Language, Bounded Contexts, the insistence on deep domain understanding before code, and the idea that the domain is a first-class concept.

Where it diverges: DDD focuses on domain models and strategic patterns. NDD focuses on the product story below the domain: goal threads, outcomes, behavior slices, rules, and examples.

Key figures: Eric Evans.

## Specification by Example

NDD takes the use of concrete examples for specifying behavior and making rules reviewable.

Where it diverges: Specification by Example is a practice pattern. NDD places examples inside moments so they sit next to the outcome and interaction they clarify.

Key figures: Gojko Adzic.

## User Story Mapping

NDD takes the idea of organizing work around the user's journey through the system.

Where it diverges: Story Mapping is usually a planning artifact. NDD uses journey thinking as part of a product modeling language with explicit outcomes and moment types.

Key figures: Jeff Patton.

## Storyboarding: Disney and Airbnb

NDD takes the insight that storyboarding, visual moment-by-moment storytelling, is a good way to design experiences. Disney used storyboards to plan Snow White. Decades later, Airbnb's CEO Brian Chesky used the same technique to map the customer journey.

Where it diverges: storyboards are usually visual planning aids. NDD treats storyboarding as one way to review the same underlying product story described by the taxonomy.

## The synthesis

What NDD adds is the combination: storyboard-based experience design, BDD's examples, EventStorming's collaborative discovery, DDD's domain language, Specification by Example's concrete cases, and Story Mapping's journey structure, stacked into one hierarchy:

```text
Domain -> Narrative -> Scene -> Moment
```

None of these ideas are new on their own. The useful move is giving them one shared language.

For the complete landscape, see [specdriven.com](https://specdriven.com).

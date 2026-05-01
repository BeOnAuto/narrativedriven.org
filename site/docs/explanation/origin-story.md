---
title: The Origin Story
prev:
  text: NDD as a Spec Dialect
  link: /explanation/spec-dialect
---

# The Origin Story

NDD was born at [Xolvio](https://xolvio.com), a US-based software consultancy founded by [Sam Hatoum](https://specdriven.com/people#sam-hatoum). The goal was simple and ambitious: deliver better quality software, faster.

## The Problem Nobody Could Solve

Xolvio tried every agile methodology available. Scrum, Kanban, BDD, DDD, EventStorming, User Story Mapping. Each one helped. None fully solved scattered and incomplete requirements.

Division of labor is at the heart of modern teams. But with it comes division of knowledge. Every team member holds a fragment of truth. No method could reliably put those fragments back together. No method could thread key moments through time, taking you to their logical outcome.

## The Narrative Emerges

So the team framed requirements as stories. Sequences of moments through time, told from the user's perspective. Each moment had context, interaction, and system response.

Together, these moments formed a complete picture that made sense when read aloud. A narrative.

When they let the narrative drive development, everything shifted. Teams aligned faster. Rework dropped. What took quarters now took months. One notable project: a loyalty platform for a leading gaming company. Three million users, complex logic, deep integrations. The client's timeline was several quarters. NDD facilitated delivery within three months, with 90% test coverage.

## From Workshops to Model

In the early days, NDD was primarily a facilitation technique. Gather people, put stickies on a board, tell the story together.

Then the world changed. Remote work. AI. The SDLC compressing. Teams needed to make more decisions, faster, across more disciplines, with AI as a participant.

Sticky notes couldn't hold that together. NDD needed a model: a single, structured, machine-parseable artifact serving as the medium for all collaboration. Visual for designers. Textual for product teams. Code for developers. All the same thing.

That model is what NDD became. The facilitation didn't disappear. The model absorbed it. Every interaction, whether in a group session, an individual contribution, or an AI-generated draft, is captured in the same structured format.

## The Intellectual Lineage

NDD draws from BDD (Given/When/Then), EventStorming (collaborative discovery), Specification by Example (concrete examples), Domain-Driven Design (ubiquitous language), and User Story Mapping (journey-based organization). It synthesizes all of these into a single executable format.

For the detailed lineage, see [Standing on Shoulders](/explanation/standing-on-shoulders).

## Where It Stands Today

NDD is the specification dialect at the heart of [Auto](https://on.auto). The model has reached its unified form: a single Zod-backed schema serving visual, document, and code audiences from one source of truth. The [Auto Engineer](https://github.com/BeOnAuto/auto-engineer) transforms narratives into production code with deterministic quality checks.

The community is growing. The SDLC keeps compressing. The need for coherent, collaborative specifications keeps growing with it.

The story isn't finished. But the narrative is clear.

NDD's place in the wider movement is documented on the [spec-driven timeline](https://specdriven.com/timeline).


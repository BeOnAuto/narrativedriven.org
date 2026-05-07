---
title: Origin Story
prev:
  text: NDD as a Spec Dialect
  link: /explanation/spec-dialect
---

# The Origin Story

![Lineage timeline from BDD to DDD to EventStorming to NDD](/images/heroes/origin-story.png){.page-hero}

NDD did not start with AI.

It started with consulting work that would not stay consistent across artifacts.

## The setting

The method came out of [Xolvio](https://xolvio.com), a software consultancy that has been delivering enterprise systems for over fifteen years. The work spanned BDD, TDD, DDD, EventStorming, and Specification by Example, often on programs where the cost of getting the spec wrong was high enough that teams paid for outside facilitation to get it right.

The clients were the kind that ran serious software at scale. The work was the kind where the difference between a good model and a vague model showed up six months later as either a stable system or a stalled one.

One notable engagement: a loyalty platform for a leading gaming company. Three million users, complex logic, deep integrations. The client's timeline was several quarters. The narrative-driven approach facilitated delivery within three months, with 90% test coverage. That was the consulting proof point. The pattern that produced it was the thing worth keeping.

## The recurring problem

Across that work, one pattern repeated.

Requirements lived in one place. Domain models lived in another. Event flows lived in a third. UI lived in a fourth. Tests lived somewhere alongside the code, written after the fact. Each artifact was good. None of them stayed in sync.

The team that read all of them carried the truth in their heads. When a person rotated off, the truth went with them. When a workshop ended, the artifacts started drifting from the moment everyone walked out of the room.

The methods themselves were not wrong. BDD captured behavior. DDD captured language. EventStorming captured flow. Each one solved part of the problem. The problem was that no single method captured the whole.

## The narrative move

The shift happened in the workshop room.

When teams modeled software as a sequence of goals, outcomes, and slices, with rules and examples attached, gaps surfaced earlier. Product, design, QA, and engineering could reason about the same behavior without translating across separate documents. The thread held.

By 2016, that approach had a name: spec-driven development. The idea was that the specification was the medium, not a stop along the way. The artifact teams built was the thing the system was meant to satisfy.

For years, that meant facilitation patterns: workshops, story flows, examples, domain language, collaborative modeling. Xolvio kept doing that work. The dialect kept getting sharper.

## What AI changed

AI did not invalidate any of that. It made it more urgent.

A workshop artifact was enough when the reader was a developer. The developer carried context across artifacts and reconciled them by hand. A coding agent does not. It builds from what is in front of it. If the spec is split across five documents, the agent will not unify them. It will guess.

The need that had been quietly accumulating for years now had a sharp edge. The shared, structured source of truth was no longer a nice-to-have. It was the thing that determined whether the agent built the right system or a plausible-looking wrong one.

That is when NDD became a spec dialect rather than a facilitation pattern. The structure had to be tight enough for machines to read, validate, and build from, while still readable enough for humans to review.

## Where Auto fits

Auto is the product built to make NDD usable without consulting work.

It applies the method to your prompt, turns it into a buildable narrative, and gives your coding agent something structured to build from.

NDD is the method.

Auto is how it ships.

NDD's place in the wider movement is documented on the [spec-driven timeline](https://specdriven.com/timeline).

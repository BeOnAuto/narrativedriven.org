---
title: Origin Story
prev:
  text: NDD as a Spec Dialect
  link: /explanation/spec-dialect
---

# The Origin Story

![Lineage timeline from BDD to DDD to EventStorming to NDD](/images/heroes/origin-story.png){.page-hero}

NDD did not start with AI.

It started with consulting work that would not stay consistent across documents.

## The setting

The method came out of [Xolvio](https://xolvio.com), a software consultancy that has been delivering enterprise systems for over fifteen years. The work spanned BDD, TDD, DDD, EventStorming, and Specification by Example, often on programs where the cost of getting the spec wrong was high enough that teams paid for outside facilitation to get it right.

The clients were the kind that ran serious software at scale. The work was the kind where the difference between a clear model and a vague model showed up six months later as either a stable system or a stalled one.

One notable engagement was a loyalty platform for a large gaming company: millions of users, complex logic, and deep integrations. The narrative-driven approach helped the team compress the delivery plan and keep behavior covered by tests. That was the consulting proof point. The pattern that produced it was the thing worth keeping.

## The recurring problem

Across that work, one pattern repeated.

Requirements lived in one place. Domain language lived in another. Event flows lived in a third. UI lived in a fourth. Tests lived somewhere alongside the code, written after the fact. Each document was useful. None of them stayed in sync.

The team that read all of them carried the truth in their heads. When a person rotated off, the truth went with them. When a workshop ended, the documents started drifting from the moment everyone walked out of the room.

The methods themselves were not wrong. BDD captured behavior. DDD captured language. EventStorming captured flow. Each one solved part of the problem. The problem was that no single method gave teams a shared vocabulary for the whole product story.

## The narrative move

The shift happened in the workshop room.

When teams modeled software as a sequence of goals, outcomes, and behavior slices, with rules and examples attached, gaps surfaced earlier. Product, design, QA, and engineering could reason about the same behavior without translating across separate documents. The thread held.

By 2016, that approach had a name: spec-driven development. The idea was that the specification was the medium, not a stop along the way.

For years, that meant facilitation patterns: workshops, story flows, examples, domain language, collaborative modeling. Xolvio kept doing that work. The method kept getting sharper.

## What AI changed

AI did not invalidate any of that. It made it more urgent.

A workshop document was enough when the reader was a developer. The developer carried context across documents and reconciled them by hand. A coding agent does not have that history unless the team makes intent explicit.

The need that had been quietly accumulating for years now had a sharp edge. Teams needed a reviewable product story that could survive beyond chat.

That is where NDD became more than a facilitation pattern: a taxonomy for preserving software intent.

NDD's place in the wider movement is documented on the [spec-driven timeline](https://specdriven.com/timeline).

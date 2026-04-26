---
title: NDD as a Spec Dialect
prev:
  text: Standing on Shoulders
  link: /explanation/standing-on-shoulders
next:
  text: The Origin Story
  link: /explanation/origin-story
---

# NDD as a Spec Dialect

Narrative-Driven Development is a **spec dialect**: a structured, schema-backed specification language purpose-built for line-of-business web applications.

## What Makes a Spec Dialect?

A spec dialect has three properties (as defined by [specdriven.com](https://specdriven.com/dialects/)):

1. **A structured format** with a defined schema or grammar
2. **Machine-parseable syntax** that tooling can process
3. **A direct relationship to executable output**

NDD has all three. Its model is a Zod schema that tools validate and transform. Its business specs compile into verifiable tests. The [Auto](https://on.auto) pipeline transforms narratives into production-ready code.

## What Makes NDD the First Full Dialect?

The ancestral spec languages (Gherkin's Given/When/Then and describe/it/should) proved specs could be human-readable and machine-executable. But they were individual patterns, not unified systems.

NDD combines both into a single model with a four-level structural hierarchy (Domain → Narrative → Scene → Moment), a model-based architecture (Zod schema), multimodal access (visual + document + code), and executable specifications. The hierarchy is what holds the dialect together: each level owns a different scope of outcome, so specs at every level stay coherent and compose into the whole. No other approach in the current landscape provides all four.

## The Executability Gap

Most tools in the current spec-driven wave (Kiro, Spec Kit, OpenSpec, BMAD) use markdown prose. Readable? Yes. Executable? No. They've regressed from the BDD era's achievement that specs should prove themselves.

NDD carries forward that tradition. When a business spec passes, it's verified truth, not documentation that might have drifted.

## The Disclosure Gap

There's a second gap, and it's the one the next era of agentic coding will judge dialects on. Prose specs cannot disclose progressively. They load whole or not at all, and as the system grows, the document grows with it until the agent's context window can no longer hold the relevant slice without drowning in everything else. That isn't a stylistic problem. It's structural.

NDD's hierarchy (Domain → Narrative → Scene → Moment) is a disclosure mechanism. An agent loads the domain's vocabulary once, then pulls just the scene under work, with the moments and business specs that scene needs, and follows the data-completeness chain only as far as the task requires. The schema makes the slice addressable. The model makes the slice coherent.

[Progressive disclosure for specs →](/explanation/progressive-disclosure)

For detailed capability comparisons, see the [NDD profile](https://specdriven.com/landscape/auto) and [evaluation framework](https://specdriven.com/landscape/evaluation) on specdriven.com.

## Beyond Line-of-Business

NDD is purpose-built for workflows, forms, dashboards, and orchestration. Other domains need other dialects. The Auto team is developing **Archetype** for architecture specifications. The future is polyglot: different dialects for different domains, all structured, all executable.

See [specdriven.com/dialects](https://specdriven.com/dialects/) for the full catalog.


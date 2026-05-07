---
title: Progressive Disclosure for Specs
prev:
  text: One Model, Three Views
  link: /explanation/one-model-three-views
next:
  text: Standing on Shoulders
  link: /explanation/standing-on-shoulders
---

# Progressive Disclosure for Specs

![Narrative card with progressively expanded detail panels](/images/heroes/progressive-disclosure.png){.page-hero}

The hardest problem in working with AI on real software isn't writing prompts. It's deciding what context the model gets to see at each step. Too little, and the model invents details. Too much, and the model loses focus, costs more, and produces worse output. The pattern that fixes this has a name in the user-experience literature, where it's been settled since 1995, and a name in the context-engineering literature, where it crystallised around Anthropic's Agent Skills work in late 2025. Both names point to the same idea: progressive disclosure.

Show the headline first. Reveal the body when it matters. Hand over the appendix only when the task demands it.

NDD is built around this idea from the ground up. The four-level hierarchy isn't a documentation convenience. It's a disclosure mechanism that lets agents and humans work with exactly the slice of the spec that's relevant right now.

## Prose Specs Cannot Disclose Progressively

Most current spec-driven tools (Kiro, Spec Kit, OpenSpec, BMAD) store specifications as markdown prose. Markdown is uniform. Every section is loaded together or not at all. There's no schema to ask "give me the moment under work, with its business rules, but skip the rest of the domain." The agent ends up with the whole document or none of it, and the longer that document grows, the more the model's attention rots.

A structured model is different. The hierarchy itself is the index. The schema itself is the loader. The agent (or the human) can ask for the level of detail they need, when they need it, without the rest of the system getting in the way.

## How NDD's Hierarchy Maps to Disclosure Levels

Each level of an NDD model owns a different slice of context, and each level can be loaded independently of the levels below it.

| NDD level | What it carries | When to load it |
| --- | --- | --- |
| **Domain** | Business capability, actors, entities, ubiquitous language | Always. This is the world the story takes place in. |
| **Narrative** | A goal thread within the domain | When working on anything inside that goal. |
| **Scene** | A single outcome and the moments that achieve it | When implementing or reviewing that outcome. |
| **Moment** | A single slice with its type and specs | When working on that specific slice. |
| **Business Specs (Given/When/Then)** | Concrete examples that verify a moment's behaviour | When writing the test or running the verifier. |

A coding agent working on the "Tickets reserved" scene of a "Getting Tickets" narrative doesn't need every other narrative in the domain. It needs that scene, the moments inside it, and the data-completeness chain those moments touch. NDD's structure makes that slice trivially addressable. Prose can't.

## Data Completeness Makes the Slice Self-Contained

Progressive disclosure only works if each disclosed level is coherent on its own. NDD's [data completeness](/explanation/data-completeness) constraint guarantees this. Every piece of state visible in a moment traces back through events to a command, and the chain is enforced by the model. When an agent loads a scene, the events that scene's queries depend on are knowable from the model itself. The agent can pull just those events into context. Nothing dangles. Nothing is assumed.

This is the structural property that makes NDD agent-native rather than just human-readable.

## One Model, Three Views Is Disclosure Across Modalities

Progressive disclosure usually refers to disclosure over time: load less now, more later. NDD also discloses across modalities. The [visual canvas](/explanation/one-model-three-views) shows the domain as a storyboard for the people who think in pictures. The document view shows scenes as pages for the people who read text. The code DSL shows the same model with full type safety for the people who live in the editor.

Each view is a different disclosure level for a different reader. A stakeholder reviews the storyboard. A product manager reviews the document. A developer reviews the code. Nobody is forced through the wrong level of detail to do their job, and nobody is missing information because they were given a different artefact than the others. There is one model. The view is the disclosure.

## The llms.txt, llms-full.txt, and Skill Trio

The same pattern applies when handing NDD to an AI. The site already publishes three artefacts at three disclosure levels:

- **[/llms.txt](https://www.narrativedriven.org/llms.txt)** is the index. Short. The four-level hierarchy in a paragraph and pointers to the rest. This is what an agent sees first.
- **[/llms-full.txt](https://www.narrativedriven.org/llms-full.txt)** is the body. Definitions, the generation procedure, validation rules, naming conventions, anti-patterns. The agent loads this when reasoning rigorously about structure.
- **[NDD Skill](https://www.narrativedriven.org/ndd-skill.md)** is the system-prompt-ready instruction set. Methodology, moment types, scene-worthiness rubric, modelling workflow.

This matches Anthropic's Skills architecture (metadata always loaded, body loaded on trigger, bundled files navigated on demand) because it's the same pattern. Build a skill once at three levels and any agent that follows the convention can pick the right level for the work at hand.

The [Prompting AI for NDD](/guides/prompting-ai) guide shows how to use these in practice.

## Why This Matters for the Spec-Driven Movement

The first wave of spec-driven tools proved that specs can drive AI implementation. The next problem is making those specs usable by agents at scale, in long sessions, across large systems, without the context window collapsing. That problem is structural, not stylistic. Better prose won't solve it. A schema-backed, hierarchical model will.

NDD is the first spec dialect built for this constraint. Its hierarchy is the disclosure mechanism. Its data-completeness rule is the coherence guarantee. Its three views are the human-side disclosure. The result is a specification language that an agent can pull from instead of being drowned in.

Specs are no longer a document the agent reads cover to cover. They are a model the agent queries, one disclosed slice at a time.

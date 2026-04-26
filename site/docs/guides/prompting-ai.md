---
title: Prompting AI for NDD
---

# Prompting AI for NDD

AI is a collaborator in NDD. You can use it to generate an initial model, expand a narrative, or fill in business specs. The quality of what you get back depends on how you prompt it.

## Hand the AI the canonical structure

The site serves three resources designed for AI consumption, deliberately laid out as three disclosure levels so you load only what the task needs. Pick the one that matches the AI's needs:

- **[/llms.txt](https://www.narrativedriven.org/llms.txt)** — the index. Short. The four-level hierarchy in one paragraph and pointers to the rest. Good for agents that follow the [llms.txt convention](https://llmstxt.org).
- **[/llms-full.txt](https://www.narrativedriven.org/llms-full.txt)** — the body. Full structural reference: definitions, generation procedure, validation rules, naming, anti-patterns. Drop this into context when you want the AI to reason rigorously about structure.
- **[NDD Skill](https://www.narrativedriven.org/ndd-skill.md)** — the system-prompt-ready instruction set. Methodology, moment types, outcome-based scene-worthiness rubric, modelling workflow.

Any of these gives the AI the same canonical definitions: Domain → Narrative → Scene → Moment. Choosing among them is itself an act of [progressive context disclosure](/explanation/progressive-disclosure): give the agent the smallest level that lets it do the work, and let it reach for more only if it needs to.

## How to Use the Skill

The simplest approach: paste the [NDD Skill](https://www.narrativedriven.org/ndd-skill.md) into your AI's system prompt or custom instructions. The AI will then understand NDD concepts and produce structured narratives when asked.

You can also include it at the start of a conversation. Describe your application and ask the AI to model it.

The most productive approach is iterative. Start with a rough description, let the AI generate a first pass, then refine together — just as you would in a collaborative modelling session with humans.

## Effective Prompts

### Starting from scratch

> "I'm building a concert booking platform. Two actors: Promoter and Fan. The promoter lists shows, fans browse and book tickets, and the system manages waitlists when shows sell out. Model this as an NDD domain with narratives, scenes, and moments. Reason top-down."

The AI should produce one domain (Concert Booking), multiple narratives that each fulfil a broader goal, scenes named by their outcomes, and moments that move each scene toward its outcome. It should also check data completeness across the chain.

### Expanding a narrative

> "I have a 'Getting Tickets' narrative with a 'Tickets reserved' scene. Add a sibling scene for when the show is sold out and the fan ends up on a waitlist. The Book Tickets moment should be the transition point into the new scene."

### Checking data completeness

> "Trace the data completeness chain for my 'Browse Available Shows' query moment. What events does AvailableShowsView depend on? Do those events all have command moments that produce them?"

### Applying the rubric

> "The fan enters an invalid email when booking. Is this a separate scene or incidental detail? Apply the outcome-based scene-worthiness rubric."

The AI should apply all three tests (Outcome, Discussion, Actor Impact) and explain its reasoning.

## What Good AI Output Looks Like

- A single domain at the top, with capability, actors, and entities captured once.
- Multiple narratives — each a coherent goal thread, not one monolithic blob.
- Scenes named by outcomes ("Tickets reserved," not "Booking flow").
- Each moment has a type and contributes to its scene's outcome.
- Distinct outcomes get distinct scenes, even when the same upstream moment leads into them.
- Every query moment's state traces back through events to commands.
- Validation and incidental edge cases stay inside moment business specs, not promoted to scenes.
- All four moment types appear where appropriate: commands for state changes, queries for data retrieval, reacts for automated system responses, experiences for UI-only interactions.

## Common AI Mistakes

The most common mistake is **collapsing the hierarchy** — treating a narrative as a domain or a moment as a scene. Push back: "Reason top-down. What's the business capability? What's the goal thread? What outcome becomes true?"

Watch for **scenes named after screens or workflows** — "Checkout page," "Booking flow." Push back: "Name the outcome, not the screen. What becomes true here?"

The AI sometimes **only models one outcome per narrative** — the equivalent of the old happy path. Ask: "What other outcomes does this narrative cover? If the actor can end up in a meaningfully different state, that's another scene."

Sometimes the AI goes the other direction and **creates scenes for validation errors**. Push back: "Does the actor end up in a different state, or are they still on the same screen? If they're still in the same state, it's an incidental edge case in the moment, not a new scene."

Finally, check for **broken data completeness**. The AI shows state in a query that has no source event. Ask: "Where does this data come from? Trace it back to a command."

---
title: Prompting AI for NDD
---

# Prompting AI for NDD

AI is a collaborator in NDD. Whether you're using it to generate an initial model, expand a narrative, or fill in business specs, the quality of the output depends on how you prompt it. This guide shows you how.

## The NDD Skill

We provide a ready-made skill file — a system prompt you can give to any AI assistant to teach it NDD methodology. Download it and include it in your AI's context:

**[Download the NDD Skill →](https://www.narrativedriven.org/ndd-skill.md)**

The skill encodes the same rubric and methodology described in these docs, formatted for AI consumption: token-efficient, precise, and actionable.

## How to Use It

**Option 1: System prompt.** Paste the skill into your AI's system prompt or custom instructions. The AI will then understand NDD concepts and produce structured narratives when asked.

**Option 2: Conversation context.** Include the skill at the start of a conversation. Then describe your application and ask the AI to model it.

**Option 3: Iterative refinement.** Start with a rough description, let the AI generate a first pass, then refine together — just as you would in a collaborative modeling session with humans.

## Effective Prompts

### Starting from scratch

> "I'm building a concert booking platform. Two actors: Promoter and Fan. The promoter lists shows, fans browse and book tickets, and the system manages waitlists when shows sell out. Model this as NDD narratives with scenes and moments."

The AI should produce multiple narratives (not one big one), identify the happy path and alternative scenes, and check data completeness.

### Expanding a narrative

> "I have a 'Getting Tickets' narrative with a happy path scene. Add an alternative scene for when the show is sold out and the fan joins a waitlist. Make sure to branch from the Book Tickets moment."

### Checking data completeness

> "Trace the data completeness chain for my 'Browse Available Shows' query moment. What events does AvailableShowsView depend on? Do those events all have command moments that produce them?"

### Applying the rubric

> "The fan enters an invalid email when booking. Is this a separate scene or incidental detail? Apply the scene-worthiness rubric."

The AI should apply the three tests (Storyboard, Discussion, Actor Impact) and explain its reasoning.

## What Good AI Output Looks Like

When the AI models your application correctly, you should see:

- **Multiple narratives** for distinct stories, not one monolithic narrative
- **Happy path first** in each narrative, with alternative scenes branching from specific moments
- **Branching that passes the rubric** — alternative scenes where the actor's journey fundamentally changes
- **Data completeness** — every query moment's state traces back through events to commands
- **Incidental detail** kept within moment business specs, not promoted to scenes
- **Four moment types** used appropriately: commands for state changes, queries for data retrieval, reacts for automated system responses, experiences for UI-only interactions

## Common AI Mistakes

**One big narrative.** The AI puts everything into a single narrative with many scenes. Push back: "These scenes represent different user journeys. Split them into separate narratives."

**Missing alternative scenes.** The AI only models the happy path. Ask: "What happens when things go wrong? Apply the scene-worthiness rubric to identify alternative paths."

**Incidental detail as scenes.** The AI creates scenes for validation errors. Push back: "Does the actor's journey fundamentally change? Or is this a business spec within the moment?"

**Broken data completeness.** The AI shows state in a query that has no source event. Ask: "Where does this data come from? Trace it back to a command."

---

*A [spec dialect](https://specdriven.com/dialects/narrative-driven) by the [Auto](https://on.auto) team.*

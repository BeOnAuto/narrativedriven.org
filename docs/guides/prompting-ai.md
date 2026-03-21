---
title: Prompting AI for NDD
---

# Prompting AI for NDD

AI is a collaborator in NDD. You can use it to generate an initial model, expand a narrative, or fill in business specs. The quality of what you get back depends on how you prompt it.

## The NDD Skill

We provide a ready-made skill file, a system prompt you can give to any AI assistant to teach it NDD methodology. Download it and include it in your AI's context:

**[Download the NDD Skill →](https://www.narrativedriven.org/ndd-skill.md)**

The skill encodes the same rubric and methodology described in these docs, formatted for AI consumption: token-efficient and precise.

## How to Use It

The simplest approach: paste the skill into your AI's system prompt or custom instructions. The AI will then understand NDD concepts and produce structured narratives when asked.

You can also include it at the start of a conversation. Describe your application and ask the AI to model it.

The most productive approach is iterative. Start with a rough description, let the AI generate a first pass, then refine together, just as you would in a collaborative modeling session with humans.

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

The AI should apply all three tests (Storyboard, Discussion, Actor Impact) and explain its reasoning.

## What Good AI Output Looks Like

When the AI models your application correctly, you should see multiple narratives for distinct stories, not one monolithic blob. The happy path comes first in each narrative, with alternative scenes branching from specific moments. Branching should pass the rubric, meaning alternative scenes where the actor's journey actually changes. Every query moment's state should trace back through events to commands (data completeness). Incidental detail stays within moment business specs, not promoted to scenes. And all four moment types should appear where appropriate: commands for state changes, queries for data retrieval, reacts for automated system responses, experiences for UI-only interactions.

## Common AI Mistakes

The most common mistake is **one big narrative**. The AI puts everything into a single narrative with many scenes. Push back: "These scenes represent different user journeys. Split them into separate narratives."

Watch for **missing alternative scenes** too. The AI tends to only model the happy path. Ask: "What happens when things go wrong? Apply the scene-worthiness rubric to identify alternative paths."

Sometimes the AI goes the other direction and **creates scenes for validation errors**. Push back: "Does the actor's journey actually change? Or is this a business spec within the moment?"

Finally, check for **broken data completeness**. The AI shows state in a query that has no source event. Ask: "Where does this data come from? Trace it back to a command."


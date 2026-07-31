---
title: Anatomy of a Product Model
description: "How Narrative-Driven Development turns product intent into a durable model of actors, goals, outcomes, moments, rules, examples, and facts."
next:
  text: Data Completeness
  link: /explanation/data-completeness
---

# Anatomy of a Product Model

NDD creates a product model.

The narrative is the human-readable surface of that model. It lets people review goals, outcomes, moments, rules, examples, access, workflows, and important facts before implementation.

## The shape

```text
Domain -> Narrative -> Scene -> Moment
```

That hierarchy gives the model its spine.

| Part | Meaning |
| --- | --- |
| Domain | The capability being modeled. |
| Narrative | A goal thread inside the domain. |
| Scene | An outcome that becomes true. |
| Moment | A behavior slice that moves the outcome forward. |
| Actor | A participant in the product behavior. |
| Rule | A decision the product must preserve. |
| Example | A concrete case that proves a rule. |
| Fact/Event | Something the product records happened. |
| View | One way to inspect the model. |

The point is not to make a bigger document. The point is to keep product intent structured enough for humans to review and agents to build from.

## How the parts connect

A domain gives the model a boundary. It says which capability the team is talking about and which terms belong together.

A narrative follows one goal thread inside that boundary. It should not be a grab bag of features. If the scenes do not serve the same goal, the model is probably carrying two narratives.

A scene names an outcome. It is not just a screen. `Booking approved`, `Fan added to waitlist`, and `Payment recovery required` are scenes because each one leaves the product in a meaningful state.

A moment is the smallest behavior slice worth reviewing. It can be a command, query, reaction, or experience moment. The moment is where actors, rules, examples, visible content, and recorded facts become concrete.

Rules and examples keep the model honest. A rule says what decision must survive. An example shows a concrete case where reviewers can agree whether the rule is right.

Facts make the model durable across time. If a support view, dashboard, dispute, or workflow depends on something later, the model should say when that fact is captured.

## A compact example

```text
Domain: Peer-to-peer gear rental

Narrative: Renter books high-value gear

Scene: Booking approved

Moment: Owner approves renter
Type: Command

Rule: Owners can choose between competing requests before confirmation.

Example: Owner chooses between competing requests
Given Mara has two requests for the same weekend
And Theo offers a higher price with no review history
And Anika offers a lower price with strong reviews
When Mara approves Theo
Then Theo's request becomes the approved booking
And Anika's request is released or waitlisted
And the decision is recorded with the booking
```

This is a small slice of the product model. It names the capability, the goal thread, the outcome, the behavior slice, the decision to preserve, and the concrete proof.

## How to review the slice

The reviewer does not need to inspect implementation details. They can ask product questions:

- Is peer-to-peer gear rental the right domain boundary?
- Is booking high-value gear one goal thread, or should approval and payment be separate narratives?
- Is `Booking approved` a real outcome?
- Does owner choice belong in this moment?
- Is the rule explicit enough?
- Does the example cover the tradeoff the product needs to preserve?
- Should the product record why Mara chose Theo?

Those questions are the value of the model. They reveal missing decisions before the implementation has already filled them in.

## What stays out

The product model should not absorb every implementation detail.

It does not need database tables, framework choices, API shapes, deployment diagrams, or component internals unless those details change a product decision reviewers need to understand.

It should capture the decisions that matter to behavior: who can act, what outcome becomes true, what rule must hold, what example proves it, what fact is recorded, and what view needs to explain it.

That boundary keeps the model useful. It is precise enough to build from without becoming a second codebase.

## Model delta

Product models change as the product learns.

When a rental dispute reveals missing evidence, the model should change before the next implementation change.

```text
Model delta after the scratch dispute

Added:
- Rule: High-value gear requires timestamped condition photos at pickup.
- Moment: Confirm pickup condition.
- Fact: Pickup condition evidence recorded.
- Support view: Condition evidence visible during disputes.

Affected:
- Handover workflow
- Support workflow
- Privacy rules
- Storage policy
- Notification copy
```

The delta shows what changed and what else is affected. That is the difference between a correction buried in chat and a durable product decision.

## Product model vs event log

The product model defines what should happen and what facts must be captured.

The running product records what actually happened.

Replay only helps if the model told the product to capture the right facts. If pickup condition evidence was never modeled, the event log cannot invent it later.

## Why this matters for agents

AI agents can generate code quickly, but speed does not preserve intent.

The product model is the durable structure the next human or agent can inherit. It says what the product is supposed to do, what decisions matter, what examples prove those decisions, and what facts the product must remember.

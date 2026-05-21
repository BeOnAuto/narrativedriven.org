---
title: "Using NDD without Auto"
description: "Practice the Narrative-Driven Development taxonomy with any AI assistant or product team."
prev:
  text: "What is NDD?"
  link: /what-is-ndd
next:
  text: "Build the Concert Booking Platform"
  link: /guides/build-concert-platform
---

# Using NDD without Auto

You do not need Auto to use the NDD vocabulary.

Start with one behavior your team keeps getting wrong. Describe it as a domain, narrative, scene, moment, rule, and example. That gives you a clearer product story than another correction buried in chat.

## The smallest useful narrative {#quick-proof}

```text
Domain: Manage deals

Narrative: Sales rep follows up on active opportunities

Scene: Follow-up remains visible while deal stages change

Moment: Rep advances deal stage
Type: Command

Rule: Stage changes must not remove active follow-up reminders.

Example: Reminder survives stage advancement
Given a deal has stage "Discovery"
And the deal has an active follow-up reminder for tomorrow
When the rep changes the deal stage to "Proposal"
Then the deal stage is "Proposal"
And the follow-up reminder remains active
And the reminder is still visible on the deal detail screen
```

That is enough to change the conversation. The team is no longer relying on chat memory. It has a reviewed slice of product behavior to preserve.

## Use it with your current tools

Paste the plain-language narrative into your planning doc, issue tracker, or AI assistant:

```text
Use this NDD vocabulary to reason about the behavior.

Domain: Manage deals

Narrative: Sales rep follows up on active opportunities

Scene: Follow-up remains visible while deal stages change

Moment: Rep advances deal stage
Type: Command

Rule: Stage changes must not remove active follow-up reminders.

Example: Reminder survives stage advancement
Given a deal has stage "Discovery"
And the deal has an active follow-up reminder for tomorrow
When the rep changes the deal stage to "Proposal"
Then the deal stage is "Proposal"
And the follow-up reminder remains active
And the reminder is still visible on the deal detail screen

Review the behavior against this narrative. Point out missing rules,
ambiguous terms, unexplained screen content, and cases where a separate
outcome should become its own scene.
```

This is a lower-fidelity use of NDD than Auto. It is still useful because the taxonomy gives the work shape.

## What each line is doing

**Domain** is the product area.

**Narrative** is the goal thread inside that product area.

**Scene** is the outcome that becomes true.

**Moment** is the behavior slice that moves the scene forward.

**Type** tells reviewers what kind of moment they are looking at.

**Rule** is the intent the product must preserve.

**Example** is the concrete case that proves the rule.

## Iterate through the narrative

If the product changes, change the narrative first.

For example, if reminders should archive when a deal becomes Closed Won, add the new rule and example before changing the implementation:

```text
Rule: Closed deals archive active reminders.

Example: Reminder archives when deal is won
Given a deal has stage "Proposal"
And the deal has an active follow-up reminder
When the rep changes the deal stage to "Closed Won"
Then the follow-up reminder is archived
And the reminder no longer appears in the active reminder list
```

That is the smallest useful NDD loop: product intent changes first, implementation follows.

## When to use Auto {#when-to-use-auto}

Use NDD without Auto for one slice, a focused review, or a better prompt.

Use Auto when you want the productized workflow: model drafting, visual review, document review, collaboration, and AI-assisted implementation support.

[Practice NDD in Auto ->](https://on.auto)

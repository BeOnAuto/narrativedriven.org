---
title: Progressive Disclosure for Specs
prev:
  text: Narrative Review Views
  link: /explanation/one-model-three-views
next:
  text: Progressive Control
  link: /explanation/progressive-control
---

# Progressive Disclosure for Specs

![Narrative card with progressively expanded detail panels](/images/heroes/progressive-disclosure.png){.page-hero}

The hardest problem in describing real software is deciding how much detail to show at once.

Too little, and people miss important behavior. Too much, and review collapses into noise.

NDD uses progressive disclosure: start with the headline, reveal detail only when it helps the decision in front of you.

## The hierarchy is the disclosure path

The hierarchy gives reviewers a simple path from broad to specific:

| NDD level | What it answers |
| --- | --- |
| **Domain** | What business capability is this? |
| **Narrative** | What goal thread are we following? |
| **Scene** | What outcome becomes true? |
| **Moment** | What behavior slice moves the scene forward? |
| **Rule and example** | What must hold, and how do we know? |

That is enough structure for teams to review intent without starting from implementation details.

## Start broad

Early in the conversation, the team usually needs only the domain, narratives, and scenes.

They can ask:

- Is this the right product area?
- Are these the goals that matter?
- Are we missing an important outcome?
- Is any scene really just a screen or workflow?

## Drill down when behavior matters

When a scene becomes important, reveal the moments, rules, examples, and should statements.

That lets reviewers answer:

- What action or system response happens here?
- What must be true before and after?
- What examples prove the rule?
- What does the user see?
- What data needs an explained source?

The method stays lightweight because teams do not have to inspect every detail at once.

## Why this matters

Progressive disclosure keeps NDD usable by different readers.

Executives can discuss goals and outcomes. Product can review scenes. Design can review moments and interactions. QA can review examples. Engineering can ask whether the intent is precise enough to build.

The method stays focused on vocabulary and review.

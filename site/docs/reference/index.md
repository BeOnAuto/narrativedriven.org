---
title: "Reference: NDD vocabulary"
description: "Narrative-Driven Development vocabulary, moment types, rules, examples, and plain-language taxonomy."
---

# Reference: NDD vocabulary

![Reference cards for hierarchy, moment types, rules, examples, and glossary terms](/images/heroes/reference-index.png){.page-hero}

Use this section when you need to check a term, choose a moment type, or review the NDD vocabulary.

Narrative-Driven Development has an open taxonomy. Anyone can use the language of domains, narratives, scenes, moments, rules, examples, and assertions to describe software intent more clearly.

## Core hierarchy

**Domain**
: The business capability being modeled.

**Narrative**
: A goal thread inside the domain.

**Scene**
: A self-contained outcome achieved through one or more moments.

**Moment**
: A single behavior slice that moves a scene toward its outcome.

## Moment types

NDD uses four moment types:

- **Command**: something changes.
- **Query**: something is read or inspected.
- **React**: the system responds automatically.
- **Experience**: the user moves through the interface without a direct business-state change.

See [Moment Types](/reference/moment-types) for definitions and examples.

## Specification patterns

NDD uses two familiar ways to make behavior concrete:

- **Given/When/Then** examples for business rules.
- **Should statements** for component, service, and interaction expectations.

Example:

```text
Rule: Stage changes must not remove active follow-up reminders.

Given a deal has stage "Discovery"
And the deal has an active follow-up reminder for tomorrow
When the rep changes the deal stage to "Proposal"
Then the deal stage is "Proposal"
And the follow-up reminder remains active
```

## Reference pages

- [Moment Types](/reference/moment-types) - command, query, react, and experience.
- [Glossary](/reference/glossary) - the NDD terms in one place.

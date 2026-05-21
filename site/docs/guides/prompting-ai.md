---
title: Prompting AI with NDD Vocabulary
---

# Prompting AI with NDD Vocabulary

![Speech bubble holding a structured mini-narrative with goal label and dot section markers](/images/heroes/prompting-ai.png){.page-hero}

You can use NDD vocabulary with any AI assistant.

The point is to give your product thinking better shape: domain, narrative, scene, moment, rules, examples, and should statements.

## Start with the taxonomy

Use these words in your prompt:

- **Domain**: the business capability.
- **Narrative**: the goal thread.
- **Scene**: the outcome that becomes true.
- **Moment**: the behavior slice inside the scene.
- **Moment type**: command, query, react, or experience.
- **Rule**: what must hold.
- **Example**: a Given/When/Then case that proves the rule.

That vocabulary usually produces clearer output than asking for "features" or "screens."

## Starting from scratch

Prompt:

> I'm building a concert booking platform. Two actors: Promoter and Fan. The promoter lists shows, fans browse and book tickets, and the system manages waitlists when shows sell out. Describe this using NDD vocabulary: one domain, a few narratives, scenes named by outcomes, and moments with types. Keep it plain-language.

Good output should include:

- one domain, such as Concert Booking
- multiple narratives, such as Listing a Show and Getting Tickets
- scenes named by outcomes, such as Show published or Fan added to waitlist
- moments with types, such as Publish Show [Command] or Browse Available Shows [Query]

## Expanding a narrative

Prompt:

> I have a Getting Tickets narrative with a Tickets reserved scene. Add a sibling scene for when the show is sold out and the fan ends up on a waitlist. Treat that as a different outcome, not just an error message.

This pushes the assistant toward outcome thinking instead of a single happy path.

## Making rules concrete

Prompt:

> Add business rules and Given/When/Then examples for the Book Tickets moment. Cover capacity, sold-out shows, and duplicate booking attempts. Keep the examples readable by a product manager.

Good examples should make the rule inspectable:

```text
Rule: Tickets cannot be reserved beyond remaining capacity.

Given a show has 1 ticket remaining
When a fan tries to book 2 tickets
Then the booking is rejected
And no tickets are reserved
```

## Checking whether something is a scene

Prompt:

> The fan enters an invalid email when booking. Is this a separate scene or an incidental detail inside the Book Tickets moment? Apply the scene-worthiness rubric: outcome, discussion, actor impact.

The assistant should distinguish meaningful outcomes from ordinary validation detail.

## Checking screen content

Prompt:

> Review the Browse Available Shows moment. What visible fields need an explained product source? Are any fields unclear or ambiguous?

This keeps the review at the product level. It should surface questions like "where does remaining ticket count come from?" without requiring implementation structure.

## What good AI output looks like

- A single domain at the top.
- Narratives that represent coherent goal threads.
- Scenes named by outcomes, not screens.
- Moments that move scenes toward their outcomes.
- Moment types used consistently.
- Rules stated plainly.
- Given/When/Then examples for important behavior.
- Should statements for interface expectations.
- Screen content described in product terms.

## Common AI mistakes

The most common mistake is **collapsing the hierarchy**: treating a narrative as a domain or a moment as a scene. Push back: "Reason top-down. What's the business capability? What's the goal thread? What outcome becomes true?"

Watch for **scenes named after screens or workflows**: Checkout page, Booking flow. Push back: "Name the outcome, not the screen."

The AI sometimes **only models one outcome per narrative**. Ask: "What other outcomes can the actor reach?"

Sometimes the AI creates **scenes for ordinary validation errors**. Push back: "Does the actor end up in a meaningfully different state, or are they still in the same moment?"

Finally, check for **unexplained screen content**. Ask: "What product fact makes this field true?"

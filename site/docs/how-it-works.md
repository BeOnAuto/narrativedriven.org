---
title: How it Works
prev:
  text: What Makes a Narrative Buildable?
  link: /what-makes-a-narrative-buildable
next:
  text: For Practitioners
  link: /for-practitioners
---

# How NDD Works

![Prompt to narrative to review to running app](/images/heroes/how-it-works.png){.page-hero}

NDD changes the order of AI-assisted development.

Instead of going straight from prompt to code, you put a reviewable product narrative in the middle.

```text
Prompt
↓
Narrative
↓
Human review
↓
Implementation
↓
Running app
↓
Narrative update
```

## 1. Start with product intent

Describe the product in plain language.

```text
A concert booking app where promoters publish shows
and fans reserve tickets. If a show sells out, fans can
join a waitlist. If someone cancels, the next fan is promoted.
```

The prompt is the seed. It is not the source of truth.

## 2. Turn the prompt into a narrative

The narrative names the product structure:

- the domain
- the goals inside the domain
- the outcomes that matter
- the moments that move each outcome forward
- the rules and examples that preserve behavior
- the information each screen or query depends on

For the concert booking app, one goal is `A fan gets tickets`. That goal can lead to different outcomes: `Tickets reserved` or `Fan added to waitlist`.

## 3. Review the narrative before build

This is the important shift.

The team reviews intent before implementation. They can ask:

- Is this the right goal?
- Are any outcomes missing?
- Does the sold-out case become a real scene?
- Do the rules match the product?
- Does important screen content have an explained source?

Fixing these questions in the narrative is cheaper than discovering them in generated code.

## 4. Build from the right slice

The team should not treat the whole app as one blob.

For `Tickets reserved`, the relevant slice looks like this:

```text
Domain: Concert Booking
Narrative: Getting Tickets
Scene: Tickets reserved
Moments:
  - Browse Available Shows [Query]
  - Book Tickets [Command]
  - Booking Confirmed [Query]
Rules:
  - Tickets cannot be reserved beyond capacity
Examples:
  - Given 1 ticket remains, booking 2 tickets is rejected
What the product shows:
  - Available shows are promoter-published shows
  - Booking confirmation appears after a booking is accepted
```

That slice is specific enough to review and small enough to keep focused.

## 5. Keep the narrative alive

The narrative does not disappear after the first build.

When the app changes, update the narrative first. If cancellations should promote waitlisted fans, add the rule, example, and react moment to the narrative. Then implementation follows the new intent instead of trying to infer it from a correction in chat.

## How Auto fits

You can practice NDD by hand. Auto applies the method as a product: it helps turn your prompt into a draft narrative, gives you visual and document review surfaces, and supports AI-assisted implementation inside the product workflow.

[Practice NDD in Auto ->](https://on.auto)

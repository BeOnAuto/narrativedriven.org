---
title: How it Works
prev:
  text: Anatomy of a Product Model
  link: /explanation/anatomy-of-a-product-model
next:
  text: What Makes a Narrative Buildable?
  link: /what-makes-a-narrative-buildable
---

# How NDD Works

![Prompt to narrative to review to running app](/images/heroes/how-it-works.png){.page-hero}

NDD changes the order of AI-assisted development.

Instead of going straight from prompt to code, you put a reviewable product model in the middle.

```text
Prompt
↓
Draft product model
↓
Human review
↓
Implementation
↓
Runtime feedback
↓
Model update
```

## 1. Start with product intent

Describe the product in plain language.

```text
A concert booking app where promoters publish shows
and fans reserve tickets. If a show sells out, fans can
join a waitlist. If someone cancels, the next fan is promoted.
```

The prompt starts the work. It is not the source of truth.

## 2. Draft the product model

The draft model names the product structure:

- the domain
- the goals inside the domain
- the outcomes that matter
- the moments that move each outcome forward
- the rules and examples that preserve behavior
- the information each screen or query depends on

For the concert booking app, one goal is `A fan gets tickets`. That goal can lead to different outcomes: `Tickets reserved` or `Fan added to waitlist`.

The narrative is the readable surface of this model.

## 3. Review the model before build

This is the important shift.

The team reviews intent before implementation. They can ask:

- Is this the right goal?
- Are any outcomes missing?
- Does the sold-out case become a real scene?
- Do the rules match the product?
- Does important screen content have an explained source?

Fixing these questions in the model is cheaper than discovering them in generated code.

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

Code follows the reviewed model. If the model is vague, the implementation will fill gaps with guesses.

## 5. Feed runtime pain back into the model

The model does not disappear after the first build.

When the app changes, update the model first. If cancellations should promote waitlisted fans, add the rule, example, and react moment to the model. Then implementation follows the new intent instead of trying to infer it from a correction in chat.

Runtime pain becomes durable structure when the model changes first.

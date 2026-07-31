---
title: "What is Narrative-Driven Development?"
description: "A 5-minute overview of NDD: the problem it solves, the taxonomy, and how to start using it."
next:
  text: "Anatomy of a Product Model"
  link: /explanation/anatomy-of-a-product-model
---

# What is Narrative-Driven Development?

Narrative-Driven Development is a product modeling method for AI-built software.

It creates a durable product model.

The narrative is the human-readable surface of that model: domains, goals, outcomes, moments, rules, examples, and reviewable product facts held together before code exists.

## The problem

Chat is useful for starting. It is weak at preserving intent.

As you iterate, important decisions get scattered:

- why a screen exists
- which behavior must not regress
- what happens in failure cases
- where screen content comes from
- which rule should survive the next change

The implementation can still move forward, but the source of product truth becomes unclear. NDD turns product pain into durable product structure.

## The method

NDD gives teams a taxonomy for preserving intent in a product model:

- the domain being modeled
- the goals users are trying to achieve
- the outcomes that become true
- the moments where behavior happens
- the rules the product must preserve
- the examples that prove those rules
- the product facts and visible information reviewers should agree on

## The hierarchy

NDD models software in four progressive layers:

**DOMAIN - the product area.**
Example: "Manage deals" in a CRM.

**NARRATIVE - the journey or goal inside the domain.**
Example: "Sales rep follows up on active opportunities."

**SCENE - the outcome that becomes true.**
Example: "Follow-up remains visible while deal stages change."

**MOMENT - the interaction, rule, or behavior that makes the outcome happen.**
Example: "Rep advances deal stage."

Each moment can carry rules, examples, should statements, links to related outcomes, and the product facts that matter to reviewers. It can also explain important screen content.

<figure class="ndd-hierarchy-figure" aria-label="NDD hierarchy tree">
  <ol class="ndd-hierarchy-tree">
    <li class="ndd-hierarchy-node ndd-hierarchy-node--domain">
      <span class="ndd-hierarchy-tag">Domain</span>
      <span class="ndd-hierarchy-text">Manage deals</span>
      <ol>
        <li class="ndd-hierarchy-node ndd-hierarchy-node--narrative">
          <span class="ndd-hierarchy-tag">Narrative</span>
          <span class="ndd-hierarchy-text">Sales rep follows up on active opportunities</span>
          <ol>
            <li class="ndd-hierarchy-node ndd-hierarchy-node--scene">
              <span class="ndd-hierarchy-tag">Scene</span>
              <span class="ndd-hierarchy-text">Follow-up remains visible while deal stages change</span>
              <ol>
                <li class="ndd-hierarchy-node ndd-hierarchy-node--moment">
                  <span class="ndd-hierarchy-tag">Moment</span>
                  <span class="ndd-hierarchy-text">Rep advances deal stage</span>
                </li>
              </ol>
            </li>
          </ol>
        </li>
      </ol>
    </li>
  </ol>
</figure>

## Where behavior gets precise

A rule defines what must hold. An example demonstrates it.

```text
Rule: Stage changes must not remove active follow-up reminders.

Given a deal has stage "Discovery"
And the deal has an active follow-up reminder for tomorrow
When the rep changes the deal stage to "Proposal"
Then the deal stage is "Proposal"
And the follow-up reminder remains active
```

That is the shift: the team is not relying on chat memory. It is reviewing a named rule and concrete example inside a durable product model.

## What the model contains

A useful NDD model contains enough product decisions for a human or agent to build without inventing the important parts:

- actors and terms the product uses
- goals and outcomes
- behavior slices with moment types
- rules and examples
- important facts the product must capture
- views that let different readers inspect the same model

The narrative makes that model readable. It is not a transcript of a conversation. It is the reviewed structure the next change should inherit.

## Where to start

1. See the shape: [Anatomy of a Product Model ->](/explanation/anatomy-of-a-product-model)
2. Read the beginner example: [Build the Concert Booking Platform ->](/guides/build-concert-platform)
3. Inspect the serious example: [Model the Lens Rental Marketplace ->](/guides/lens-rental-marketplace)
4. Try one slice with your existing tools: [Use NDD with existing tools ->](/using-ndd-without-auto.html)

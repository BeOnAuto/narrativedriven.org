---
title: "What is Narrative-Driven Development?"
description: "A 5-minute overview of NDD: the problem it solves, the taxonomy, and how to start using it."
next:
  text: "Build the Concert Booking Platform"
  link: /guides/build-concert-platform
---

# What is Narrative-Driven Development?

Narrative-Driven Development is a product modeling method for AI-built software.

It turns product intent into a durable narrative that humans can review before build.

## The problem

Chat is useful for starting. It is weak at preserving intent.

As you iterate, important decisions get scattered:

- why a screen exists
- which behavior must not regress
- what happens in failure cases
- where screen content comes from
- which rule should survive the next change

The implementation can still move forward, but the source of product truth becomes unclear.

## The method

NDD gives teams a taxonomy for preserving intent:

- the goals users are trying to achieve
- the outcomes that become true
- the moments where behavior happens
- the rules the product must preserve
- the examples that prove those rules
- the information reviewers should agree on

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

Each moment can carry rules, examples, should statements, and links to related outcomes. It can also explain important screen content.

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

That is the shift: the team is not relying on chat memory. It is reviewing a named rule and concrete example.

## Where to start

1. Read the canonical example: [Build the Concert Booking Platform ->](/guides/build-concert-platform)
2. Try one slice with your existing tools: [Use NDD with existing tools ->](/using-ndd-without-auto.html)
3. Learn what makes a narrative buildable: [What Makes a Narrative Buildable? ->](/what-makes-a-narrative-buildable)

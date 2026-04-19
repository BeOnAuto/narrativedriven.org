---
title: Structuring Domains, Narratives, and Scenes
---

# Structuring Domains, Narratives, and Scenes

You know what domains, narratives, scenes, and moments are. Now the hard part: deciding how to structure them. When does an outcome deserve its own scene? When is a goal coherent enough to be its own narrative? When is a detail just incidental, something that belongs inside a moment's business specs rather than as a separate scene?

NDD is outcome-centred at every level. Reasoning top-down keeps you out of trouble.

## Start with the Domain

The domain is the business capability area you're modelling. Pick a coherent business name, not a screen group, not a technical module. "Concert Booking," "Team Timesheet Management," "Identity and Access." One workspace = one domain.

Capture at the domain level:
- The capability statement — one sentence about what this business area does
- The actors — humans and systems involved
- The entities — the nouns those actors interact with

Everything below the domain reuses these. If you find yourself adding new actors and entities mid-way down, ask whether you've crossed into a different domain.

## Narratives: Goal Threads

A narrative is a cohesive thread of related scene outcomes that together fulfil a broader user or business goal within the domain. Think of it as a job to be done, not a feature.

Ask: **"Whose broader goal does this thread serve, and what does success look like?"**

In Concert Booking, three narratives stand out: "Listing a Show" (the promoter's goal — a published, bookable show exists), "Getting Tickets" (the fan's goal — tickets are reserved or the fan is on the waitlist), and "Managing Your Booking" (the fan's goal — booking state stays correct after the fact).

Each narrative groups related outcomes. They share actors and entities at the domain level but each has its own arc and its own broader goal.

A narrative should not mix unrelated concerns. If the scenes you're listing under a narrative don't all serve the same broader goal, split them.

## Scenes: Outcomes

A scene is a self-contained outcome. One thing becomes true. Use outcome-complete phrasing in the name.

Good: "Tickets reserved." "Fan added to waitlist." "Booking cancelled." "Timesheet submitted."
Bad: "Booking screen." "Ticket flow." "Submitted and validated."

Every scene should be:
- Outcome-centred — names a single thing that becomes true
- Concrete — could be drawn, demoed, or described unambiguously
- Independently understandable — readable on its own without context from another scene
- Verifiable — you could write a test that asserts the outcome

### The Scene-Worthiness Rubric

When you're sitting on a candidate that *might* be a scene, apply these three tests.

**1. The Outcome Test**

Is this a distinct outcome that can be observed or verified independently? Something *becomes true* here that you could check.

"Fan added to waitlist" — yes. There's a fact (a waitlist entry exists, with a position) that you could query and assert.

"Email field validated" — no. Nothing meaningful has *become true* in the actor's world. The form is still being filled out.

**2. The Discussion Test**

Would this outcome warrant its own conversation in a collaborative session? Would multiple stakeholders have opinions, business rules to discover, edge cases to negotiate?

"Waitlist promotion confirmed" — yes. Notification logic, promotion order, timing, email content. Product, support, and engineering all have opinions.

"Date field is empty" — no. A developer handles that solo.

**3. The Actor Impact Test**

After this outcome, is the actor in a meaningfully different state? Different status, different options, different expectations going forward?

"Fan added to waitlist" vs "Tickets reserved" — yes. Different status, different next moves, different system treatment.

"Credit card declined, retry on same screen" — usually no. The actor is still on the same screen with the same options.

### How to score

Three yeses → definitely a scene. None → incidental detail (stays in business specs). Mixed → lean toward incidental and promote to a scene later if needed. Scenes are portable; you can refactor and move them, just like code.

## Transitions: How Scenes Connect

Scenes don't exist in isolation. A moment in one scene can lead into the start of another scene whose outcome is different. Think of it as the moment that triggers the next outcome.

The rules are simple. A moment can have an exit point that leads to another scene. The exit always leads to the *beginning* of the target scene, never mid-way. The target scene can be in the same narrative or a different one. Each scene establishes its own context and tells a complete story.

In Concert Booking, the "Book Tickets" moment in the Getting Tickets narrative is an exit point. If the show has capacity, that moment leads into "Tickets reserved." If sold out, the same moment leads into "Fan added to waitlist." Both targets are scenes — both have their own outcomes — and the model captures both as first-class.

Data completeness maintains the thread between scenes. The next scene's first moment references events from the previous scene (or from other narratives) in its Given steps. The connection is through the data, not through structural entry points.

## Incidental Detail: What Stays Inside a Moment

Not everything is a scene. Business specs within a moment handle the variations that don't change the actor's trajectory: validation rules (invalid email, missing required fields), edge cases within a single interaction (already published, duplicate submission), error states that return the actor to the same screen (network timeout, retry). These belong as additional Given/When/Then examples within the moment's business specs. They capture the rules at that point without inventing new outcomes.

The "already published" rejection in the Publish Show moment is a good example. It's a business rule, not a new outcome. The promoter sees an error and stays on the same screen. That's an additional example in the moment, not a new scene.

## Putting It Together

1. Name the domain. Capture the capability, actors, and entities.
2. Identify the narratives — the broader goal threads within the domain.
3. For each narrative, list the scene outcomes that fulfil it. Outcomes, not paths.
4. For each scene, list the moments that move it to its outcome. Each moment has a type and specs.
5. Identify transitions — moments that lead into the start of another scene.
6. Check data completeness across all narratives.
7. Push validation rules and incidental edge cases into the moment's business specs, not new scenes.

Don't expect to get it right the first time. Move scenes between narratives if they fit better elsewhere. Promote business specs to scenes when an edge case turns out to be its own outcome. The model is fluid, and that's the point.

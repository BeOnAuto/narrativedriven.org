---
title: Structuring Narratives and Scenes
---

# Structuring Narratives and Scenes

You know what narratives, scenes, and moments are. Now the hard part: deciding how to structure them. When is something a new narrative? When does an alternative path deserve its own scene? When is a detail incidental — something that belongs inside a moment's business specs rather than as a separate scene?

## Narratives: The Big Stories

A narrative describes how actors and entities interact through time. Start by identifying the distinct stories your application tells.

Ask: **"Who is involved, and what outcome are they trying to achieve?"**

In the concert booking example, there are three distinct stories:

- **"Listing a Show"** — The promoter's journey from blank form to live listing
- **"Getting Tickets"** — The fan's journey from browsing to booking
- **"Managing Your Booking"** — What happens after the ticket is booked

Each narrative introduces new entities, new actors, or new phases of the lifecycle. "Listing a Show" introduces the Show entity and its draft/published states. "Getting Tickets" introduces the Booking entity and ticket capacity. They're distinct stories even though they share the Show entity.

A narrative can span multiple actors. A narrative can also have a single scene — not every story has alternative paths. "Listing a Show" has one scene (the happy path). That's fine. Don't force branching where it doesn't exist.

## Scenes: The Paths Within

Every narrative starts with a happy-path scene — the straight line from start to finish where everything goes right. Alternative scenes branch off when the actor's journey takes a meaningfully different direction.

The key word is **meaningfully**. Not every edge case deserves its own scene. Use this rubric:

### The Scene-Worthiness Rubric

**1. The Storyboard Test**

Would you draw this as a separate panel in a storyboard? If someone were sketching the user journey on a whiteboard, would this branch get its own sequence of drawings — or would it be a footnote on an existing panel?

"Fan tries to book but the show is sold out" — yes, that's a different panel. The fan sees a waitlist button instead of a book button. Different screen, different experience, different outcome.

"Fan enters an invalid email address" — no. That's a validation message on the same screen. Same panel, small annotation.

**2. The Discussion Test**

Would this branch warrant its own conversation in a collaborative modeling session? If you gathered your team to discuss this path, would multiple people have opinions about what should happen? Would there be business rules to discover?

"What happens when a booking is cancelled and someone is on the waitlist?" — yes. That involves notification logic, promotion order, timing, email content. Multiple people care.

"What happens when the date field is empty?" — no. A developer handles that solo. It's a component-level validation.

**3. The Actor Impact Test**

Does the actor's journey fundamentally change? After this branch point, is the actor in a meaningfully different situation — seeing different screens, having different options, expecting different outcomes?

"Fan is waitlisted instead of confirmed" — yes. Their status is different, their expectations are different, the system behaves differently toward them going forward.

"Fan's credit card is declined" — maybe. If there's a retry flow with different options, it could be a scene. If it's just "try again," it's incidental.

### When in Doubt

If you're unsure, start with it as a business spec within the moment. You can always promote it to a scene later. Scenes are portable — you can refactor and move them, just like you refactor code. It's never perfect the first time.

## Branching: How Scenes Connect

A scene branches from a specific moment. At that moment, the actor's journey could go one of two ways. Think of it like a "choose your own adventure" book: at a decision point, the story forks.

**The rules:**

- A moment can have an **exit point** that leads to another scene
- The exit always leads to the **beginning** of the target scene, never mid-way
- The target scene can be in the **same narrative** or a **different one**
- Each scene is **self-contained** — it establishes its own context and tells a complete story

In the concert booking example:

- "Getting Tickets" Scene 1 (happy path) has the **Book Tickets** moment
- That moment is the exit point: if the show has capacity, the story continues in Scene 1 (confirmed). If the show is sold out, it branches to Scene 2 (waitlisted)
- Scene 2 starts fresh — it establishes the context (sold-out show, fan attempting to book) and tells its own story

Data completeness maintains the thread between scenes. Scene 2's first moment references events from Scene 1 (or from other narratives) in its Given steps. The connection is through the data, not through structural entry points.

## Incidental Detail: What Stays Inside a Moment

Not everything is a scene. Business specs within a moment handle the variations that don't change the actor's trajectory:

- Validation rules (invalid email, missing required fields)
- Edge cases within a single interaction (already published, duplicate submission)
- Error states that return the actor to the same screen (network timeout, retry)

These belong as additional Given/When/Then examples within the moment's business specs. They illustrate the rules at that point without creating a new path through the narrative.

The "already published" rejection in the Publish Show moment is a good example. It's a business rule, not a journey. The promoter sees an error and stays on the same screen. That's an additional example in the moment, not a new scene.

## Putting It Together

Start with narratives: identify the big stories and who's in them. Then sketch the happy path for each as a single scene. Walk through it moment by moment. When you feel a fork — when the actor's experience could go in a fundamentally different direction — that's a candidate for a new scene. Apply the rubric. If it passes, create the scene. If not, capture it as a business spec within the moment.

Iterate. Refactor. Move scenes between narratives if they fit better elsewhere. The model is fluid until it isn't, and even then, it can change.

---

*A [spec dialect](https://specdriven.com/dialects/narrative-driven) by the [Auto](https://on.auto) team.*

---
title: What Is NDD?
next:
  text: Your First Narrative
  link: /guides/first-narrative
---

# What Is Narrative-Driven Development?

Narrative-Driven Development (NDD) is a collaborative modeling technique where humans and AI describe software through storytelling. You model your application as a sequence of moments through time, told from the perspective of the people who use it.

That narrative isn't a document. It's a structured model. It renders as storyboards, rich documents, and code, all projections of the same underlying model. Change one, the others update.

When used with the [Auto](https://on.auto) platform, your narratives compile into executable specifications that drive code generation, testing, and verification. The specification IS the test.

## Why Storytelling?

Your brain is wired for stories. You can detect when a story has a gap, when the sequence doesn't make sense, when something's missing. That's not a metaphor. It's a cognitive fact.

Traditional specification approaches fight this wiring. They scatter information across user stories, Jira tickets, architecture diagrams, and Slack threads. Each fragment makes sense in isolation. Together, they're incoherent.

NDD works with your wiring instead of against it. You tell the story of how a user interacts with your system, moment by moment. When the story has a gap, you feel it. When it's complete, you know it.

[Why storytelling works in depth →](/explanation/why-storytelling)

## The Structure: Narratives, Scenes, Moments

NDD borrows its structure from filmmaking and organizes software into three levels:

### Narratives

A narrative is the top-level unit. It describes how actors and entities interact through time, their attributes, behaviours, and the outcomes of those interactions. A narrative can span multiple actors. Think of it like a chapter in a comic book: the cover shows who's involved and what's at stake. "Listing a Show" is one narrative (Promoter-focused). "Getting Tickets" is another (Fan-focused). "Managing Your Booking" is a third (Fan and System). Each narrative has a name, description, and storyboard image.

### Scenes

A scene is a path within a narrative. If the narrative is the story, scenes are the branches, the different ways it can unfold. Every narrative starts with a happy-path scene. Alternative scenes branch off when the actor's journey diverges: the show is sold out, the booking gets cancelled, the waitlist kicks in.

Scenes can branch from a specific moment. When a moment has an exit point, it leads to the beginning of another scene, in the same narrative or even a different one. Scenes are always entered from the beginning, never mid-way. This keeps each scene self-contained and readable on its own.

In the document view, each scene becomes its own page. In the visual view, scenes appear as a filmstrip with branch lines connecting them.

### Moments

A moment is a single point in time within a scene. It's the atomic unit of NDD. Something happens: a user submits a form, the system fetches data, an automated process fires. A moment can also be an exit point, the place where the story branches to an alternative scene.

Every moment has a type:

| Moment type    | What happens                               | Example                 |
| -------------- | ------------------------------------------ | ----------------------- |
| **Command**    | Actor triggers a state change              | "Book Tickets"          |
| **Query**      | Actor receives data                        | "Browse available shows"|
| **React**      | System responds automatically              | "Promote from waitlist" |
| **Experience** | UI interaction (navigation, notifications) | "Navigate to dashboard" |

Each moment carries specifications. Interaction specs describe what the user sees and does. Business specs describe the domain rules with concrete examples. Command and query moments have both. Experience moments only have interaction specs. React moments only have business specs.

[Full glossary →](/reference/glossary) | [Moment types reference →](/reference/moment-types)

## Data Completeness

Every piece of state visible in your system must trace back through events to the commands that caused it. Nothing appears from nowhere.

If a screen shows "Fan booking status," the state it renders must come from events (`TicketsReserved`, `AddedToWaitlist`), and those events must come from a prior command moment (`Book Tickets`). That's an entire class of bugs eliminated before code exists.

[Data completeness in depth →](/explanation/data-completeness)

## One Model, Three Views

NDD is model-based. At its core is a Zod schema, JSON under the hood. Everything else is an interface into it.

The visual view is a canvas with narrative cards, scene filmstrips, and wireframe thumbnails. The document view is a Notion-like block editor, one page per scene, with rich text and structured moment blocks containing specs. The code view is a Monaco editor with the TypeScript DSL, full type safety and IntelliSense.

Edit in any view. The model updates. The other views reflect the change.

[One model, three views in depth →](/explanation/one-model-three-views)

## Where NDD Comes From

NDD originated at [Xolvio](https://xolvio.com) through years of enterprise client engagements. The team tried every agile methodology. None solved scattered requirements. So they framed requirements as stories. Delivery got faster. Quality went up. What took years started taking months.

It evolved from a facilitation technique into a model-based approach as the world shifted to remote work and AI. The workshop didn't disappear. The model absorbed it.

NDD draws on BDD (Given/When/Then), EventStorming (collaborative domain discovery), Specification by Example (concrete examples), Domain-Driven Design (ubiquitous language), and User Story Mapping (journey-based organization).

[Origin story →](/explanation/origin-story) | [Standing on shoulders →](/explanation/standing-on-shoulders)

## A Spec Dialect by Auto

NDD is a **spec dialect**: a structured, schema-backed specification language built for applications with real users and real stakes. It's part of the [spec-driven development](https://specdriven.com) movement and the first dialect with a model-based architecture, multimodal views, and executable specifications.

[NDD as a spec dialect →](/explanation/spec-dialect) | [NDD on specdriven.com →](https://specdriven.com/dialects/narrative-driven)

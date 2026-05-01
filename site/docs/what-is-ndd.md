---
title: What Is NDD?
next:
  text: Your First Narrative
  link: /guides/first-narrative
---

# What Is Narrative-Driven Development?

Narrative-Driven Development (NDD) is a collaborative modelling technique where humans and AI describe software through storytelling. You model your application as a sequence of moments through time, told from the perspective of the people who use it.

That narrative isn't a document. It's a structured model. It renders as storyboards, rich documents, and code, all projections of the same underlying model. Change one, the others update.

When used with the [Auto](https://on.auto) platform, your narratives compile into executable specifications that drive code generation, testing, and verification. The specification IS the test.

## Why Storytelling?

Your brain is wired for stories. You can detect when a story has a gap, when the sequence doesn't make sense, when something's missing. That's not a metaphor. It's a cognitive fact.

Traditional specification approaches fight this wiring. They scatter information across user stories, Jira tickets, architecture diagrams, and Slack threads. Each fragment makes sense in isolation. Together, they're incoherent.

NDD works with your wiring instead of against it. You tell the story of how a user interacts with your system, moment by moment. When the story has a gap, you feel it. When it's complete, you know it.

[Why storytelling works in depth →](/explanation/why-storytelling)

## The Structure: Domain, Narrative, Scene, Moment

NDD organises every system into four levels. Each level has one job:

```
Domain (business capability)
└── Narrative (goal thread)
    └── Scene (single outcome)
        └── Moment (single step toward that outcome)
```

### Domain

The top-level model. A coherent business capability area that groups related narratives sharing the same core concepts, rules, and outcomes. One workspace = one domain. Examples: Billing, Scheduling, Identity and Access, Concert Booking. The domain holds the actors, entities, and capability statement that every narrative within it shares.

A domain answers: *what business area are we in?*

### Narrative

A cohesive thread of related scenes that together fulfil a broader user or business goal within a domain. Narratives are larger than a single outcome but smaller than the whole business area. Within Concert Booking, three narratives might be "Listing a Show," "Getting Tickets," and "Managing Your Booking." Each is a goal thread with its own arc, actors, and chain of outcomes.

A narrative answers: *what broader goal is being fulfilled?*

### Scene

A self-contained outcome achieved through one or more moments. This is the structural unit you'll spend most of your time in. A scene names a single thing that becomes true: "Show published," "Tickets reserved," "Fan added to waitlist," "Booking cancelled." Each scene is independently understandable and independently verifiable.

A scene answers: *what single outcome is being achieved?*

### Moment

A single interaction or system step that moves a scene toward its outcome. Each moment has a type (command, query, react, or experience) and carries the specifications that make the outcome verifiable.

| Moment type    | What happens                               | Example                 |
| -------------- | ------------------------------------------ | ----------------------- |
| **Command**    | Actor triggers a state change              | "Book Tickets"          |
| **Query**      | Actor receives data                        | "Browse available shows"|
| **React**      | System responds automatically              | "Promote from waitlist" |
| **Experience** | UI interaction (navigation, notifications) | "Navigate to dashboard" |

Each moment carries specifications. Interaction specs describe what the user sees and does. Business specs describe the domain rules with concrete examples. Command and query moments have both. Experience moments only have interaction specs. React moments only have business specs.

A moment answers: *what step happens here?*

[Full glossary →](/reference/glossary) | [Moment types reference →](/reference/moment-types)

## Outcomes All the Way Down

NDD is outcome-centred. Different levels own different scopes of outcome:

- **Scene outcome** — the direct, immediate result ("Tickets reserved")
- **Narrative outcome** — the broader goal achieved through multiple scene outcomes ("Fan successfully books and manages a show")
- **Domain outcome space** — the family of related outcomes the business capability enables ("Concert booking works end to end")

Don't conflate them. Scenes don't try to do the work of narratives. Moments aren't mistaken for outcomes.

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

NDD draws on BDD (Given/When/Then), EventStorming (collaborative domain discovery), Specification by Example (concrete examples), Domain-Driven Design (the domain itself, ubiquitous language), and User Story Mapping (journey-based organisation).

[Origin story →](/explanation/origin-story) | [Standing on shoulders →](/explanation/standing-on-shoulders)

## A Spec Dialect by Auto

NDD is a **spec dialect**: a structured, schema-backed specification language built for applications with real users and real stakes. It's part of the [spec-driven development](https://specdriven.com) movement and the first dialect with a model-based architecture, multimodal views, and executable specifications.

NDD is one of the few dialects in the current wave to keep specs executable rather than regressing to prose. The wider [executability gap on the spec-driven landscape](https://specdriven.com/landscape/#the-executability-gap) tracks this directly.

[NDD as a spec dialect →](/explanation/spec-dialect) | [NDD on specdriven.com →](https://specdriven.com/dialects/narrative-driven)

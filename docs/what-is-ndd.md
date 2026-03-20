---
title: What Is NDD?
---

# What Is Narrative-Driven Development?

Narrative-Driven Development (NDD) is a collaborative modeling technique that brings together multiple human stakeholders and AI collaborators to describe software through storytelling. You model your application as a narrative, a sequence of moments through time, told from the perspective of the people who use it.

That narrative isn't a document. It's a structured model. It renders visually as storyboards, textually as rich documents, and programmatically as code. All three are projections of the same underlying model. Change one, the others update.

When used with the [Auto](https://on.auto) platform, your narratives compile into executable specifications, which then drive AI-code generation, testing, and verification. The specification IS the test.

## Why Storytelling?

Your brain is wired for stories. You can detect when a story has a gap, when the sequence doesn't make sense, when something is missing. That's not a metaphor. It's a cognitive fact.

Traditional specification approaches fight this wiring. They scatter information across user stories, Jira tickets, architecture diagrams, and Slack threads. Each fragment makes sense in isolation. Together, they tell an incoherent story.

NDD works with your wiring instead of against it. You tell the story of how a user interacts with your system, moment by moment, through time. When the story has a gap, you feel it. When the story is complete, you know it.

[Why storytelling works in depth →](/explanation/why-storytelling)

## The Structure: Narratives, Scenes, Moments

NDD organizes software into three levels, borrowed from filmmaking:

### Narratives

A narrative is the top-level user journey. It's the whole story: "A producer schedules and publishes a show" or "A patron browses and books seats." Each narrative has a name, a description, and a storyboard image.

### Scenes

A scene is a chapter within a narrative. If the narrative is the movie, a scene is an act. "Schedule and Publish Show" is one scene. "Browse and Book Seats" is another. Each scene has its own storyboard image and contains a sequence of moments.

In the document view, each scene becomes its own page. In the visual view, scenes show their moments as a filmstrip, left to right.

### Moments

A moment is a single point in time within a scene. It's the atomic unit of NDD. Something happens: a user submits a form, the system fetches data, an automated process fires.

Every moment has a type:

| Moment type    | What happens                               | Example                 |
| -------------- | ------------------------------------------ | ----------------------- |
| **Command**    | User triggers a state change               | "Book Seats"            |
| **Query**      | Actor receives data                        | "Browse available shows"|
| **React**      | System responds automatically              | "Promote from waitlist" |
| **Experience** | UI interaction (navigation, notifications) | "Navigate to dashboard" |

Each moment carries two kinds of specifications:

**Interaction specs** describe what the user sees and does, using `describe/it/should` patterns: "Show scheduling form: it should show fields for title, date, venue."

**Business specs** describe the domain logic, using `Given/When/Then` with commands, events, and state: "Given Show with status Draft, When PublishShow, Then ShowPublished."

Command and query moments have both. Experience moments have only interaction specs. React moments have only business specs.

[Full glossary →](/reference/glossary) | [Moment types reference →](/reference/moment-types)

## Data Completeness

One of NDD's distinguishing principles: every piece of state visible in your system must trace back through events to the commands that caused it. Nothing appears from nowhere.

If a screen shows "Patron booking status," the state it renders must come from events (`SeatsReserved`, `AddedToWaitlist`), and those events must come from a prior command moment (`Book Seats`). An entire class of bugs eliminated before code exists.

[Data completeness in depth →](/explanation/data-completeness)

## One Model, Three Views

NDD is fundamentally model-based. At its core is a Zod schema. The model is JSON under the hood. Everything else is an interface into it.

**Visual view:** A canvas with narrative cards, scene filmstrips, and wireframe thumbnails. Think storyboard.

**Document view:** A Notion-like block editor, one page per scene. Rich text with structured moment blocks containing specs.

**Code view:** A Monaco editor with the TypeScript DSL. Full type safety and IntelliSense.

Edit in any view. The model updates. The other views reflect the change.

[One model, three views in depth →](/explanation/one-model-three-views)

## Where NDD Comes From

NDD originated at [Xolvio](https://xolvio.com) through years of enterprise client engagements. The team tried every agile methodology. None solved scattered requirements. So they framed requirements as stories. Delivery accelerated. Quality increased. What took years now took months.

NDD evolved from a facilitation technique into a model-based approach as the world shifted to remote work and AI. The workshop didn't disappear. The model absorbed it.

It synthesizes patterns from BDD (Given/When/Then), EventStorming (collaborative domain discovery), Specification by Example (concrete examples), Domain-Driven Design (ubiquitous language), and User Story Mapping (journey-based organization).

[Origin story →](/explanation/origin-story) | [Standing on shoulders →](/explanation/standing-on-shoulders)

## A Spec Dialect by Auto

NDD is a **spec dialect**: a structured, schema-backed specification language purpose-built for line-of-business web applications. It's part of the broader [spec-driven development](https://specdriven.com) movement and the first full dialect with a model-based architecture, multimodal accessibility, and executable specifications.

[NDD as a spec dialect →](/explanation/spec-dialect) | [NDD on specdriven.com →](https://specdriven.com/dialects/narrative-driven)

## Get Started

**Learn NDD:** [10-minute quickstart →](/guides/first-narrative) or [full Theater Booking walkthrough →](/guides/build-theater-platform)

**Try it:** [Auto platform waitlist →](https://accounts.on.auto/waitlist) or [Auto Engineer on GitHub →](https://github.com/BeOnAuto/auto-engineer)

**Go deeper:** [Why storytelling →](/explanation/why-storytelling) | [Data completeness →](/explanation/data-completeness) | [Origin story →](/explanation/origin-story)

---

_A [spec dialect](https://specdriven.com/dialects/narrative-driven) by [Auto](https://on.auto). Part of the [spec-driven](https://specdriven.com) movement._

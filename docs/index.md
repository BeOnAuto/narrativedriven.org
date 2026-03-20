---
layout: home
hero:
  name: Narrative-Driven Development
  text: Tell the story. Build the software.
  tagline: A collaborative modeling technique that uses storytelling to bring order to software delivery. One model. Three views. Everyone works from the same source of truth.
  actions:
    - theme: brand
      text: What is NDD?
      link: /what-is-ndd
    - theme: alt
      text: Try it on Auto
      link: https://on.auto
features:
  - icon:
      src: /images/features/feat-stories.png
    title: Think in Stories, Not Prompts
    details: "Your software is a story. Narratives, scenes, and moments capture what happens, to whom, through which interface, and what the system does in response."
    link: /what-is-ndd
  - icon:
      src: /images/features/feat-three-views.png
    title: One Model, Three Views
    details: "Designers see storyboards. Developers see TypeScript. Product managers see documents. All three are projections of the same model. Change one, the others update."
    link: /explanation/one-model-three-views
  - icon:
      src: /images/features/feat-ai-collaborator.png
    title: AI as Collaborator
    details: "The SDLC is compressing. NDD is the medium that lets humans and AI agents contribute to the same coherent model, synchronously or asynchronously."
    link: /explanation/why-storytelling
  - icon:
      src: /images/features/feat-data-completeness.png
    title: Data Completeness
    details: "Every piece of state traces back through events to commands. Nothing appears from nowhere. NDD catches an entire class of bugs that other approaches miss."
    link: /explanation/data-completeness
  - icon:
      src: /images/features/feat-spec-dialect.png
    title: A Spec Dialect
    details: "NDD extends BDD's Given/When/Then into a unified model that serves visual, document, and code audiences. Part of the spec-driven movement."
    link: /explanation/spec-dialect
  - icon:
      src: /images/features/feat-running-code.png
    title: From Story to Running Code
    details: "With the Auto platform, narratives flow through a pipeline that generates production-ready, fully-tested code. Not vibe coding. Deterministic verification."
    link: /guides/narratives-to-code
---

## The Chaos Problem

Five people on your team. Each using AI to work faster. Everyone is individually productive. But collectively? Chaos.

The PRD says one thing. The Figma file implies another. The Jira ticket captures a third interpretation. The developer's mental model is a fourth. And the AI cheerfully implements whichever fragment it sees first.

You don't have a productivity problem. You have a coherence problem.

## The NDD Answer

Narrative-Driven Development is a collaborative modeling technique that uses storytelling as the medium for describing software. Instead of scattering decisions across dozens of tools and conversations, you build a single model that everyone contributes to.

A **narrative** tells the complete user journey. It breaks into **scenes**, each a coherent chapter. Scenes unfold through **moments**: concrete points in time where something happens. A user submits a form (command), views their dashboard (query), the system sends a notification (react), or the user navigates to the next page (experience).

Each moment carries specifications. Interface specs describe what the UI should do. Business specs define the rules with concrete Given/When/Then examples. Together, they form a complete, verifiable picture of your software.

## Who Is This For?

NDD is for entire teams building line-of-business applications. Not just developers. Not just designers. Not just product managers. Everyone who participates in building software has something to contribute to the narrative.

**Developers** work in the TypeScript DSL, writing narratives that compile into executable specifications.

**Designers** work with visual storyboards and wireframes, seeing the user journey moment by moment.

**Product managers and QA** work in the document view, reading, reviewing, and adding context to every scene.

**AI** participates as a collaborator: generating narratives from prompts, filling in business specs, implementing code from the model.

The result: a team where humans and AI make decisions together, captured in one model that drives everything from design to deployment.

---

**[Learn what NDD is →](/what-is-ndd)** · **[See the Theater Booking example →](/guides/build-theater-platform)** · **[Try it on Auto →](https://on.auto)**

---

_A [spec dialect](https://specdriven.com/dialects/narrative-driven) by the [Auto](https://on.auto) team. Part of the [spec-driven development](https://specdriven.com) movement._

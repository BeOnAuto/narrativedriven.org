---
layout: home
hero:
  name: Narrative-Driven Development
  text: "Specify software as narratives."
  tagline: "One model for storyboard, docs, code, and tests. Auto turns it into working software."
  actions:
    - theme: brand
      text: Try it on Auto
      link: https://on.auto
    - theme: alt
      text: What is NDD?
      link: /what-is-ndd
features:
  - icon:
      src: /images/features/feat-three-views.png
    title: One Shared Model
    details: "Storyboard, docs, and code stay aligned because they all come from the same source."
    link: /explanation/one-model-three-views
  - icon:
      src: /images/features/feat-running-code.png
    title: From Model to Software
    details: "Auto turns the model into schema, scaffolds, implementation, checks, and running software."
    link: /guides/narratives-to-code
  - icon:
      src: /images/features/feat-stories.png
    title: Reviewable by Design
    details: "Prompts hide decisions. Narratives make behavior explicit, inspectable, and testable."
    link: /what-is-ndd
  - icon:
      src: /images/features/feat-data-completeness.png
    title: Gaps Surface Early
    details: "Every visible state traces back to commands and events, so missing logic shows up before code exists."
    link: /explanation/data-completeness
---

<div class="why-now-strip">

## Why This Matters Now

AI sped up output. It also sped up drift. Specs, prompts, tickets, and code split apart. NDD gives people and AI one model to build from.

</div>

<div class="example-strip">

## A Working Model

One scene from a concert-booking app in NDD:

The same scene can be reviewed as a storyboard, a readable document, or executable code.

**Narrative: Listing a Show / Scene: Happy path**

<div class="view-tabs">
  <div class="view-tab active" data-view="storyboard">Storyboard</div>
  <div class="view-tab" data-view="document">Document</div>
  <div class="view-tab" data-view="code">Code</div>
</div>

<div class="view-panel active" data-view="storyboard">

1. **Experience** — Promoter navigates to "Create Show"
2. **Command** — Promoter submits show details → `ShowScheduled`
3. **Query** — Promoter previews the draft listing
4. **Command** — Promoter publishes → `ShowPublished`

</div>

<div class="view-panel" data-view="document">

### Scene: Happy path — Promoter lists a new show

**Moment 1: Navigate to Create Show** (Experience)
The promoter opens the show creation form from the dashboard.

**Moment 2: Submit show details** (Command: `ScheduleShow`)
The promoter enters venue, date, artist, and ticket count. On submit, the system emits `ShowScheduled`.

**Moment 3: Preview draft listing** (Query: `DraftShowView`)
The promoter reviews the draft before publishing. Data derives from `ShowScheduled` event.

**Moment 4: Publish the show** (Command: `PublishShow`)
The promoter confirms publication. System emits `ShowPublished`. The show appears in public listings.

</div>

<div class="view-panel" data-view="code">

```typescript
narrative("Listing a Show", () => {
  scene("Happy path", () => {
    moment("Navigate to Create Show", Experience)
    moment("Submit show details", Command, {
      command: "ScheduleShow",
      event: "ShowScheduled",
    })
    moment("Preview draft listing", Query, {
      query: "DraftShowView",
      derivedFrom: ["ShowScheduled"],
    })
    moment("Publish the show", Command, {
      command: "PublishShow",
      event: "ShowPublished",
    })
  })
})
```

<p><a class="VPButton alt" href="https://on.auto">See this on Auto</a></p>

</div>

This is one scene, not the whole app. The full model also captures sold-out paths, cancellations, and waitlist promotions.

</div>

<div class="pipeline-strip">

## Auto Makes It Real

<div class="pipeline-grid">
  <div class="pipeline-step">
    <strong>Derive structure</strong>
    <span>entities, commands, events, and queries from the narrative model</span>
  </div>
  <div class="pipeline-step">
    <strong>Generate scaffolds</strong>
    <span>schema, services, and application frames from the same source</span>
  </div>
  <div class="pipeline-step">
    <strong>Guide implementation</strong>
    <span>AI works inside the model instead of inventing hidden behavior</span>
  </div>
  <div class="pipeline-step">
    <strong>Check before shipping</strong>
    <span>deterministic verification catches gaps before code goes live</span>
  </div>
</div>

NDD is the modeling language. Auto is the platform that turns it into working software.

</div>

<div class="positioning-strip">

## Not a Doc. Not a Prompt.

Not a methodology workshop. Not static documentation. Not prompt improvisation.

NDD gives software teams a structured, shared model of behavior that can actually drive implementation.

It draws from BDD, EventStorming, DDD, story mapping, and storyboarding, then turns those ideas into one executable system.

</div>

---

<div class="bottom-cta">

## Your First Narrative

Write one narrative. See it render as storyboard, docs, and code. Then run it on Auto.

<div class="bottom-cta-actions">
  <a class="VPButton brand" href="https://on.auto">Try it on Auto</a>
  <a class="VPButton alt" href="/what-is-ndd">What is NDD?</a>
</div>

</div>

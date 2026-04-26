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
    details: "Storyboard, docs, and code never drift. They're all views of the same model."
    link: /explanation/one-model-three-views
  - icon:
      src: /images/features/feat-ai-collaborator.png
    title: Agent-Native
    details: "AI is a first-class reader, not an afterthought. The structure, vocabulary, and validation rules are built for agents to reason from."
    link: /explanation/progressive-disclosure
  - icon:
      src: /images/features/feat-spec-dialect.png
    title: Progressive Context Disclosure
    details: "Domain → Narrative → Scene → Moment. Each level loads on its own, so agents pull exactly the slice the task needs without blowing the context window."
    link: /explanation/progressive-disclosure
  - icon:
      src: /images/features/feat-stories.png
    title: Reviewable by Design
    details: "Prompts hide decisions. Narratives make behavior explicit, inspectable, and testable."
    link: /what-is-ndd
  - icon:
      src: /images/features/feat-running-code.png
    title: From Model to Software
    details: "Your coding agent builds from structure, not from prompts. Auto validates every step."
    link: /guides/narratives-to-code
  - icon:
      src: /images/features/feat-data-completeness.png
    title: Gaps Surface Early
    details: "Every visible state traces back to commands and events, so missing logic shows up before code exists."
    link: /explanation/data-completeness
---

<div class="why-now-strip">

## Why This Matters Now

AI sped up output. It also sped up drift. Prose specs blow the context window; the agent either drowns in detail or invents what's missing. NDD's structured hierarchy discloses only the slice the agent needs, when it needs it, so people and AI build from one coherent model. [Progressive disclosure for specs →](/explanation/progressive-disclosure)

</div>

<div class="example-strip">

## One Model, Three Views

The same narrative model renders as a visual storyboard, a structured document, and executable code. Edit in any view — the others stay in sync.

<div class="product-views">

<div class="product-view">

### The Visual View

Your app as a storyboard on a shared canvas. Each narrative is a card, each scene is a filmstrip, each moment is a step in the journey. Drag, connect, and chat with individual moments to refine them.

<div style="margin-top: 16px; border-radius: 12px; overflow: hidden; border: 1px solid rgba(0,0,0,0.08);">
<img class="only-dark" src="/images/product/visual-canvas.png" alt="Visual narratives on the shared canvas" style="width: 100%; display: block;" />
<img class="only-light" src="/images/product/visual-canvas-light.png" alt="Visual narratives on the shared canvas" style="width: 100%; display: block;" />
</div>

</div>

<div class="product-view">

### The Document View

The same model as a structured, readable document. Each scene becomes a page. Each moment shows its specs — interaction behavior on the client side, business rules with Given/When/Then on the server side. For the people on your team who think in text, not pictures.

<div style="margin-top: 16px; border-radius: 12px; overflow: hidden; border: 1px solid rgba(0,0,0,0.08);">
<img class="only-dark" src="/images/product/document-view.png" alt="Document view showing structured moments with business rules and interaction specs" style="width: 100%; display: block;" />
<img class="only-light" src="/images/product/document-view-light.png" alt="Document view showing structured moments with business rules and interaction specs" style="width: 100%; display: block;" />
</div>

</div>

<div class="product-view">

### The Code View

The same model as a TypeScript DSL. Full type safety and IntelliSense. For developers who prefer working directly in code. The whole file lives inside a domain (your workspace); narratives, scenes, and moments compose down from there.

```typescript
narrative("Listing a Show", () => {
  scene("Show published", () => {
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

</div>

</div>

This is one model, not three tools. A change in any view is reflected everywhere else. That's how your whole team — product, design, engineering, AI — stays aligned.

<p style="margin-top: 24px;"><a class="VPButton brand" href="https://on.auto">Try it on Auto</a></p>

</div>

<div class="pipeline-strip">

## Auto Makes It Real

<div class="pipeline-grid">
  <div class="pipeline-step">
    <strong>Model on Auto</strong>
    <span>describe your app and Auto generates a structured narrative with scenes, moments, and specs</span>
  </div>
  <div class="pipeline-step">
    <strong>Validate before code</strong>
    <span>50+ structural rules catch missing flows, incomplete specs, and broken references automatically</span>
  </div>
  <div class="pipeline-step">
    <strong>Connect your agent</strong>
    <span>your coding agent receives the validated model and builds the application on your machine</span>
  </div>
  <div class="pipeline-step">
    <strong>Close the loop</strong>
    <span>if the agent changes the model, Auto validates it back and keeps the spec as the source of truth</span>
  </div>
</div>

NDD is the modeling language. Auto is the platform that makes it operational. Your coding agent is the builder.

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

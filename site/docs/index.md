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

<div class="artifact-strip">

## See it in 30 seconds

A plain prompt becomes an executable model becomes a passing test. No magic. No prose-only specs. Watch the model take shape.

<!--
  Phase 3 follow-up: replace Unsplash placeholder images with real Auto UI screenshots.
  Then add an HTML5 <video> element below the figure grid:

  <video class="ndd-artifact-video" autoplay muted loop playsinline poster="/artifact-poster.jpg">
    <source src="/artifact-30sec.mp4" type="video/mp4" />
    <source src="/artifact-30sec.webm" type="video/webm" />
  </video>

  See the linked tutorial fallback for the no-video case.
-->

<div class="ndd-artifact-frames">

<figure>
  <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80&placeholder=true" alt="Frame 1 of 6: a plain prompt input box with the text 'Build a concert booking app'" />
  <figcaption><strong>Step 1 of 6.</strong> A plain prompt: <em>"Build a concert booking app."</em></figcaption>
</figure>

<figure>
  <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80&placeholder=true" alt="Frame 2 of 6: REQUIREMENTS page showing the Concert Booking domain with capability prose, a list of goals (Listing a Show, Getting Tickets, Managing Booking), actors, and entities" />
  <figcaption><strong>Step 2 of 6.</strong> Auto extracts the domain. <em>Concert Booking</em> becomes the capability. Goals, actors, and entities surface together.</figcaption>
</figure>

<figure>
  <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&placeholder=true" alt="Frame 3 of 6: NARRATIVE page for Listing a Show showing the goal prose and a list of outcomes" />
  <figcaption><strong>Step 3 of 6.</strong> One narrative opens. <em>Listing a Show</em> breaks into outcomes the promoter cares about.</figcaption>
</figure>

<figure>
  <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80&placeholder=true" alt="Frame 4 of 6: SCENE page for Show published showing the outcome prose and an Experience Moment block with a small wireframe preview inside" />
  <figcaption><strong>Step 4 of 6.</strong> One scene opens. <em>Show published</em> contains the moments that move it forward.</figcaption>
</figure>

<figure>
  <img src="https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=800&q=80&placeholder=true" alt="Frame 5 of 6: MOMENT page for Schedule the show with a full wireframe of the show scheduling form, plus interface rules listed beneath" />
  <figcaption><strong>Step 5 of 6.</strong> One moment opens. <em>Schedule the show</em> shows the wireframe and the interface rules in one place.</figcaption>
</figure>

<figure>
  <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80&placeholder=true" alt="Frame 6 of 6: TypeScript code editor showing the canonical fluent DSL for the Schedule Show command, with a green checkmark and the test name 'promoter schedules Neon Drift Live' beneath it" />
  <figcaption><strong>Step 6 of 6.</strong> The model becomes code. <em>✓ promoter schedules Neon Drift Live</em>. The spec is the test.</figcaption>
</figure>

</div>

<p class="ndd-artifact-cta">
  Want to see the running app? <a href="#"><!-- Phase 3 follow-up: replace # with live demo URL once concert.demo.on.auto (or wherever) is deployed. -->Live demo coming soon</a>. For the full walkthrough, read <a href="/guides/build-concert-platform">Build a Concert Platform</a>.
</p>

</div>

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

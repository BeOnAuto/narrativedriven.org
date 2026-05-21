---
layout: home
title: "Narrative-Driven Development — Preserve product intent for AI-built software"
description: "NDD turns product intent into a durable product story humans can review before build. Open taxonomy, productized in Auto."
hero:
  name: Narrative-Driven Development
  text: "<span class=\"heroTitleMain\">Specify software as narratives.</span><span class=\"heroTitleBridge\" aria-hidden=\"true\"></span><span class=\"heroTitleSecondary\">A durable product story for humans to review before build.</span>"
  tagline: "Chat is where ideas start. NDD is where intent survives: goals, outcomes, behavior, rules, and examples held together in one shared language."
  actions:
    - theme: brand
      text: See the problem
      link: "#chat-loses-intent"
    - theme: alt
      text: Use NDD without Auto
      link: /using-ndd-without-auto.html
---

<CentralVisualPlaceholder />

<section class="ndd-home-section ndd-home-section--model">

<p class="sectionEyebrow">The missing review surface</p>

<h2 class="sectionTitle">NDD keeps intent in a product story, not a chat history.</h2>

<p class="sectionBody">The narrative is the durable review surface between prompt and code. People review it before implementation. When the product changes, the narrative changes first.</p>

<div class="intentExample" aria-label="Chat correction converted into durable model rule">
  <article>
    <p class="intentExample__label">Buried in chat</p>
    <blockquote>"Don't remove reminders when the deal stage changes."</blockquote>
  </article>
  <span aria-hidden="true">→</span>
  <article>
    <p class="intentExample__label">Preserved in the narrative</p>
    <p><strong>Rule:</strong> Stage changes must not remove active follow-up reminders.</p>
    <p><strong>Example:</strong> Discovery → Proposal keeps tomorrow's reminder visible.</p>
  </article>
</div>

</section>

<section class="ndd-home-section ndd-home-section--example">

<p class="sectionEyebrow">Proof by example</p>

<h2 class="sectionTitle">See a real product modeled end to end.</h2>

<p class="sectionBody">The Concert Booking example follows promoters publishing shows, fans reserving tickets or joining waitlists, and the system preserving capacity and booking state across scenes.</p>

<div class="ndd-example-preview" aria-label="Canonical example preview">
  <article class="ndd-example-card ndd-example-card--moment">
    <header class="ndd-example-card__kicker">Moment · Command</header>
    <h3 class="ndd-example-card__title">Book Tickets</h3>
    <p class="ndd-example-card__body">The fan attempts to reserve seats for a published show.</p>
  </article>
  <article class="ndd-example-card ndd-example-card--rule">
    <header class="ndd-example-card__kicker">Rule</header>
    <h3 class="ndd-example-card__title">Capacity is preserved</h3>
    <p class="ndd-example-card__body">Tickets cannot be reserved beyond remaining capacity.</p>
  </article>
  <article class="ndd-example-card ndd-example-card--example">
    <header class="ndd-example-card__kicker">Example</header>
    <h3 class="ndd-example-card__title">Sold-out branch</h3>
    <p class="ndd-example-card__body">When capacity is exhausted, the fan enters the waitlist scene instead.</p>
  </article>
</div>

<p class="ndd-example-cta">
  <a href="/guides/build-concert-platform" class="ndd-cta-link">Read the canonical example →</a>
</p>

</section>

<section class="ndd-home-section ndd-home-section--hierarchy">

<p class="sectionEyebrow">The structure</p>

<h2 class="sectionTitle">Domain → Narrative → Scene → Moment</h2>

<p class="sectionBody">The hierarchy gives the product story a clear shape. Start broad, then drill down only where the app needs precision.</p>

<div class="hierarchyFlow" aria-label="NDD hierarchy">

<article class="hierarchyNode hierarchyNode--domain">
  <p class="hierarchyTag">Domain</p>
  <p class="hierarchyTitle">The capability being built.</p>
  <p class="hierarchyExample">e.g. <em>Concert Booking</em></p>
</article>

<span class="hierarchyArrow" aria-hidden="true">→</span>

<article class="hierarchyNode hierarchyNode--narrative">
  <p class="hierarchyTag">Narrative</p>
  <p class="hierarchyTitle">A goal inside the domain.</p>
  <p class="hierarchyExample">e.g. <em>Listing a Show</em></p>
</article>

<span class="hierarchyArrow" aria-hidden="true">→</span>

<article class="hierarchyNode hierarchyNode--scene">
  <p class="hierarchyTag">Scene</p>
  <p class="hierarchyTitle">An outcome that becomes true.</p>
  <p class="hierarchyExample">e.g. <em>Show Published</em></p>
</article>

<span class="hierarchyArrow" aria-hidden="true">→</span>

<article class="hierarchyNode hierarchyNode--moment">
  <p class="hierarchyTag">Moment</p>
  <p class="hierarchyTitle">A single behavior slice.</p>
  <p class="hierarchyExample">e.g. <em>Schedule the Show</em></p>
</article>

</div>

<p class="hierarchyFoot">The same vocabulary works in workshops, documents, prompts, and Auto.</p>

</section>

<section class="ndd-home-section ndd-home-section--credibility">

<div class="credibilityBlock">
  <p class="sectionEyebrow">Open method</p>
  <h2 class="sectionTitle">Use NDD with the tools you already have.</h2>
  <p class="sectionBody">You can practice NDD by hand, in a planning doc, or with any AI assistant. Start small: one narrative, one scene, one moment, one rule, one example.</p>
  <p class="credibilityLinks">
    <a href="/using-ndd-without-auto.html" class="ndd-cta-link">Try the walkthrough →</a>
    <a href="/guides/prompting-ai" class="ndd-cta-link">Prompt with the vocabulary →</a>
  </p>
</div>

</section>

<section class="ndd-home-section ndd-home-section--lineage">

<p class="sectionEyebrow">Lineage</p>

<h2 class="sectionTitle">Built from practices that already made intent explicit.</h2>

<p class="sectionBody">NDD brings together BDD, DDD, EventStorming, specification by example, story mapping, and component-level specs for the AI era. The difference is the language: one product story humans can review before build.</p>

</section>

<section class="ndd-home-section ndd-home-section--auto-cta">

<div class="autoCtaBlock">
  <p class="sectionEyebrow">When the model grows</p>
  <h2 class="sectionTitle">Practice NDD in Auto.</h2>
  <p class="sectionBody">Auto is the product built around NDD. It creates a draft narrative from your prompt, lets you review it visually, and supports AI-assisted implementation inside the product workflow.</p>
  <p class="autoCtaActions">
    <a href="https://on.auto" class="autoCtaButton">Open Auto →</a>
  </p>
</div>

</section>

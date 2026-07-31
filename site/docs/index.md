---
layout: home
title: "Narrative-Driven Development — Preserve product intent for AI-built software"
description: "NDD turns product intent into a durable product model humans can review and agents can build from."
hero:
  name: Narrative-Driven Development
  text: "<span class=\"heroTitleMain\">Specify software as narratives.</span><span class=\"heroTitleBridge\" aria-hidden=\"true\"></span><span class=\"heroTitleSecondary\">A durable product model humans can review and agents can build from.</span>"
  tagline: "The narrative is the readable surface: domains, goals, outcomes, moments, rules, and examples held together in one shared language."
  actions:
    - theme: brand
      text: See the problem
      link: "#chat-loses-intent"
    - theme: alt
      text: Use NDD without Auto
      link: /using-ndd-without-auto.html
---

<section id="chat-loses-intent" class="ndd-home-section ndd-home-section--model">

<p class="sectionEyebrow">The missing review surface</p>

<h2 class="sectionTitle">NDD keeps intent in a product model, not a chat history.</h2>

<p class="sectionBody">The narrative is the human-readable surface between prompt and code. People review it before implementation. When the product changes, the product model changes first.</p>

<div class="intentExample" aria-label="Chat correction converted into durable model rule">
  <article>
    <p class="intentExample__label">Buried in chat</p>
    <blockquote>"Don't remove reminders when the deal stage changes."</blockquote>
  </article>
  <span aria-hidden="true">→</span>
  <article>
    <p class="intentExample__label">Preserved in the model</p>
    <p><strong>Rule:</strong> Stage changes must not remove active follow-up reminders.</p>
    <p><strong>Example:</strong> Discovery → Proposal keeps tomorrow's reminder visible.</p>
  </article>
</div>

</section>

<section class="ndd-home-section ndd-home-section--hierarchy">

<p class="sectionEyebrow">The structure</p>

<h2 class="sectionTitle">Domain → Narrative → Scene → Moment</h2>

<p class="sectionBody">The hierarchy gives the product model a clear shape. Start broad, then drill down only where the app needs precision.</p>

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

<p class="hierarchyFoot">The same vocabulary works in workshops, documents, prompts, and reviews.</p>

</section>

<section class="ndd-home-section ndd-home-section--example">

<p class="sectionEyebrow">Proof by example</p>

<h2 class="sectionTitle">Study two examples.</h2>

<p class="sectionBody">Start with Concert Booking to learn the hierarchy. Use Lens Rental Marketplace to inspect trust, payments, access, reversal, evidence, and disputes.</p>

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
  <a href="/guides/build-concert-platform" class="ndd-cta-link">Beginner example: Concert Booking →</a>
  <a href="/guides/lens-rental-marketplace" class="ndd-cta-link">Serious example: Lens Rental Marketplace →</a>
</p>

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

<section class="ndd-home-section ndd-home-section--auto-cta">

<div class="autoCtaBlock">
  <p class="sectionEyebrow">When the model grows</p>
  <h2 class="sectionTitle">Try the early Auto workflow.</h2>
  <p class="sectionBody">NDD is the open product modeling technique. Auto productizes the workflow with draft model support, visual review, document review, and AI-assisted implementation support.</p>
  <p class="autoCtaActions">
    <a href="https://on.auto" class="autoCtaButton">Try Auto early →</a>
  </p>
</div>

</section>

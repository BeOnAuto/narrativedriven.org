---
layout: home
hero:
  name: Narrative-Driven Development
  text: "Specify software as narratives."
  tagline: "One model for intent, behavior, tests, and code. Review it with people. Execute it with agents."
  actions:
    - theme: brand
      text: What is NDD?
      link: "#what-ndd-is"
    - theme: alt
      text: Try NDD on.Auto
      link: "#try-ndd-on-auto"
features:
  - icon:
      src: /images/features/feat-three-views.png
    title: One Shared Model
    details: "Requirements, specs, tests, and code stay aligned as views of one underlying model."
    link: /explanation/one-model-three-views
  - icon:
      src: /images/features/feat-ai-collaborator.png
    title: Structured for Agents
    details: "Structure, rules, and examples give agents something precise to reason from."
    link: /guides/prompting-ai
  - icon:
      src: /images/features/feat-spec-dialect.png
    title: Progressive Context Disclosure
    details: "Each task gets the context it needs, not the whole specification."
    link: /explanation/progressive-disclosure
  - icon:
      src: /images/features/feat-stories.png
    title: Human-Reviewable
    details: "Narratives make behavior explicit, inspectable, and testable before code is written."
    link: /what-is-ndd
  - icon:
      src: /images/features/feat-running-code.png
    title: From Spec to Software
    details: "Auto turns the narrative model into tasks your coding agent can execute and verify."
    link: /guides/narratives-to-code
  - icon:
      src: /images/features/feat-data-completeness.png
    title: Gaps Surface Early
    details: "Missing behavior, invalid states, and broken flows surface while the spec is still cheap to change."
    link: /explanation/data-completeness
---

<div class="why-now-strip">

## Why This Matters Now

AI made software output cheap. It also made drift cheap. Prompts and prose specs do not hold enough structure for teams or agents. NDD gives intent, behavior, rules, and examples a hierarchy that can be reviewed by people and executed by agents.

[What makes a narrative buildable →](/what-makes-a-narrative-buildable)

</div>

<div class="artifact-strip">

## From idea to model

A plain prompt becomes a structured hierarchy in Auto. Domain, narrative, scene, moment, and canvas are different views of the same model.

<div class="ndd-progression">

<div class="ndd-step-card">
  <div class="ndd-step-shot ndd-shot-prompt" aria-hidden="true">
    <div class="ndd-mock-input">
      <span class="ndd-mock-input-text"></span>
      <span class="ndd-mock-caret"></span>
    </div>
  </div>
  <div class="ndd-step-num">Step 1 · Prompt</div>
  <div class="ndd-step-card-title">Plain-language idea</div>
  <div class="ndd-step-card-sub">Start with a short description of the product you want to build.</div>
</div>

<div class="ndd-step-card">
  <div class="ndd-step-shot ndd-shot-domain" aria-hidden="true">
    <div class="ndd-mock-doc">
      <div class="ndd-mock-doc-tag">DOMAIN</div>
      <div class="ndd-mock-doc-title"></div>
      <div class="ndd-mock-doc-line"></div>
      <div class="ndd-mock-doc-line ndd-mock-doc-line--short"></div>
      <div class="ndd-mock-doc-line"></div>
    </div>
  </div>
  <div class="ndd-step-num">Step 2 · Domain</div>
  <div class="ndd-step-card-title">Capability model</div>
  <div class="ndd-step-card-sub">Auto identifies the domain, goals, actors, and entities.</div>
</div>

<div class="ndd-step-card">
  <div class="ndd-step-shot ndd-shot-narrative" aria-hidden="true">
    <div class="ndd-mock-doc ndd-mock-doc--narrative">
      <div class="ndd-mock-doc-tag">NARRATIVE</div>
      <div class="ndd-mock-outcome"><span class="ndd-mock-bullet"></span><span class="ndd-mock-line"></span></div>
      <div class="ndd-mock-outcome"><span class="ndd-mock-bullet"></span><span class="ndd-mock-line ndd-mock-line--mid"></span></div>
      <div class="ndd-mock-outcome"><span class="ndd-mock-bullet"></span><span class="ndd-mock-line ndd-mock-line--short"></span></div>
    </div>
  </div>
  <div class="ndd-step-num">Step 3 · Narrative</div>
  <div class="ndd-step-card-title">Goal-level specification</div>
  <div class="ndd-step-card-sub">A goal becomes a narrative with outcomes and actors.</div>
</div>

<div class="ndd-step-card">
  <div class="ndd-step-shot ndd-shot-scene" aria-hidden="true">
    <div class="ndd-mock-doc ndd-mock-doc--scene">
      <div class="ndd-mock-doc-tag">SCENE</div>
      <div class="ndd-mock-moment"><span class="ndd-mock-step">1</span><span class="ndd-mock-line ndd-mock-line--mid"></span></div>
      <div class="ndd-mock-moment"><span class="ndd-mock-step">2</span><span class="ndd-mock-line ndd-mock-line--short"></span></div>
      <div class="ndd-mock-moment"><span class="ndd-mock-step">3</span><span class="ndd-mock-line"></span></div>
    </div>
  </div>
  <div class="ndd-step-num">Step 4 · Scene</div>
  <div class="ndd-step-card-title">Outcome-level specification</div>
  <div class="ndd-step-card-sub">One outcome opens into the moments that achieve it.</div>
</div>

<div class="ndd-step-card">
  <div class="ndd-step-shot ndd-shot-moment" aria-hidden="true">
    <div class="ndd-mock-wire">
      <div class="ndd-mock-wire-frame">
        <div class="ndd-mock-wire-bar"></div>
        <div class="ndd-mock-wire-block"></div>
      </div>
      <div class="ndd-mock-rules">
        <div class="ndd-mock-rule"></div>
        <div class="ndd-mock-rule ndd-mock-rule--short"></div>
        <div class="ndd-mock-rule"></div>
      </div>
    </div>
  </div>
  <div class="ndd-step-num">Step 5 · Moment</div>
  <div class="ndd-step-card-title">Low-level specification</div>
  <div class="ndd-step-card-sub">Captures one slice's interface behavior, rules, and examples.</div>
</div>

<div class="ndd-step-card">
  <div class="ndd-step-shot ndd-step-shot-canvas" aria-hidden="true">
    <div class="ndd-shot-node ndd-shot-node-1"></div>
    <div class="ndd-shot-node ndd-shot-node-2"></div>
    <div class="ndd-shot-node ndd-shot-node-3"></div>
  </div>
  <div class="ndd-step-num">Step 6 · Canvas</div>
  <div class="ndd-step-card-title">Shared visual model</div>
  <div class="ndd-step-card-sub">Explore the same model visually across narratives, scenes, and moments.</div>
</div>

</div>

<p class="ndd-artifact-cta">
  See the full example: <a href="/guides/build-concert-platform">Build a Concert Platform</a>.
</p>

</div>

<div class="try-strip" id="try-ndd-on-auto">

## Try NDD on.Auto

Describe a product in plain language. Auto turns it into a narrative model you can inspect, refine, and execute with your coding agent.

<NDDTryPrompt />
<br/>
<p class="ndd-try-hint-line">Auto turns your idea into a narrative model your coding agent can build from.</p>

</div>

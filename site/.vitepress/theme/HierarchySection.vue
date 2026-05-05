<template>
  <div class="ndd-hierarchy-strip" id="what-ndd-is">
    <h2>What NDD gives you</h2>
    <p>NDD turns a loose product idea into a structured hierarchy. Each level narrows the context so people can review the right thing and agents get only what they need.</p>

    <div class="ndd-hierarchy-grid">
      <div class="ndd-hierarchy-card">
        <div class="ndd-hierarchy-icon" aria-hidden="true">
          <!-- Phosphor: Polygon -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16">
            <circle cx="120" cy="48" r="24" />
            <circle cx="40" cy="120" r="24" />
            <circle cx="160" cy="208" r="24" />
            <circle cx="208" cy="72" r="24" />
            <line x1="184.85" y1="65.69" x2="143.15" y2="54.31" />
            <line x1="102.16" y1="64.06" x2="57.84" y2="103.94" />
            <line x1="59.36" y1="134.19" x2="140.64" y2="193.81" />
            <line x1="167.99" y1="185.36" x2="200.01" y2="94.64" />
          </svg>
        </div>
        <div class="ndd-hierarchy-label">Domain</div>
        <div class="ndd-hierarchy-sub">The capability being built.</div>
        <div class="ndd-hierarchy-eg">e.g. <em>Concert Booking</em></div>
      </div>

      <div class="ndd-hierarchy-arrow" aria-hidden="true">→</div>

      <div class="ndd-hierarchy-card">
        <div class="ndd-hierarchy-icon" aria-hidden="true">
          <!-- Lucide: Waypoints -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m10.586 5.414-5.172 5.172" />
            <path d="m18.586 13.414-5.172 5.172" />
            <path d="M6 12h12" />
            <circle cx="12" cy="20" r="2" />
            <circle cx="12" cy="4" r="2" />
            <circle cx="20" cy="12" r="2" />
            <circle cx="4" cy="12" r="2" />
          </svg>
        </div>
        <div class="ndd-hierarchy-label">Narrative</div>
        <div class="ndd-hierarchy-sub">A goal inside the domain.</div>
        <div class="ndd-hierarchy-eg">e.g. <em>Listing a Show</em></div>
      </div>

      <div class="ndd-hierarchy-arrow" aria-hidden="true">→</div>

      <div class="ndd-hierarchy-card">
        <div class="ndd-hierarchy-icon" aria-hidden="true">
          <!-- Phosphor: Path -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16">
            <circle cx="200" cy="200" r="24" />
            <path d="M72,56h96a32,32,0,0,1,0,64H72a40,40,0,0,0,0,80H176" />
          </svg>
        </div>
        <div class="ndd-hierarchy-label">Scene</div>
        <div class="ndd-hierarchy-sub">An outcome that achieves the goal.</div>
        <div class="ndd-hierarchy-eg">e.g. <em>Show Published</em></div>
      </div>

      <div class="ndd-hierarchy-arrow" aria-hidden="true">→</div>

      <div class="ndd-hierarchy-card">
        <div class="ndd-hierarchy-icon" aria-hidden="true">
          <!-- Phosphor: FrameCorners -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16">
            <polyline points="160 80 192 80 192 112" />
            <polyline points="96 176 64 176 64 144" />
            <rect x="32" y="48" width="192" height="160" rx="8" />
          </svg>
        </div>
        <div class="ndd-hierarchy-label">Moment</div>
        <div class="ndd-hierarchy-sub">A single step that moves the outcome forward.</div>
        <div class="ndd-hierarchy-eg">e.g. <em>Schedule the Show</em></div>
      </div>
    </div>
    <br/>
    <p class="ndd-hierarchy-foot">The same model can be viewed as a canvas, a document, or typed code.</p>
  </div>
</template>

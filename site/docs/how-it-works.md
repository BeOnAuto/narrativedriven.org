---
title: How it Works
prev:
  text: What Makes a Narrative Buildable?
  link: /what-makes-a-narrative-buildable
next:
  text: For Practitioners
  link: /for-practitioners
---

# How NDD Works

NDD turns a rough app idea into a buildable narrative, then uses that narrative to guide implementation.

The path is simple:

```text
Prompt
↓ Buildable narrative
↓ Review
↓ Drill down
↓ Coding agent
↓ App
↓ Narrative stays alive
```

## 1. Start with a prompt

Start with the app idea in plain language.

Example:

```text
I need a timesheet app where submitters enter hours for teams,
controllers validate entries, and closed periods cannot be edited.
```

The prompt is not the spec.

The prompt is the seed.

## 2. Extract the goal

NDD identifies what people are trying to achieve.

For the timesheet app, goals might be:

- Submit team timesheets
- Validate submitted entries
- Close a reporting period
- Reopen incorrect submissions

These become narratives.

## 3. Break goals into outcomes

Each goal breaks into outcomes.

For "Submit team timesheets," outcomes might be:

- Timesheet drafted
- Daily entries completed
- Timesheet submitted
- Submission rejected for missing hours

These become scenes.

Outcomes matter because they create clean build boundaries.

## 4. Break outcomes into steps

Each outcome breaks into steps.

For "Timesheet submitted," steps might be:

- Submitter selects a team
- Submitter enters daily hours
- System validates required entries
- Submitter submits the timesheet
- System records the submission

These become moments.

Moments are where the narrative becomes concrete.

## 5. Add rules and examples

Rules describe what must be true.

Examples prove those rules.

```text
Rule: Submitted entries cannot be edited.

Given an entry has status Submitted
When the submitter tries to change the hours
Then the edit is rejected
And the entry remains Submitted
```

This is where the narrative stops being a story and starts becoming executable specification.

## 6. Add data

The narrative tracks the data the app depends on.

For example:

- Team
- Submitter
- Timesheet
- Daily Entry
- Status
- Reporting Period
- Validation Decision

It also tracks where data comes from and what changes it.

If the app displays a status, the narrative should specify what event or action produced that status.

## 7. Review through screens and wireframes

Screens make the narrative visible.

A moment can include desktop and mobile wireframes so humans can see how the step feels.

But the screen is not the whole spec. Behind the screen are the rules, examples, requests, responses, state, and system behavior.

## 8. Drill down only when needed

NDD does not force every user into full manual control.

Start with:

- goals
- outcomes
- steps

Drill into:

- wireframes
- client specs
- service specs
- commands
- queries
- events
- state
- integrations
- auth
- data syncs

The method reveals complexity as the app requires it.

## 9. Give the narrative to a coding agent

The coding agent should not build from a vague prompt.

It should build from the narrative slice that matters:

- the domain context
- the current goal
- the outcome under work
- the steps involved
- the rules and examples
- the data dependencies
- the UI expectations

That gives the agent a coherent build target.

## 10. Keep the narrative alive

The narrative should not disappear after the first generation.

When the app changes, the narrative changes with it.

Today, the narrative gives your coding agent a coherent starting point.

The direction NDD points toward is a closed loop where narrative, code, and tests evolve together.

That is the long-term shape: not prompts creating code, but narratives guiding software as it changes.

## How Auto fits

Auto applies NDD to your prompt.

It helps turn the rough idea into a buildable narrative, lets you inspect the structure, and gives your coding agent something explicit to build from.

You can practice NDD by hand.

Auto does the structural work for you.

[Try NDD in Auto →](https://on.auto)

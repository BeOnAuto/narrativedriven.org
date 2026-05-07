---
title: Review a Narrative
---

# Review a Narrative

![Narrative card with magnifying glass, green checkmarks, a red X, and a red question mark beside specific lines](/images/heroes/review-a-narrative.png){.page-hero}

A buildable narrative is only valuable if humans can review it before the coding agent builds.

Use this checklist.

## 1. Review the goal

Ask:

- Is this goal real?
- Is it too broad?
- Is it too small?
- Does it belong in this capability?

Bad:

> Manage everything

Better:

> Submit team timesheets

## 2. Review the outcomes

Ask:

- What becomes true?
- Is each outcome independently understandable?
- Are any outcomes missing?
- Are failure outcomes represented?

Examples:

- Timesheet submitted
- Submission blocked for missing hours
- Entry validated
- Period closed

## 3. Review the slices

Ask:

- Does the flow make sense?
- Is anything skipped?
- Are user and system slices separated?
- Are automated reactions explicit?

## 4. Review the rules

Ask:

- What must always be true?
- What cannot happen?
- What status transitions are allowed?
- What permissions apply?
- What validations matter?

## 5. Review the examples

Ask:

- Does every important rule have an example?
- Do examples include failures?
- Are examples concrete enough to test?
- Would a developer and product person interpret the example the same way?

## 6. Review the data

Ask:

- What data is visible?
- Where does it come from?
- What action creates it?
- What event changes it?
- What integration provides it?
- What happens if it is missing?

## 7. Review the screens

Ask:

- Does each moment have the right UI?
- Are desktop and mobile views considered?
- Does the screen match the outcome?
- Are required states visible?

## 8. Review the agent handoff

Ask:

- Does the agent know what to build first?
- Does it have the right context slice?
- Are rules and examples explicit?
- Are data dependencies clear?
- Is anything still trapped in prose?

## The final question

Can a coding agent build from this without inventing the important decisions?

If not, the narrative is not buildable yet.

---
title: Moment Types
next:
  text: Glossary
  link: /reference/glossary
---

# Moment Types

![Four cards: Command (red), Query (blue), React (green), Experience (orange) with characteristic icons](/images/heroes/moment-types.png){.page-hero}

A moment is a slice of an outcome.

NDD has four moment types:

- Command
- Query
- React
- Experience

The type tells reviewers what kind of behavior they are looking at. Each moment can carry rules, Given/When/Then examples, and should statements where those details help clarify intent.

## Command

Use **Command** when something changes.

Examples:

- Submit timesheet
- Book tickets
- Cancel booking
- Publish show
- Validate entry

A command moment usually answers:

- Who is taking the action?
- What changes when the action succeeds?
- What rules must hold?
- What examples prove those rules?
- What should the relevant interface or service do?

## Query

Use **Query** when something is read or inspected.

Examples:

- View available shows
- Browse timesheets
- See booking status
- Load dashboard

A query moment usually answers:

- What does the actor need to see?
- What filters, sorting, or empty states matter?
- Where should the visible information come from conceptually?
- What rules or examples make the result unambiguous?
- What should the relevant interface do while loading, empty, or in error?

## React

Use **React** when the system responds automatically.

Examples:

- Promote from waitlist after cancellation
- Send notification after approval
- Sync data after external update
- Recalculate status after a change

A react moment usually answers:

- What situation causes the system response?
- What business rule controls the response?
- What result should become true?
- What happens when the response cannot complete?

## Experience

Use **Experience** when modeling user movement or interface behavior that does not directly change business state.

Examples:

- Navigate to dashboard
- Open detail panel
- Move through onboarding
- Switch between desktop and mobile layouts

An experience moment usually answers:

- What is the user trying to inspect or do next?
- What movement, focus, or layout behavior matters?
- What accessibility or interaction expectations should be preserved?
- How does the experience support the scene outcome?

## Choosing the right type

Ask:

- Does something change? Use Command.
- Is information being read? Use Query.
- Is the system responding automatically? Use React.
- Is the user moving through the interface? Use Experience.

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

Every moment can hold both kinds of specification: business rules (Given/When/Then) and component specs (describe/it/should). Beyond those, the contents differ by type.

## Command

Use Command when something changes.

Examples:

- Submit timesheet
- Book tickets
- Cancel booking
- Publish show
- Validate entry

A command usually has:

- user or system actor
- request shape
- business rules with examples
- component specs for the UI controls and the service endpoint
- resulting event or state change
- references to react moments that consume the resulting event

## Query

Use Query when something is read.

Examples:

- View available shows
- Browse timesheets
- See booking status
- Load dashboard

A query usually has:

- data source
- visible state
- filtering and sorting rules
- empty states
- component specs for the list, the loading state, and the empty state
- examples
- data completeness chain back to the producing command

## React

Use React when the system responds automatically.

Examples:

- Promote from waitlist after cancellation
- Send notification after approval
- Sync data after external update
- Recalculate status after event

A react moment usually has:

- triggering event (and its source moment)
- system rule
- resulting command or event
- component specs for any service work the react performs
- failure handling
- examples

## Experience

Use Experience when modeling user movement or interface behavior that does not directly change business state.

Examples:

- Navigate to dashboard
- Open detail panel
- Move through onboarding
- Switch between desktop and mobile layouts

An experience moment usually has:

- UI behavior
- user expectation
- component specs for navigation, focus, and layout behavior
- wireframes
- accessibility or interaction notes

## Choosing the right type

Ask:

- Does something change? Use Command.
- Is data being read? Use Query.
- Is the system responding automatically? Use React.
- Is the user moving through the interface? Use Experience.

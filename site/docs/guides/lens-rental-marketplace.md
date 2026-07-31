---
title: Model the Lens Rental Marketplace
description: "A serious NDD example with trust, payments, access control, workflow reversal, handover evidence, and dispute resolution."
prev:
  text: "Build the Concert Booking Platform"
  link: /guides/build-concert-platform
next:
  text: "Anatomy of a Product Model"
  link: /explanation/anatomy-of-a-product-model
---

# Model the Lens Rental Marketplace

The concert booking example shows the basics. This example shows what happens when the product has money, trust, physical-world ambiguity, and support workflows.

## Domain

**Peer-to-peer gear rental** is the domain.

Capability: owners rent high-value camera gear to renters, while the platform manages trust, payment state, handover evidence, and disputes.

**Actors**

- Owner
- Renter
- Support agent
- Payment provider
- System

**Entities**

- Gear listing
- Rental request
- Booking
- Deposit hold
- Payment capture
- Handover
- Condition evidence
- Dispute

## Narratives

- Owner lists gear
- Renter books gear
- Payment is secured
- Gear is handed over
- Rental is returned
- Dispute is resolved

## Narrative: Renter books high-value gear

**Goal:** the renter gets an approved booking only when the owner, trust checks, and payment state allow the rental to proceed.

### Scene: Booking requested

| Moment | Type | What happens |
| --- | --- | --- |
| Browse Available Gear | Query | Renter sees gear that can be requested for selected dates. |
| Request Rental | Command | Renter requests the item and accepts deposit terms. |

```text
Rule: A request can only target available dates.

Example: Renter requests an open weekend
Given Mara's 70-200mm lens is available June 19-21
When Theo requests the lens for June 19-21
Then a rental request is created
And the requested dates are held for owner review
```

### Scene: Booking approved

| Moment | Type | What happens |
| --- | --- | --- |
| Review Renter Requests | Query | Owner compares renter profiles, offers, and requested dates. |
| Approve Renter | Command | Owner approves one request before confirmation. |

```text
Rule: Owners can choose between competing requests before confirmation.

Example: Owner chooses between competing requests
Given Mara has two requests for the same weekend
And Theo offers a higher price with no review history
And Anika offers a lower price with strong reviews
When Mara approves Theo
Then Theo's request becomes the approved booking
And Anika's request is released or waitlisted
And the decision is recorded with the booking
```

### Scene: Payment secured

| Moment | Type | What happens |
| --- | --- | --- |
| Authorize Deposit | React | System asks the payment provider to place a deposit hold. |
| Confirm Payment Readiness | Query | Renter and owner see that payment is ready for handover. |

```text
Rule: Deposit amount is tied to item value.

Example: High-value lens requires larger deposit
Given the lens replacement value is $2,400
When the deposit is calculated
Then the required deposit is based on the replacement value
And the renter sees the deposit before confirmation
```

### Scene: Payment recovery required

| Moment | Type | What happens |
| --- | --- | --- |
| Capture Payment | React | System attempts capture before handover. |
| Recover Failed Payment | Command | Renter updates payment inside a recovery window. |
| Release Booking | React | System releases the dates if recovery fails. |

```text
Rule: Payment capture must succeed before handover.

Example: Capture fails before pickup
Given the booking is approved
And the deposit hold exists
When payment capture fails before pickup
Then the renter gets a recovery window
And handover cannot proceed until recovery succeeds
```

## Narrative: Gear is handed over

**Goal:** high-value gear changes hands with enough evidence for both sides to trust the handover.

### Scene: Local handover required

High-value gear requires local handover. Shipping can be useful for lower-risk items, but expensive camera gear needs a product moment where both parties acknowledge the condition and transfer.

```text
Rule: High-value gear requires local handover.

Example: Expensive lens uses local pickup
Given the rental item is high value
When the booking is approved
Then the handover method is local pickup
And both parties receive handover instructions
```

### Scene: Gear handed over

| Moment | Type | What happens |
| --- | --- | --- |
| Confirm Pickup Identity | Command | Owner confirms the renter at pickup. |
| Confirm Handover | Command | Owner and renter confirm that the item changed hands. |

The handover moment is not just a button. It creates a product fact: the renter now has the gear.

### Scene: Pickup condition confirmed

This scene was missing in the first version of the model. The scratch dispute below reveals why it matters.

```text
Rule: High-value handover requires timestamped condition evidence.

Example: Pickup photos are recorded
Given Mara and Theo meet for handover
When they confirm pickup condition
Then timestamped condition photos are recorded
And both parties can see the evidence attached to the booking
```

## Narrative: Dispute is resolved

**Goal:** support resolves a dispute from recorded facts instead of reconstructing the product from memory.

### Scene: Dispute escalated

The renter reports that the lens was already scratched. The owner says the scratch happened during the rental.

### Scene: Facts reviewed

Support can review the facts the model told the product to capture:

- booking approval
- payment state
- handover confirmation
- return confirmation
- condition evidence
- messages relevant to the dispute

If pickup condition evidence was never captured, support has an ambiguity instead of a fact.

### Scene: Dispute resolved

Support decides whether to release the deposit, partially charge the renter, or escalate the case.

```text
Rule: Support can review recorded facts during disputes.

Example: Support reviews condition evidence
Given a dispute is opened for a high-value rental
And pickup and return condition photos exist
When support reviews the dispute
Then support can inspect the condition evidence
And the dispute decision is recorded
```

### Scene: Model updated

The missing pickup-condition fact is not just a support problem. It is a modeling gap. The product model updates so future rentals capture the missing evidence.

## Rules that came from pain

- Deposit amount is tied to item value.
- High-value gear requires local handover.
- Payment capture must succeed before handover.
- Support can review recorded facts during disputes.
- High-value handover requires timestamped condition evidence.

## Access control

The product model should say who can inspect which facts.

| Actor | Access |
| --- | --- |
| Owner | Booking, renter profile summary, payout, handover steps. |
| Renter | Booking, payment status, handover instructions. |
| Support agent | Dispute facts and condition evidence. |
| Payment integration | Payment state needed to authorize, capture, and release funds. |

Nobody gets unnecessary access to card details or private payout internals.

## Workflow reversal

Payment capture failure changes the workflow.

```text
Booking is pending.
Deposit is held.
Capture fails.
Renter gets a recovery window.
If recovery fails, hold releases, dates release, owner can choose another renter.
If recovery succeeds, handover can proceed.
```

This is not an error message. It is a real product path with rules, timing, notifications, and released inventory.

## Replayable facts and missing facts

Recorded facts help support reconstruct what happened.

Missing facts expose modeling gaps.

The product model defines what the product must remember. The event log records what happened. If the model never asked for pickup condition evidence, replay cannot answer who caused the scratch.

## Model delta after the scratch dispute

```text
Added:
- Rule: High-value gear requires timestamped pickup photos.
- Moment: Confirm pickup condition.
- Actor confirmation: Owner and renter both confirm condition.
- Fact: Pickup condition evidence recorded.
- Support view: Condition evidence visible during disputes.

Affected:
- Handover workflow
- Support workflow
- Privacy rules
- Storage policy
- Notification copy
```

Pain becomes structure when the model changes first.

---
'@onauto/narrative': major
---

Narrative-scoped `Actor`/`Entity`, new `Moment.noun`, restored `assumptions`, and whitelist audit.

**Schema changes:**

- `modelSchema` (Domain): removes `actors` and `entities`. `capability` is now the only model-level metadata field.
- `NarrativeSchema`: `actors` and `entities` are now full `Actor[]` / `Entity[]` arrays (were `string[]` name references). Adds `assumptions: string[]` — journey-specific assumptions.
- `SceneSchema`, `SceneNamesOnlySchema`: remove `actors` and `entities`.
- `NarrativePlanningSchema` and `NarrativePlanningNarrativeSchema`: mirror the new Narrative shape (full-object `actors`/`entities`, new `assumptions`, no top-level domain actors/entities).
- `BaseMomentSchema`: adds `noun?: string` alongside existing `initiator?: string`. Propagates to `CommandMomentSchema`, `QueryMomentSchema`, `ReactMomentSchema`, and `ExperienceMomentSchema`.

**DSL changes:**

- Removes `actor()`, `entity()`, `sceneActors()`, `sceneEntities()`. Migration: move full actor/entity definitions into the relevant `narrative(name, { actors: [...], entities: [...], assumptions: [...] })` call.
- `narrative()` config accepts `actors: (Actor | string)[]` and `entities: (Entity | string)[]` — the first narrative to introduce a name declares the canonical shape; later narratives may reference by name (string) or redeclare with an identical shape. Mismatched redeclarations throw.
- Adds `.noun(name)` on all four moment builders (command, query, react, experience). Parallel to existing `.initiator(name)`: references an entity by name.

**Validation:**

- `scenesToModel` validates that every `Moment.initiator` resolves to a declared actor name (across all narratives) and every `Moment.noun` resolves to a declared entity name. Unresolved references throw with scene/moment path. This is a tightening of existing behavior for `initiator` — code using unbound free-text initiators will fail fast.

**Emitter fixes (pre-existing debts):**

- `ALL_FLOW_FUNCTION_NAMES` whitelist now correctly includes `capability` (emitted but previously missing) and `thenError` (emitted but previously missing). Removes stale entries `actor`, `entity`, `assumptions`, `requirements` that no longer exist as exports.
- `flow.ts` extracts a generic `addStringMethodToChain` helper so `initiator` and `noun` emission share one code path.

**Tests:**

- `imports.whitelist.specs.ts` locks down future drift of the whitelist.
- `model-level-registry.actor-registry.specs.ts` covers redeclaration dedup, string-ref resolution, conflicting-shape throws, and moment-reference validation (both initiator and noun).
- `round-trip.specs.ts` exercises the full Model → emit → re-parse → Model cycle, preserving `capability`, narrative `actors`/`entities`/`assumptions`, and moment `initiator`/`noun`.

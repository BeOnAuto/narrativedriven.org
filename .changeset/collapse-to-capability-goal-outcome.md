---
'@onauto/narrative': major
---

Collapse Domain/Narrative/Scene to capability/goal/outcome.

Breaking schema changes:

- **Domain (modelSchema + NarrativePlanningSchema)**: removes `outcome`, `requirements`, `assumptions`; adds `capability` — a single sentence naming the coherent business capability the system represents.
- **Narrative**: removes `description`, `outcome`, `requirements`, `assumptions`, `impact`; adds `goal` — the broader user/business goal the narrative fulfils. Keeps/adds `actors` and `entities` (references to domain actors/entities).
- **Scene**: removes `description`, `requirements`, `assumptions`, and the `scene` classification tokens (kind/pattern/route); adds `outcome` — the single outcome the scene achieves. Also gains `actors` and `entities`.
- Drops `SceneClassificationSchema`, `SceneRouteSchema`, `ImpactSchema` (plus their exported types) from the public API.

Breaking DSL changes:

- `assumptions()` and `requirements()` are removed.
- `outcome()` is now scene-level only; calling it outside a scene throws.
- New `capability(value)` sets the model-level capability; throws inside a scene.
- New `sceneActors(...names)` and `sceneEntities(...names)` append to the current scene's actors/entities arrays.
- `NarrativeDefinition` (`narrative(name, { … })`) drops `outcome`/`assumptions`/`requirements`/`impact` and takes `goal`/`actors`/`entities`.

Consumers must migrate to the new field names; there is no backward-compatibility shim in this package.

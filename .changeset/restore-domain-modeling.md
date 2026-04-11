---
"@onauto/narrative": minor
---

Restore domain modeling metadata and add model-level outcome

- Restore ActorSchema, EntitySchema, ImpactSchema and metadata fields on Narrative/Scene/Model schemas
- Restore model-level registry with actor(), entity(), narrative(), assumptions(), requirements() DSL functions
- Restore .initiator() on all fluent moment builders
- Restore assembleSpecs with buildNarratives and model metadata passthrough
- Restore model-to-narrative code generation pipeline (stream, initiator, via, metadata file)
- Add model-level outcome field with full pipeline coverage (schema, DSL, code-to-model, model-to-code)
- Fix ModelMetadata type to use Pick<Model, ...> instead of manual type declaration
- Eliminate duplicate field-presence checks in metadata generator
- Simplify narrative-to-model index.ts by removing redundant per-field filtering

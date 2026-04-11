# Ketchup Plan: Restore domain modeling metadata from auto-engineer migration

## TODO

- [ ] Burst 1: Restore ActorSchema, EntitySchema, ImpactSchema in schema.ts + tests
- [ ] Burst 2: Restore metadata fields on NarrativeSchema + tests
- [ ] Burst 3: Restore metadata fields on SceneSchema + tests
- [ ] Burst 4: Restore metadata fields on ModelSchema + tests
- [ ] Burst 5: Copy model-level-registry.ts + specs from old repo
- [ ] Burst 6: Restore addSceneAssumptions/setSceneRequirements in narrative-context.ts
- [ ] Burst 7: Restore actor/entity/narrative/assumptions/requirements DSL functions in narrative.ts + index.ts exports
- [ ] Burst 8: Restore .initiator() on fluent builders + tests
- [ ] Burst 9: Copy metadata.ts generator + specs
- [ ] Burst 10: Restore stream/initiator/via chain helpers in flow.ts
- [ ] Burst 11: Restore generateMetadataFile in model-to-narrative/index.ts + test coverage
- [ ] Burst 12: Restore full assemble.ts with buildNarratives + multi-param assembleSpecs
- [ ] Burst 13: Copy assemble.specs.ts from old repo
- [ ] Burst 14: Restore narrative-to-model/index.ts registry integration
- [ ] Burst 15: Restore modelLevelRegistry.clearAll() in loader/index.ts

## DONE

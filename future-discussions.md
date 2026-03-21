# Future Discussions

Topics for deeper exploration in future sessions. These are ideas and areas that need dedicated conversation before being incorporated into the docs or platform.

## Definitive Narrative Definition

Narratives are multifaceted and multimodal — the current working description (progressive disclosure medium for entities, attributes, behaviours, and interactions) captures one dimension but not the full picture. Needs its own dedicated discussion to arrive at a canonical definition.

## Testing Pyramid Mapping

How NDD constructs map to testing levels:
- Scenes define paths — how do they relate to E2E tests?
- Moments have depth (multiple business specs with happy/unhappy examples) — how does this map to integration tests?
- Component-level permutations (email validation regex, etc.) sit below moments — how is this relationship formalized?
- A scene-level E2E test "skims across" moments picking one example at each — is this worth stating formally?

## Intellectual Foundations

Deeper treatment of the traditions NDD synthesizes:
- BDD Discovery and Formulation (Seb Rose, Gaspar Nagy) — Example Mapping, BRIEF principles, essential vs incidental detail
- Specification by Example (Gojko Adzic) — living documentation, collaborative specification workshops
- Disney/Airbnb storyboarding — progressive disclosure, crafting experience per moment
- Consider a dedicated "Intellectual Foundations" section or expanded "Standing on Shoulders" page

## Notable People

Consider referencing in the docs:
- Seb Rose and Gaspar Nagy (BDD Books: Discovery, Formulation)
- Gojko Adzic (Specification by Example)
- Matt Wynne (Example Mapping, Cucumber)
- Brian Chesky (Airbnb Snow White method)
- Dan North (BDD originator)

## Advanced Branching Patterns

- Cross-narrative branching: when and how to model it
- Circular/looping branches (actor returns to an earlier scene)
- Branching depth limits — when does branching indicate the model needs restructuring?
- How branching interacts with data completeness across narratives

## Cross-Narrative Data Completeness Validation

- Tooling to automatically verify data completeness chains across narrative boundaries
- Visualizing event flow across narratives
- Detecting orphan events and phantom data across the full model

## Collaborative NDD Sessions

- How NDD sessions differ from traditional BDD workshops
- The role of AI as a participant in collaborative modeling
- Updated facilitation guide incorporating narrative/scene/moment structure

## Deeper Rubric Development

- Expand the scene-worthiness rubric with more examples
- Edge cases: when does a business spec edge case graduate to its own scene?
- Incidental detail patterns specific to different domain types

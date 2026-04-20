import type { Message, Model, Narrative, Scene } from '../../index';
import type { NarrativeDefinition } from '../../model-level-registry';
import { deriveModules } from './derive-modules';

type ModelMetadata = Pick<Model, 'actors' | 'entities' | 'capability'>;

export function assembleSpecs(
  scenes: Scene[],
  messages: Message[],
  integrations?: Model['integrations'],
  modelMetadata?: ModelMetadata,
  narrativeDefinitions?: NarrativeDefinition[],
): Model {
  const modules = deriveModules(scenes, messages);

  const narratives = buildNarratives(scenes, narrativeDefinitions);

  return {
    variant: 'specs' as const,
    scenes,
    messages,
    integrations,
    modules,
    narratives,
    ...(modelMetadata?.actors?.length ? { actors: modelMetadata.actors } : {}),
    ...(modelMetadata?.entities?.length ? { entities: modelMetadata.entities } : {}),
    ...(modelMetadata?.capability ? { capability: modelMetadata.capability } : {}),
  };
}

function buildNarratives(scenes: Scene[], definitions?: NarrativeDefinition[]): Narrative[] {
  if (!definitions || definitions.length === 0) {
    return [
      {
        name: 'Default',
        sceneIds: scenes.filter((s) => s.id).map((s) => s.id!),
      },
    ];
  }

  const nameToId = new Map(scenes.filter((s) => s.id).map((s) => [s.name, s.id!]));
  const coveredSceneIds = new Set<string>();

  const narratives: Narrative[] = definitions.map((def) => {
    const sceneIds = (def.scenes ?? [])
      .map((name) => nameToId.get(name))
      .filter((id): id is string => id !== undefined);
    for (const id of sceneIds) coveredSceneIds.add(id);

    const nar: Narrative = { name: def.name, sceneIds };
    if (def.id) nar.id = def.id;
    if (def.goal) nar.goal = def.goal;
    if (def.actors?.length) nar.actors = def.actors;
    if (def.entities?.length) nar.entities = def.entities;
    if (def.assumptions?.length) nar.assumptions = def.assumptions;
    return nar;
  });

  const uncoveredIds = scenes.filter((s) => s.id && !coveredSceneIds.has(s.id)).map((s) => s.id!);
  if (uncoveredIds.length > 0) {
    narratives.push({ name: 'Default', sceneIds: uncoveredIds });
  }

  return narratives;
}

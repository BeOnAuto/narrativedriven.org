import type { Actor, Entity, Message, Model, Moment, Narrative, Scene } from '../../index';
import type { NarrativeDefinition } from '../../model-level-registry';
import { deriveModules } from './derive-modules';

type ModelMetadata = Pick<Model, 'capability'>;
type NamedObject = { name: string };

export function assembleSpecs(
  scenes: Scene[],
  messages: Message[],
  integrations?: Model['integrations'],
  modelMetadata?: ModelMetadata,
  narrativeDefinitions?: NarrativeDefinition[],
): Model {
  const modules = deriveModules(scenes, messages);

  const { narratives, actorNames, entityNames } = buildNarratives(scenes, narrativeDefinitions);

  validateMomentReferences(scenes, actorNames, entityNames);

  return {
    variant: 'specs' as const,
    scenes,
    messages,
    integrations,
    modules,
    narratives,
    ...(modelMetadata?.capability ? { capability: modelMetadata.capability } : {}),
  };
}

function resolveNamedRegistry<T extends NamedObject>(
  kindLabel: 'actor' | 'entity',
  flatEntries: Array<{ narrativeName: string; ref: T | string }>,
): Map<string, T> {
  const registry = new Map<string, T>();
  const originNarrative = new Map<string, string>();
  for (const { narrativeName, ref } of flatEntries) {
    if (typeof ref === 'string') {
      if (!registry.has(ref)) {
        throw new Error(`${kindLabel} "${ref}" referenced in narrative "${narrativeName}" but never defined`);
      }
      continue;
    }
    const existing = registry.get(ref.name);
    if (existing === undefined) {
      registry.set(ref.name, ref);
      originNarrative.set(ref.name, narrativeName);
    } else if (JSON.stringify(existing) !== JSON.stringify(ref)) {
      throw new Error(
        `${kindLabel} "${ref.name}" redeclared with different shape ` +
          `(first in narrative "${originNarrative.get(ref.name)}", conflict in narrative "${narrativeName}")`,
      );
    }
  }
  return registry;
}

function flattenRefs<T extends NamedObject>(
  definitions: NarrativeDefinition[],
  pick: (d: NarrativeDefinition) => Array<T | string> | undefined,
): Array<{ narrativeName: string; ref: T | string }> {
  const out: Array<{ narrativeName: string; ref: T | string }> = [];
  for (const def of definitions) {
    for (const ref of pick(def) ?? []) {
      out.push({ narrativeName: def.name, ref });
    }
  }
  return out;
}

function buildNarratives(
  scenes: Scene[],
  definitions?: NarrativeDefinition[],
): { narratives: Narrative[]; actorNames: Set<string>; entityNames: Set<string> } {
  if (!definitions || definitions.length === 0) {
    return {
      narratives: [
        {
          name: 'Default',
          sceneIds: scenes.filter((s) => s.id).map((s) => s.id!),
        },
      ],
      actorNames: new Set(),
      entityNames: new Set(),
    };
  }

  const actorRegistry = resolveNamedRegistry<Actor>(
    'actor',
    flattenRefs<Actor>(definitions, (d) => d.actors as Array<Actor | string> | undefined),
  );
  const entityRegistry = resolveNamedRegistry<Entity>(
    'entity',
    flattenRefs<Entity>(definitions, (d) => d.entities as Array<Entity | string> | undefined),
  );

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
    if (def.actors?.length) {
      nar.actors = def.actors.map((r) => (typeof r === 'string' ? actorRegistry.get(r)! : r));
    }
    if (def.entities?.length) {
      nar.entities = def.entities.map((r) => (typeof r === 'string' ? entityRegistry.get(r)! : r));
    }
    if (def.assumptions?.length) nar.assumptions = def.assumptions;
    return nar;
  });

  const uncoveredIds = scenes.filter((s) => s.id && !coveredSceneIds.has(s.id)).map((s) => s.id!);
  if (uncoveredIds.length > 0) {
    narratives.push({ name: 'Default', sceneIds: uncoveredIds });
  }

  return {
    narratives,
    actorNames: new Set(actorRegistry.keys()),
    entityNames: new Set(entityRegistry.keys()),
  };
}

function validateMomentReferences(
  scenes: Scene[],
  actorNames: Set<string>,
  entityNames: Set<string>,
): void {
  for (const scene of scenes) {
    scene.moments.forEach((moment: Moment, index) => {
      if (moment.initiator && !actorNames.has(moment.initiator)) {
        throw new Error(
          `scene "${scene.name}", moment "${moment.name}" (index ${index}): ` +
            `initiator "${moment.initiator}" is not a declared actor`,
        );
      }
      if (moment.noun && !entityNames.has(moment.noun)) {
        throw new Error(
          `scene "${scene.name}", moment "${moment.name}" (index ${index}): ` +
            `noun "${moment.noun}" is not a declared entity`,
        );
      }
    });
  }
}

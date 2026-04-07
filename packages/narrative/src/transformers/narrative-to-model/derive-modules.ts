import type { Message, Module, Scene } from '../../index';

const DEFAULT_SOURCE_FILE = 'generated.narrative.ts';

export function deriveModules(scenes: Scene[], messages: Message[]): Module[] {
  const bySourceFile = groupScenesBySourceFile(scenes);

  return Array.from(bySourceFile.entries()).map(([sourceFile, scns], index) => {
    const sceneIds = scns.map((n, i) => n.id ?? `__derived_${index}_${i}_${n.name}`);
    const messageRefs = messages
      .map((m) => ({ kind: m.type, name: m.name }))
      .sort((a, b) => `${a.kind}:${a.name}`.localeCompare(`${b.kind}:${b.name}`));

    return {
      sourceFile,
      isDerived: true,
      contains: { sceneIds },
      declares: { messages: messageRefs },
    };
  });
}

function groupScenesBySourceFile(scenes: Scene[]): Map<string, Scene[]> {
  const groups = new Map<string, Scene[]>();

  for (const scene of scenes) {
    const sourceFile = scene.sourceFile ?? DEFAULT_SOURCE_FILE;
    if (!groups.has(sourceFile)) {
      groups.set(sourceFile, []);
    }
    groups.get(sourceFile)!.push(scene);
  }

  return groups;
}

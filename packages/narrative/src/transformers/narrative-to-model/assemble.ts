import type { Message, Model, Narrative, Scene } from '../../index';
import { deriveModules } from './derive-modules';

export function assembleSpecs(scenes: Scene[], messages: unknown[], integrations: unknown[]): Model {
  const typedMessages = messages as Message[];
  const modules = deriveModules(scenes, typedMessages);

  const narratives: Narrative[] = [
    {
      name: 'Default',
      sceneIds: scenes.filter((s) => s.id).map((s) => s.id!),
    },
  ];

  return {
    variant: 'specs' as const,
    scenes,
    messages: typedMessages,
    integrations: integrations as Model['integrations'],
    modules,
    narratives,
  };
}

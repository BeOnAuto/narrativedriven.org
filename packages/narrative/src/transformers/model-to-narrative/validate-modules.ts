import type { Model } from '../../index';
import { toMessageKey } from './ordering';

export interface ValidationError {
  type:
    | 'duplicate_sourceFile'
    | 'scene_unassigned'
    | 'scene_multi_assigned'
    | 'message_multi_declared'
    | 'message_undeclared'
    | 'scene_not_found';
  message: string;
}

export function validateModules(model: Model): ValidationError[] {
  const errors: ValidationError[] = [];
  const modules = model.modules ?? [];

  if (modules.length === 0) {
    return errors;
  }

  errors.push(...validateUniqueSourceFiles(modules));

  const authoredModules = modules.filter((m) => !m.isDerived);
  if (authoredModules.length === 0) {
    return errors;
  }

  errors.push(...validateSceneAssignments(authoredModules, model));
  errors.push(...validateMessageDeclarations(authoredModules, model));

  return errors;
}

function validateUniqueSourceFiles(modules: Model['modules']): ValidationError[] {
  const errors: ValidationError[] = [];
  const sourceFileCounts = new Map<string, number>();

  for (const module of modules) {
    sourceFileCounts.set(module.sourceFile, (sourceFileCounts.get(module.sourceFile) ?? 0) + 1);
  }

  for (const [sourceFile, count] of sourceFileCounts) {
    if (count > 1) {
      errors.push({
        type: 'duplicate_sourceFile',
        message: `Module sourceFile '${sourceFile}' is used by ${count} modules`,
      });
    }
  }

  return errors;
}

function validateSceneAssignments(authoredModules: Model['modules'], model: Model): ValidationError[] {
  const errors: ValidationError[] = [];
  const sceneAssignments = new Map<string, string[]>();

  for (const module of authoredModules) {
    for (const sceneId of module.contains.sceneIds) {
      if (!sceneAssignments.has(sceneId)) {
        sceneAssignments.set(sceneId, []);
      }
      sceneAssignments.get(sceneId)!.push(module.sourceFile);
    }
  }

  const modelSceneIds = new Set(model.scenes.map((n) => n.id).filter((id): id is string => id !== undefined));

  for (const [sceneId, moduleSourceFiles] of sceneAssignments) {
    if (!modelSceneIds.has(sceneId)) {
      errors.push({
        type: 'scene_not_found',
        message: `Scene '${sceneId}' referenced by module(s) [${moduleSourceFiles.join(', ')}] does not exist`,
      });
    }
    if (moduleSourceFiles.length > 1) {
      errors.push({
        type: 'scene_multi_assigned',
        message: `Scene '${sceneId}' is assigned to multiple modules: [${moduleSourceFiles.join(', ')}]`,
      });
    }
  }

  const assignedSceneIds = new Set(sceneAssignments.keys());
  for (const scene of model.scenes) {
    if (scene.id && !assignedSceneIds.has(scene.id)) {
      errors.push({
        type: 'scene_unassigned',
        message: `Scene '${scene.id}' (${scene.name}) is not assigned to any module`,
      });
    }
  }

  return errors;
}

function validateMessageDeclarations(authoredModules: Model['modules'], model: Model): ValidationError[] {
  const errors: ValidationError[] = [];
  const messageDeclarations = new Map<string, string[]>();

  for (const module of authoredModules) {
    for (const msg of module.declares.messages) {
      const key = toMessageKey(msg.kind, msg.name);
      if (!messageDeclarations.has(key)) {
        messageDeclarations.set(key, []);
      }
      messageDeclarations.get(key)!.push(module.sourceFile);
    }
  }

  for (const [msgKey, moduleSourceFiles] of messageDeclarations) {
    if (moduleSourceFiles.length > 1) {
      errors.push({
        type: 'message_multi_declared',
        message: `Message '${msgKey}' is declared by multiple modules: [${moduleSourceFiles.join(', ')}]`,
      });
    }
  }

  const declaredMessages = new Set(messageDeclarations.keys());
  const modelMessageKeys = new Set(model.messages.map((m) => toMessageKey(m.type, m.name)));

  for (const msgKey of modelMessageKeys) {
    if (!declaredMessages.has(msgKey)) {
      errors.push({
        type: 'message_undeclared',
        message: `Message '${msgKey}' exists in model but is not declared by any authored module`,
      });
    }
  }

  return errors;
}

export function throwOnValidationErrors(errors: ValidationError[]): void {
  if (errors.length > 0) {
    const messages = errors.map((e) => `  - ${e.message}`).join('\n');
    throw new Error(`Module validation failed:\n${messages}`);
  }
}

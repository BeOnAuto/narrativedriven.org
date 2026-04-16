import type { Message, Model, Moment, Scene } from '../../index';
import { integrationExportRegistry } from '../../integration-export-registry';
import { globalIntegrationRegistry } from '../../integration-registry';
import type { TypeInfo } from '../../loader/ts-utils';
import { modelLevelRegistry } from '../../model-level-registry';
import { getClassificationFor } from '../../types';
import { assembleSpecs } from './assemble';
import { applyExampleShapeHints, type ExampleShapeHints } from './example-shapes';
import { inlineAllMessageFieldTypes } from './inlining';
import { extractMessagesFromIntegrations, processDataItemIntegrations } from './integrations';
import { processGiven, processThen, processWhen } from './spec-processors';
import { matchesScenePattern } from './strings';
import { buildTypeInfoFromMessages, resolveInferredType } from './type-inference';

type TypeResolver = (
  t: string,
  expected?: 'command' | 'event' | 'state' | 'query',
  exampleData?: unknown,
) => { resolvedName: string; typeInfo: TypeInfo | undefined };

function buildUnionTypes(typesByFile?: Map<string, Map<string, TypeInfo>>): Map<string, TypeInfo> | undefined {
  if (!typesByFile) return undefined;
  const u = new Map<string, TypeInfo>();
  for (const [, m] of typesByFile) for (const [k, v] of m) u.set(k, v);
  return u.size ? u : undefined;
}

function getTypesForScene(
  scene: Scene,
  typesByFile?: Map<string, Map<string, TypeInfo>>,
): Map<string, TypeInfo> | undefined {
  if (!typesByFile) return undefined;

  const sf = (scene as Record<string, unknown>).sourceFile as string | undefined;
  if (typeof sf === 'string') {
    const exact = typesByFile.get(sf) || typesByFile.get(sf.replace(/\\/g, '/'));
    if (exact && exact.size > 0) return exact;
  }

  for (const [filePath, fileTypes] of typesByFile) {
    const fileName = filePath.toLowerCase();
    if (matchesScenePattern(fileName, scene.name)) {
      return fileTypes;
    }
  }
  return undefined;
}

function tryResolveFromSceneTypes(
  t: string,
  sceneSpecificTypes: Map<string, TypeInfo>,
  expected?: 'command' | 'event' | 'state' | 'query',
  exampleData?: unknown,
): { resolvedName: string; typeInfo: TypeInfo | undefined } {
  if (t !== 'InferredType') {
    const typeInfo = sceneSpecificTypes.get(t);
    if (typeInfo) {
      return { resolvedName: t, typeInfo };
    }
    const inferredName = resolveInferredType(t, sceneSpecificTypes, expected, exampleData);
    return { resolvedName: inferredName, typeInfo: sceneSpecificTypes.get(inferredName) };
  }

  const inferredName = resolveInferredType(t, sceneSpecificTypes, expected, exampleData);
  return { resolvedName: inferredName, typeInfo: sceneSpecificTypes.get(inferredName) };
}

function tryFallbackToUnionTypes(
  t: string,
  resolvedName: string,
  typeInfo: TypeInfo | undefined,
  unionTypes: Map<string, TypeInfo>,
  expected?: 'command' | 'event' | 'state' | 'query',
  exampleData?: unknown,
): { resolvedName: string; typeInfo: TypeInfo | undefined } {
  if (resolvedName !== 'InferredType' && typeInfo) {
    return { resolvedName, typeInfo };
  }

  const fallbackName = resolveInferredType(t, unionTypes, expected, exampleData);
  const fallbackTypeInfo = unionTypes.get(fallbackName);

  if (fallbackName !== 'InferredType' && fallbackTypeInfo) {
    return { resolvedName: fallbackName, typeInfo: fallbackTypeInfo };
  }

  return { resolvedName, typeInfo };
}

function tryResolveFromUnionTypes(
  t: string,
  unionTypes: Map<string, TypeInfo>,
  expected?: 'command' | 'event' | 'state' | 'query',
  exampleData?: unknown,
): { resolvedName: string; typeInfo: TypeInfo | undefined } {
  if (t !== 'InferredType') {
    const typeInfo = unionTypes.get(t);
    if (typeInfo) {
      return { resolvedName: t, typeInfo };
    }
    const inferredName = resolveInferredType(t, unionTypes, expected, exampleData);
    return { resolvedName: inferredName, typeInfo: unionTypes.get(inferredName) };
  }

  const inferredName = resolveInferredType(t, unionTypes, expected, exampleData);
  return { resolvedName: inferredName, typeInfo: unionTypes.get(inferredName) };
}

function createTypeResolver(
  sceneSpecificTypes: Map<string, TypeInfo> | undefined,
  unionTypes: Map<string, TypeInfo> | undefined,
  messages: Map<string, Message>,
) {
  return (
    t: string,
    expected?: 'command' | 'event' | 'state' | 'query',
    exampleData?: unknown,
  ): { resolvedName: string; typeInfo: TypeInfo | undefined } => {
    let result: { resolvedName: string; typeInfo: TypeInfo | undefined } | undefined;

    if (sceneSpecificTypes) {
      const nr = tryResolveFromSceneTypes(t, sceneSpecificTypes, expected, exampleData);
      result = unionTypes
        ? tryFallbackToUnionTypes(t, nr.resolvedName, nr.typeInfo, unionTypes, expected, exampleData)
        : nr;
    } else if (unionTypes) {
      result = tryResolveFromUnionTypes(t, unionTypes, expected, exampleData);
    }

    if (result && result.resolvedName !== 'InferredType' && result.typeInfo !== undefined) {
      return result;
    }

    const messagesTypeMap = buildTypeInfoFromMessages(messages);
    if (messagesTypeMap) {
      const messageHit = tryResolveFromUnionTypes(t, messagesTypeMap, expected, exampleData);
      if (messageHit.typeInfo !== undefined) {
        return messageHit;
      }
    }

    // Last tier: runtime TypedRef factory registry (populated by
    // defineCommand / defineEvent / defineState / defineQuery at module load).
    const registryClassification = getClassificationFor(t);
    if (registryClassification !== undefined) {
      return {
        resolvedName: t,
        typeInfo: { stringLiteral: t, classification: registryClassification },
      };
    }

    return result ?? { resolvedName: t, typeInfo: undefined };
  };
}

function getServerSpecs(moment: Moment) {
  if ('server' in moment && moment.server?.specs !== undefined) {
    return moment.server.specs;
  }
  return undefined;
}

interface StepWithDocString {
  keyword: 'Given' | 'When' | 'Then' | 'And';
  text: string;
  __typeName?: string;
  docString?: Record<string, unknown>;
}

interface StepWithError {
  keyword: 'Then';
  error: { type: string; message?: string };
}

type Step = StepWithDocString | StepWithError;

function isStepWithError(step: Step): step is StepWithError {
  return 'error' in step;
}

function processSteps(
  steps: Step[],
  moment: Moment,
  resolveTypeAndInfo: TypeResolver,
  messages: Map<string, Message>,
  exampleShapeHints: ExampleShapeHints,
): void {
  let effectiveKeyword: 'Given' | 'When' | 'Then' = 'Given';

  for (const step of steps) {
    if (isStepWithError(step)) {
      continue;
    }

    const keyword = step.keyword;
    if (keyword !== 'And') {
      effectiveKeyword = keyword;
    }

    // Prefer __typeName when present (new sentence-form steps); fall back to
    // text for legacy steps where text still carries the type name.
    const typeName = step.__typeName ?? step.text;
    const refItem = {
      eventRef: typeName,
      commandRef: typeName,
      stateRef: typeName,
      exampleData: step.docString,
    };

    if (effectiveKeyword === 'Given') {
      processGiven([refItem], resolveTypeAndInfo, messages, exampleShapeHints);
    } else if (effectiveKeyword === 'When') {
      processWhen([refItem], moment, resolveTypeAndInfo, messages, exampleShapeHints);
    } else if (effectiveKeyword === 'Then') {
      processThen([refItem], resolveTypeAndInfo, messages, exampleShapeHints);
    }
  }
}

interface SpecWithRules {
  rules: Array<{ examples: Array<{ steps?: Step[] }> }>;
}

function isSpecWithRules(spec: unknown): spec is SpecWithRules {
  return (
    typeof spec === 'object' && spec !== null && 'rules' in spec && Array.isArray((spec as { rules: unknown[] }).rules)
  );
}

function processRuleExamples(
  rule: { examples: Array<{ steps?: Step[] }> },
  moment: Moment,
  resolveTypeAndInfo: TypeResolver,
  messages: Map<string, Message>,
  exampleShapeHints: ExampleShapeHints,
): void {
  if (!Array.isArray(rule.examples)) return;
  for (const example of rule.examples) {
    if (Array.isArray(example.steps)) {
      processSteps(example.steps, moment, resolveTypeAndInfo, messages, exampleShapeHints);
    }
  }
}

function processMomentSpecs(
  moment: Moment,
  resolveTypeAndInfo: TypeResolver,
  messages: Map<string, Message>,
  exampleShapeHints: ExampleShapeHints,
): void {
  const serverSpecs = getServerSpecs(moment);

  if (serverSpecs === undefined || !Array.isArray(serverSpecs)) return;

  for (const spec of serverSpecs) {
    if (isSpecWithRules(spec)) {
      for (const rule of spec.rules) {
        processRuleExamples(rule, moment, resolveTypeAndInfo, messages, exampleShapeHints);
      }
    }
  }
}

function processMomentIntegrations(
  moment: Moment,
  integrations: Map<string, { name: string; description?: string; source: string }>,
  messages: Map<string, Message>,
): void {
  // Integrations: from data & via
  if ('server' in moment && moment.server != null && 'data' in moment.server && moment.server.data !== undefined) {
    const dataItems = moment.server.data.items;
    if (Array.isArray(dataItems)) {
      dataItems.forEach((d: unknown) => {
        processDataItemIntegrations(d, integrations, messages);
      });
    }
  }
  if ('via' in moment && moment.via) {
    moment.via.forEach((integrationName: string) => {
      if (!integrations.has(integrationName)) {
        const sourcePath = integrationExportRegistry.getSourcePath(integrationName);
        if (sourcePath !== null && sourcePath !== undefined && sourcePath !== '') {
          integrations.set(integrationName, {
            name: integrationName,
            description: `${integrationName} integration`,
            source: sourcePath,
          });
        }
      }
    });
  }
}

function processScene(
  scene: Scene,
  getSceneSpecificTypes: (scene: Scene) => Map<string, TypeInfo> | undefined,
  unionTypes: Map<string, TypeInfo> | undefined,
  messages: Map<string, Message>,
  integrations: Map<string, { name: string; description?: string; source: string }>,
  exampleShapeHints: ExampleShapeHints,
): void {
  const sceneSpecificTypes = getSceneSpecificTypes(scene);
  const resolveTypeAndInfo = createTypeResolver(sceneSpecificTypes, unionTypes, messages);

  scene.moments.forEach((moment: Scene['moments'][number]) => {
    processMomentSpecs(moment, resolveTypeAndInfo, messages, exampleShapeHints);
    processMomentIntegrations(moment, integrations, messages);
  });
}

export const scenesToModel = (scenes: Scene[], typesByFile?: Map<string, Map<string, TypeInfo>>): Model => {
  const messages = new Map<string, Message>();
  const integrations = new Map<
    string,
    {
      name: string;
      description?: string;
      source: string;
    }
  >();
  const exampleShapeHints: ExampleShapeHints = new Map();

  // Pull messages defined by registered integrations first
  const registeredIntegrations = globalIntegrationRegistry.getAll();
  const integrationMessages = extractMessagesFromIntegrations(registeredIntegrations);
  for (const msg of integrationMessages) {
    if (!messages.has(msg.name)) messages.set(msg.name, msg);
  }

  // Build a union of all discovered types (global fallback across files)
  const unionTypes = buildUnionTypes(typesByFile);

  // pick the best map for a given flow
  const getSceneSpecificTypes = (scene: Scene): Map<string, TypeInfo> | undefined => {
    return getTypesForScene(scene, typesByFile);
  };

  scenes.forEach((scene) =>
    processScene(scene, getSceneSpecificTypes, unionTypes, messages, integrations, exampleShapeHints),
  );
  // Ensure all registered integrations are listed
  for (const integration of registeredIntegrations) {
    const exportName = integrationExportRegistry.getExportNameForIntegration(integration);
    if (!integrations.has(exportName)) {
      const sourcePath = integrationExportRegistry.getSourcePath(exportName);
      if (sourcePath !== null && sourcePath !== undefined && sourcePath !== '') {
        integrations.set(exportName, {
          name: exportName,
          description: `${exportName} integration`,
          source: sourcePath,
        });
      }
    }
  }
  // Apply example-driven structural shapes (e.g., Array<Product> -> Array<{ ... }>)
  applyExampleShapeHints(messages, exampleShapeHints);
  // Then inline resolvable identifiers via TypeInfo (if available)
  if (unionTypes) {
    inlineAllMessageFieldTypes(messages, unionTypes);
  }

  const { narrativeDefinitions, ...modelMetadata } = modelLevelRegistry.getAll();

  return assembleSpecs(
    scenes,
    Array.from(messages.values()),
    Array.from(integrations.values()),
    modelMetadata,
    narrativeDefinitions.length > 0 ? narrativeDefinitions : undefined,
  );
};

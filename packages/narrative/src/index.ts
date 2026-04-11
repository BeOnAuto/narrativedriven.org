export { gql } from 'graphql-tag';
export type {
  Command,
  Data,
  DataItem,
  DataSink,
  DataSinkItem,
  DataSource,
  DataSourceItem,
  Destination,
  Event,
  Integration,
  MessageTarget,
  Origin,
  Query,
  State,
} from './types';
export { createIntegration } from './types';

export const get = (strings: TemplateStringsArray, ...values: unknown[]) => {
  return strings.reduce((result, str, i) => {
    const value = values[i];
    return result + str + (value !== undefined && value !== null ? String(value) : '');
  }, '');
};

export type { DataTargetItem, FieldSelector } from './data-narrative-builders';

export { sink, source, target } from './data-narrative-builders';
export type {
  FluentCommandMomentBuilder,
  FluentExperienceMomentBuilder,
  FluentQueryMomentBuilder,
  FluentReactionMomentBuilder,
} from './fluent-builder';
export { command, decide, evolve, experience, query, react } from './fluent-builder';
export { getScenes } from './getScenes';
export { addAutoIds, hasAllIds } from './id';
export type { ExampleBuilder, GivenBuilder, MomentTypeValueInterface, ThenBuilder, WhenBuilder } from './narrative';
export {
  actor,
  assumptions,
  client,
  data,
  describe,
  entity,
  example,
  it,
  MomentType,
  narrative,
  request,
  requirements,
  rule,
  scene,
  server,
  should,
  specs,
  thenError,
} from './narrative';
export type { ParsedArg, ParsedGraphQlOperation } from './parse-graphql-request';
export { parseGraphQlRequest, parseMomentRequest } from './parse-graphql-request';
export * from './schema';
export { createNarrativeSpec, given as testGiven, when as testWhen } from './testing';
export type { GeneratedScenes } from './transformers/model-to-narrative';
export { modelToNarrative } from './transformers/model-to-narrative';
export { detectQueryAction, extractQueryNameFromRequest } from './transformers/narrative-to-model/spec-processors';
export { isInlineObject, isInlineObjectArray, parseInlineObjectFields } from './ts-type-helpers';
export type { MomentRequestValidationError } from './validate-slice-requests';
export { validateMomentRequests } from './validate-slice-requests';

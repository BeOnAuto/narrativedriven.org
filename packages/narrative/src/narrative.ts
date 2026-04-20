import createDebug from 'debug';
import type { DataTargetItem } from './data-narrative-builders';
import type { NarrativeDefinition } from './model-level-registry';
import { modelLevelRegistry } from './model-level-registry';
import {
  clearCurrentScene,
  endClientBlock,
  endServerBlock,
  getCurrentMoment,
  getCurrentScene,
  popDescribe,
  pushDescribe,
  pushSpec,
  recordErrorStep,
  recordExample,
  recordIt,
  recordRule,
  recordStep,
  setMomentData,
  setSceneOutcome,
  startClientBlock,
  startScene,
  startServerBlock,
} from './narrative-context';
import { registry } from './narrative-registry';
import type { AnyTypedRef, Data, DataItem, DataOf } from './types';

const debug = createDebug('auto:narrative:narrative');
if ('color' in debug && typeof debug === 'object') {
  (debug as { color: string }).color = '6';
}

export function scene(name: string, fn: () => void): void;
export function scene(name: string, id: string, fn: () => void): void;
export function scene(name: string, idOrFn: string | (() => void), fn?: () => void): void {
  const id = typeof idOrFn === 'string' ? idOrFn : undefined;
  const callback = typeof idOrFn === 'function' ? idOrFn : fn!;

  debug('Starting scene definition: %s', name);
  const sceneObj = startScene(name, id);
  debug('Executing scene function for: %s', name);
  callback();
  debug('Scene function executed, registering scene: %s with %d moments', name, sceneObj.moments.length);
  registry.register(sceneObj);
  clearCurrentScene();
  debug('Scene registered and context cleared: %s', name);
}

export const client = (fn: () => void) => {
  const moment = getCurrentMoment();
  if (moment) {
    startClientBlock(moment);
    fn();
    endClientBlock();
  }
};

export const server = (fn: () => void) => {
  const moment = getCurrentMoment();
  if (moment) {
    startServerBlock(moment, '');
    fn();
    endServerBlock();
  }
};

export const request = (_query: unknown) => ({
  with: (..._dependencies: unknown[]) => {},
});

export function describe(fn: () => void): void;
export function describe(title: string, fn: () => void): void;
export function describe(title: string, id: string, fn: () => void): void;
export function describe(titleOrFn: string | (() => void), idOrFn?: string | (() => void), fn?: () => void): void {
  if (typeof titleOrFn === 'function') {
    const moment = getCurrentMoment();
    const inferredTitle = moment?.name ?? '';
    pushDescribe(inferredTitle, undefined);
    titleOrFn();
    popDescribe();
    return;
  }

  const title = titleOrFn;
  const hasId = typeof idOrFn === 'string';
  const id = hasId ? idOrFn : undefined;
  const callback = hasId ? fn! : (idOrFn as () => void);

  pushDescribe(title, id);
  callback();
  popDescribe();
}

export function it(title: string): void;
export function it(title: string, id: string): void;
export function it(title: string, id?: string): void {
  recordIt(title, id);
}

export function should(title: string): void;
export function should(title: string, id: string): void;
export function should(title: string, id?: string): void {
  recordIt(title, id);
}

export function specs(feature: string, fn: () => void): void;
export function specs(fn: () => void): void;
export function specs(featureOrFn: string | (() => void), fn?: () => void): void {
  const feature = typeof featureOrFn === 'string' ? featureOrFn : '';
  const callback = typeof featureOrFn === 'function' ? featureOrFn : fn!;

  pushSpec(feature);
  callback();
}

export function rule(name: string, fn: () => void): void;
export function rule(name: string, id: string, fn: () => void): void;
export function rule(name: string, idOrFn: string | (() => void), fn?: () => void): void {
  const id = typeof idOrFn === 'string' ? idOrFn : undefined;
  const callback = typeof idOrFn === 'function' ? idOrFn : fn!;
  recordRule(name, id);
  callback();
}

type ExtractData<T> = T extends { data: infer D } ? D : T;

/**
 * During migration both call shapes are supported:
 *  - Legacy:  `.given<MyType>(data)` — AST ordinal matching recovers the type name
 *  - New:     `.given(MyType, "sentence", data)` — TypedRef from factory carries the name
 */
export interface ThenBuilder {
  and<T>(data: ExtractData<T>): ThenBuilder;
  and<T extends AnyTypedRef>(ref: T, sentence: string, data: DataOf<T>): ThenBuilder;
}

export interface WhenBuilder {
  then<T>(data: ExtractData<T>): ThenBuilder;
  then<T extends AnyTypedRef>(ref: T, sentence: string, data: DataOf<T>): ThenBuilder;
  and<T>(data: ExtractData<T>): WhenBuilder;
  and<T extends AnyTypedRef>(ref: T, sentence: string, data: DataOf<T>): WhenBuilder;
}

export interface GivenBuilder {
  and<T>(data: ExtractData<T>): GivenBuilder;
  and<T extends AnyTypedRef>(ref: T, sentence: string, data: DataOf<T>): GivenBuilder;
  when<W>(data: ExtractData<W>): WhenBuilder;
  when<T extends AnyTypedRef>(ref: T, sentence: string, data: DataOf<T>): WhenBuilder;
  then<T>(data: ExtractData<T>): ThenBuilder;
  then<T extends AnyTypedRef>(ref: T, sentence: string, data: DataOf<T>): ThenBuilder;
}

export interface ExampleBuilder {
  given<T>(data: ExtractData<T>): GivenBuilder;
  given<T extends AnyTypedRef>(ref: T, sentence: string, data: DataOf<T>): GivenBuilder;
  when<W>(data: ExtractData<W>): WhenBuilder;
  when<T extends AnyTypedRef>(ref: T, sentence: string, data: DataOf<T>): WhenBuilder;
}

function isTypedRef(x: unknown): x is AnyTypedRef {
  return (
    x !== null &&
    typeof x === 'object' &&
    '__kind' in x &&
    'name' in x &&
    typeof (x as { name: unknown }).name === 'string'
  );
}

function dispatchStep(
  keyword: 'Given' | 'When' | 'Then' | 'And',
  arg1: unknown,
  sentence: string | undefined,
  data: unknown,
): void {
  if (isTypedRef(arg1)) {
    recordStep(keyword, sentence ?? '', data, arg1.name);
  } else {
    recordStep(keyword, 'InferredType', arg1);
  }
}

function createThenBuilder(): ThenBuilder {
  return {
    and(arg1: unknown, sentence?: string, data?: unknown): ThenBuilder {
      dispatchStep('And', arg1, sentence, data);
      return createThenBuilder();
    },
  } as ThenBuilder;
}

function createWhenBuilder(): WhenBuilder {
  return {
    then(arg1: unknown, sentence?: string, data?: unknown): ThenBuilder {
      dispatchStep('Then', arg1, sentence, data);
      return createThenBuilder();
    },
    and(arg1: unknown, sentence?: string, data?: unknown): WhenBuilder {
      dispatchStep('And', arg1, sentence, data);
      return createWhenBuilder();
    },
  } as WhenBuilder;
}

function createGivenBuilder(): GivenBuilder {
  return {
    and(arg1: unknown, sentence?: string, data?: unknown): GivenBuilder {
      dispatchStep('And', arg1, sentence, data);
      return createGivenBuilder();
    },
    when(arg1: unknown, sentence?: string, data?: unknown): WhenBuilder {
      dispatchStep('When', arg1, sentence, data);
      return createWhenBuilder();
    },
    then(arg1: unknown, sentence?: string, data?: unknown): ThenBuilder {
      dispatchStep('Then', arg1, sentence, data);
      return createThenBuilder();
    },
  } as GivenBuilder;
}

function createExampleBuilder(): ExampleBuilder {
  return {
    given(arg1: unknown, sentence?: string, data?: unknown): GivenBuilder {
      dispatchStep('Given', arg1, sentence, data);
      return createGivenBuilder();
    },
    when(arg1: unknown, sentence?: string, data?: unknown): WhenBuilder {
      dispatchStep('When', arg1, sentence, data);
      return createWhenBuilder();
    },
  } as ExampleBuilder;
}

export function example(name: string): ExampleBuilder;
export function example(name: string, id: string): ExampleBuilder;
export function example(name: string, id?: string): ExampleBuilder {
  recordExample(name, id);
  return createExampleBuilder();
}

type ErrorType = 'IllegalStateError' | 'ValidationError' | 'NotFoundError';

export function thenError(errorType: ErrorType, message?: string): void {
  recordErrorStep(errorType, message);
}

export const MomentType = {
  COMMAND: 'command' as const,
  QUERY: 'query' as const,
  REACT: 'react' as const,
} as const;

export interface MomentTypeValueInterface {
  readonly value: 'command' | 'query' | 'react';
}

export function data(config: Data | (DataItem | DataTargetItem)[]): void {
  const moment = getCurrentMoment();
  if (!moment) throw new Error('No active moment for data configuration');

  // Normalize to Data structure - cast needed since DataItem includes __type discriminator
  // which gets stripped by setMomentData
  const dataConfig: Data = Array.isArray(config) ? { items: config as unknown as Data['items'] } : config;

  const momentType = moment.type;

  if (momentType === MomentType.QUERY) {
    const hasSink = dataConfig.items.some((item) => '__type' in item && item.__type === 'sink');
    if (hasSink) {
      throw new Error('Query moments cannot have data sinks, only sources');
    }
  }

  setMomentData(dataConfig);
}

type NarrativeConfig = Omit<NarrativeDefinition, 'name' | 'id'>;

export function narrative(name: string, config: NarrativeConfig): void;
export function narrative(name: string, id: string, config: NarrativeConfig): void;
export function narrative(name: string, idOrConfig: string | NarrativeConfig, config?: NarrativeConfig): void {
  const id = typeof idOrConfig === 'string' ? idOrConfig : undefined;
  const cfg = typeof idOrConfig === 'string' ? config! : idOrConfig;

  const def: NarrativeDefinition = { name, ...cfg };
  if (id !== undefined) def.id = id;

  modelLevelRegistry.addNarrativeDefinition(def);
}

export function outcome(value: string): void {
  if (!getCurrentScene()) throw new Error('outcome() must be called inside a scene');
  setSceneOutcome(value);
}

export function capability(value: string): void {
  if (getCurrentScene()) throw new Error('capability() must be called at model level, not inside a scene');
  modelLevelRegistry.setCapability(value);
}

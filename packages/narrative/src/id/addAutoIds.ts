import type { ClientSpecNode, Example, Model, Moment, Rule, Spec, Step } from '../index';
import { generateAutoId } from './generators';

function ensureId(item: { id?: string }): void {
  if (item.id === undefined || item.id === '') {
    item.id = generateAutoId();
  }
}

function processSteps(steps: Step[]): Step[] {
  return steps.map((step) => {
    const stepCopy = { ...step };
    ensureId(stepCopy);
    return stepCopy;
  });
}

function processExamples(examples: Example[]): Example[] {
  return examples.map((example) => {
    const exampleCopy = { ...example };
    ensureId(exampleCopy);
    exampleCopy.steps = processSteps(example.steps);
    return exampleCopy;
  });
}

function processRules(rules: Rule[]): Rule[] {
  return rules.map((rule) => {
    const ruleCopy = { ...rule };
    ensureId(ruleCopy);
    ruleCopy.examples = processExamples(rule.examples);
    return ruleCopy;
  });
}

function processSpecs(specs: Spec[]): Spec[] {
  return specs.map((spec) => {
    const specCopy = { ...spec };
    ensureId(specCopy);
    specCopy.rules = processRules(spec.rules);
    return specCopy;
  });
}

function processServerSpecs(slice: Moment): Moment {
  if (!('server' in slice) || slice.server?.specs === undefined || !Array.isArray(slice.server.specs)) return slice;

  const modifiedMoment = structuredClone(slice);
  if (
    'server' in modifiedMoment &&
    modifiedMoment.server?.specs !== undefined &&
    Array.isArray(modifiedMoment.server.specs)
  ) {
    modifiedMoment.server.specs = processSpecs(modifiedMoment.server.specs);
  }
  return modifiedMoment;
}

function processClientSpecNodes(nodes: ClientSpecNode[]): ClientSpecNode[] {
  return nodes.map((node) => {
    const nodeCopy = { ...node };
    ensureId(nodeCopy);
    if (nodeCopy.type === 'describe' && nodeCopy.children) {
      nodeCopy.children = processClientSpecNodes(nodeCopy.children);
    }
    return nodeCopy;
  });
}

function processClientSpecs(slice: Moment): Moment {
  if (!('client' in slice) || slice.client?.specs === undefined || !Array.isArray(slice.client.specs)) return slice;

  const modifiedMoment = structuredClone(slice);
  if ('client' in modifiedMoment && modifiedMoment.client?.specs !== undefined) {
    modifiedMoment.client.specs = processClientSpecNodes(modifiedMoment.client.specs);
  }
  return modifiedMoment;
}

function processDataItems(slice: Moment): Moment {
  if (!('server' in slice) || !slice.server?.data) return slice;

  const modifiedMoment = structuredClone(slice);
  if ('server' in modifiedMoment && modifiedMoment.server?.data) {
    // Ensure the data wrapper has an ID
    ensureId(modifiedMoment.server.data);

    // Process items array if it exists
    if (Array.isArray(modifiedMoment.server.data.items)) {
      modifiedMoment.server.data.items = modifiedMoment.server.data.items.map((item) => {
        const itemCopy = { ...item };
        ensureId(itemCopy);
        if ('destination' in itemCopy && itemCopy._withState) {
          itemCopy._withState = { ...itemCopy._withState };
          ensureId(itemCopy._withState);
        }
        return itemCopy;
      });
    }
  }
  return modifiedMoment;
}

function processExits(slice: Moment): Moment {
  if (!slice.exits || !Array.isArray(slice.exits) || slice.exits.length === 0) return slice;

  const modifiedMoment = structuredClone(slice);
  if (modifiedMoment.exits) {
    modifiedMoment.exits = modifiedMoment.exits.map((exit) => {
      const exitCopy = { ...exit };
      ensureId(exitCopy);
      return exitCopy;
    });
  }
  return modifiedMoment;
}

function processMoment(slice: Moment): Moment {
  let sliceCopy = { ...slice };
  ensureId(sliceCopy);
  sliceCopy = processServerSpecs(sliceCopy);
  sliceCopy = processClientSpecs(sliceCopy);
  sliceCopy = processDataItems(sliceCopy);
  sliceCopy = processExits(sliceCopy);
  return sliceCopy;
}

export function addAutoIds(specs: Model): Model {
  const result = structuredClone(specs);
  result.scenes = result.scenes.map((scene) => {
    const sceneCopy = { ...scene };
    ensureId(sceneCopy);
    sceneCopy.moments = scene.moments.map(processMoment);
    return sceneCopy;
  });
  return result;
}

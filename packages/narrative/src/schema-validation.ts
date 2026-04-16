import type { z } from 'zod';
import type { ExampleSchema, SpecSchema, StepSchema } from './schema';
import { walkSteps } from './transformers/step-traversal';
import { getClassificationFor } from './types';

type Step = z.infer<typeof StepSchema>;
type Example = z.infer<typeof ExampleSchema>;
type Spec = z.infer<typeof SpecSchema>;

export type MomentKind = 'command' | 'query' | 'react' | 'experience';

/**
 * Allowed classifications per (moment-kind, effective keyword) slot.
 * Derived from what the codebase already supports — event-sourced systems
 * legitimately mix State+Event in Given; Query moments accept `Event`
 * (projection-rebuild) and `Query` (query-as-action) in When.
 *
 * Error steps (StepWithError) are unconditionally allowed in the Then slot
 * for command / query / react moments.
 */
const MATRIX: Record<
  Exclude<MomentKind, 'experience'>,
  { Given: ReadonlySet<string>; When: ReadonlySet<string>; Then: ReadonlySet<string> }
> = {
  command: {
    Given: new Set(['state', 'event']),
    When: new Set(['command']),
    Then: new Set(['event']),
  },
  query: {
    Given: new Set(['state', 'event']),
    When: new Set(['event', 'query']),
    Then: new Set(['state']),
  },
  react: {
    Given: new Set(['state', 'event']),
    When: new Set(['event']),
    Then: new Set(['command']),
  },
};

export interface ValidationError {
  scene: string;
  moment: string;
  example: string;
  stepIndex: number;
  effectiveKeyword: 'Given' | 'When' | 'Then';
  reason: string;
}

function isStepWithError(step: Step): step is Extract<Step, { error: unknown }> {
  return 'error' in step;
}

function validateExample(
  sceneName: string,
  momentName: string,
  momentKind: Exclude<MomentKind, 'experience'>,
  example: Example,
  errors: ValidationError[],
): void {
  const allowed = MATRIX[momentKind];
  const exampleName = example.name ?? '(unnamed)';

  for (const { step, index, effectiveKeyword } of walkSteps(example.steps)) {
    // Error steps are allowed in any Then slot; skip.
    if (isStepWithError(step)) {
      if (effectiveKeyword !== 'Then') {
        errors.push({
          scene: sceneName,
          moment: momentName,
          example: exampleName,
          stepIndex: index,
          effectiveKeyword,
          reason: `error step found under effective ${effectiveKeyword} — error steps are only valid under Then`,
        });
      }
      continue;
    }

    const name = step.__typeName ?? '';
    const classification = name ? getClassificationFor(name) : undefined;

    if (classification === undefined) {
      // Type isn't registered; the resolver couldn't classify it. This is an
      // author error — the type was never declared via a factory, or the step
      // was built by hand with a bogus name. Flag but don't halt.
      errors.push({
        scene: sceneName,
        moment: momentName,
        example: exampleName,
        stepIndex: index,
        effectiveKeyword,
        reason: `unknown type "${name}" — register it via a factory (defineCommand/defineEvent/defineState/defineQuery) before use`,
      });
      continue;
    }

    const allowedForSlot = allowed[effectiveKeyword];
    if (!allowedForSlot.has(classification)) {
      errors.push({
        scene: sceneName,
        moment: momentName,
        example: exampleName,
        stepIndex: index,
        effectiveKeyword,
        reason: `classification "${classification}" (on "${name}") is not allowed under ${momentKind}.${effectiveKeyword} — allowed: {${[...allowedForSlot].join(', ')}}`,
      });
    }
  }
}

function validateSpec(
  sceneName: string,
  momentName: string,
  momentKind: Exclude<MomentKind, 'experience'>,
  spec: Spec,
  errors: ValidationError[],
): void {
  for (const rule of spec.rules) {
    for (const example of rule.examples) {
      validateExample(sceneName, momentName, momentKind, example, errors);
    }
  }
}

/**
 * Validate moment-type classification across every step in every example of
 * every server spec on every scene's moments. Returns the list of violations.
 */
export function validateSceneClassifications(
  scenes: Array<{
    name: string;
    moments: Array<
      | { name: string; type: 'command'; server?: { specs?: Spec[] } }
      | { name: string; type: 'query'; server?: { specs?: Spec[] } }
      | { name: string; type: 'react'; server?: { specs?: Spec[] } }
      | { name: string; type: 'experience' }
    >;
  }>,
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const scene of scenes) {
    for (const moment of scene.moments) {
      if (moment.type === 'experience') continue;
      const specs = moment.server?.specs;
      if (!specs) continue;

      for (const spec of specs) {
        validateSpec(scene.name, moment.name, moment.type, spec, errors);
      }
    }
  }

  return errors;
}

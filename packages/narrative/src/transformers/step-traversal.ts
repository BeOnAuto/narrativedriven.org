import type { z } from 'zod';
import type { StepSchema } from '../schema';

type Step = z.infer<typeof StepSchema>;

export type EffectiveKeyword = 'Given' | 'When' | 'Then';

export interface StepWalkEntry {
  step: Step;
  index: number;
  effectiveKeyword: EffectiveKeyword;
}

/**
 * Iterate `steps` yielding each entry together with the effective keyword:
 * `And` steps inherit the keyword of the last Given/When/Then. A degenerate
 * array that starts with `And` is treated as Given.
 *
 * Shared by both pipeline directions (narrative-to-model, model-to-narrative)
 * and the moment-type classification validator.
 */
export function* walkSteps(steps: Step[]): Iterable<StepWalkEntry> {
  let effective: EffectiveKeyword = 'Given';
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (step.keyword !== 'And') {
      effective = step.keyword;
    }
    yield { step, index: i, effectiveKeyword: effective };
  }
}

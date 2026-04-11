import { afterEach, describe, expect, it } from 'vitest';
import { modelLevelRegistry } from './model-level-registry';
import { assumptions, requirements } from './narrative';
import { clearCurrentScene, getCurrentScene, startScene } from './narrative-context';

describe('assumptions() and requirements() 2-level dispatch', () => {
  afterEach(() => {
    modelLevelRegistry.clearAll();
    clearCurrentScene();
  });

  it('assumptions() at model level adds to registry', () => {
    assumptions('System is online', 'Data is consistent');

    expect(modelLevelRegistry.getAll().assumptions).toEqual(['System is online', 'Data is consistent']);
  });

  it('assumptions() inside scene adds to scene object', () => {
    startScene('Process');
    assumptions('Input is valid');

    expect(getCurrentScene()).toEqual({
      name: 'Process',
      moments: [],
      assumptions: ['Input is valid'],
    });
  });

  it('requirements() at model level sets on registry', () => {
    requirements('Must support multi-tenancy');

    expect(modelLevelRegistry.getAll().requirements).toBe('Must support multi-tenancy');
  });

  it('requirements() inside scene sets on scene object', () => {
    startScene('Process');
    requirements('Must validate before processing');

    expect(getCurrentScene()).toEqual({
      name: 'Process',
      moments: [],
      requirements: 'Must validate before processing',
    });
  });

  it('requirements() replaces previous value at model level', () => {
    requirements('First');
    requirements('Second');

    expect(modelLevelRegistry.getAll().requirements).toBe('Second');
  });

  it('assumptions() accumulates across multiple calls', () => {
    assumptions('A');
    assumptions('B', 'C');

    expect(modelLevelRegistry.getAll().assumptions).toEqual(['A', 'B', 'C']);
  });
});

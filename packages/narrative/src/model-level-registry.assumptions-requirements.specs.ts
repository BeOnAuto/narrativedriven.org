import { afterEach, describe, expect, it } from 'vitest';
import { modelLevelRegistry } from './model-level-registry';
import { assumptions, requirements } from './narrative';
import { clearCurrentScene, startScene } from './narrative-context';

describe('assumptions() and requirements() 2-level dispatch', () => {
  afterEach(() => {
    modelLevelRegistry.clearAll();
    clearCurrentScene();
  });

  it('assumptions() at model level adds to registry', () => {
    assumptions('System is online', 'Data is consistent');

    expect(modelLevelRegistry.getAll().assumptions).toEqual(['System is online', 'Data is consistent']);
  });

  it('assumptions() throws inside scene context', () => {
    startScene('Process');
    expect(() => assumptions('Input is valid')).toThrow(/model level/);
  });

  it('requirements() at model level sets on registry', () => {
    requirements('Must support multi-tenancy');

    expect(modelLevelRegistry.getAll().requirements).toBe('Must support multi-tenancy');
  });

  it('requirements() throws inside scene context', () => {
    startScene('Process');
    expect(() => requirements('Must validate before processing')).toThrow(/model level/);
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

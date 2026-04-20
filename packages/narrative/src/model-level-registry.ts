import type { Actor, Entity } from './schema';

export type NarrativeDefinition = {
  name: string;
  id?: string;
  scenes?: string[];
  goal?: string;
  actors?: Array<Actor | string>;
  entities?: Array<Entity | string>;
  assumptions?: string[];
};

class ModelLevelRegistry {
  private capability: string | undefined = undefined;
  private narrativeDefinitions: NarrativeDefinition[] = [];

  setCapability(value: string) {
    this.capability = value;
  }

  addNarrativeDefinition(def: NarrativeDefinition) {
    this.narrativeDefinitions.push(def);
  }

  getAll() {
    return {
      capability: this.capability,
      narrativeDefinitions: [...this.narrativeDefinitions],
    };
  }

  clearAll() {
    this.capability = undefined;
    this.narrativeDefinitions = [];
  }
}

export const modelLevelRegistry = new ModelLevelRegistry();

import type { Actor, Entity } from './schema';

export type NarrativeDefinition = {
  name: string;
  id?: string;
  scenes?: string[];
  goal?: string;
  actors?: string[];
  entities?: string[];
};

class ModelLevelRegistry {
  private actors: Actor[] = [];
  private entities: Entity[] = [];
  private capability: string | undefined = undefined;
  private narrativeDefinitions: NarrativeDefinition[] = [];

  addActor(actorDef: Actor) {
    this.actors.push(actorDef);
  }

  addEntity(entityDef: Entity) {
    this.entities.push(entityDef);
  }

  setCapability(value: string) {
    this.capability = value;
  }

  addNarrativeDefinition(def: NarrativeDefinition) {
    this.narrativeDefinitions.push(def);
  }

  getAll() {
    return {
      actors: [...this.actors],
      entities: [...this.entities],
      capability: this.capability,
      narrativeDefinitions: [...this.narrativeDefinitions],
    };
  }

  clearAll() {
    this.actors = [];
    this.entities = [];
    this.capability = undefined;
    this.narrativeDefinitions = [];
  }
}

export const modelLevelRegistry = new ModelLevelRegistry();

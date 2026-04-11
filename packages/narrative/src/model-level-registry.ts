import type { Actor, Entity, Impact } from './schema';

export type NarrativeDefinition = {
  name: string;
  id?: string;
  scenes?: string[];
  outcome?: string;
  impact?: Impact;
  actors?: string[];
  assumptions?: string[];
  requirements?: string;
};

class ModelLevelRegistry {
  private actors: Actor[] = [];
  private entities: Entity[] = [];
  private assumptions: string[] = [];
  private requirements: string | undefined = undefined;
  private narrativeDefinitions: NarrativeDefinition[] = [];

  addActor(actorDef: Actor) {
    this.actors.push(actorDef);
  }

  addEntity(entityDef: Entity) {
    this.entities.push(entityDef);
  }

  addAssumptions(items: string[]) {
    this.assumptions.push(...items);
  }

  setRequirements(doc: string) {
    this.requirements = doc;
  }

  addNarrativeDefinition(def: NarrativeDefinition) {
    this.narrativeDefinitions.push(def);
  }

  getAll() {
    return {
      actors: [...this.actors],
      entities: [...this.entities],
      assumptions: [...this.assumptions],
      requirements: this.requirements,
      narrativeDefinitions: [...this.narrativeDefinitions],
    };
  }

  clearAll() {
    this.actors = [];
    this.entities = [];
    this.assumptions = [];
    this.requirements = undefined;
    this.narrativeDefinitions = [];
  }
}

export const modelLevelRegistry = new ModelLevelRegistry();

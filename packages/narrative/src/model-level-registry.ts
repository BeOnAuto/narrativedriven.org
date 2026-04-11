import type { Actor, Entity } from './schema';

class ModelLevelRegistry {
  private actors: Actor[] = [];
  private entities: Entity[] = [];
  private assumptions: string[] = [];
  private requirements: string | undefined = undefined;

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

  getAll() {
    return {
      actors: [...this.actors],
      entities: [...this.entities],
      assumptions: [...this.assumptions],
      requirements: this.requirements,
    };
  }

  clearAll() {
    this.actors = [];
    this.entities = [];
    this.assumptions = [];
    this.requirements = undefined;
  }
}

export const modelLevelRegistry = new ModelLevelRegistry();

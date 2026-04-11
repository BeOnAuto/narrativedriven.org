import type { Actor, Entity } from './schema';

class ModelLevelRegistry {
  private actors: Actor[] = [];
  private entities: Entity[] = [];

  addActor(actorDef: Actor) {
    this.actors.push(actorDef);
  }

  addEntity(entityDef: Entity) {
    this.entities.push(entityDef);
  }

  getAll() {
    return {
      actors: [...this.actors],
      entities: [...this.entities],
    };
  }

  clearAll() {
    this.actors = [];
    this.entities = [];
  }
}

export const modelLevelRegistry = new ModelLevelRegistry();

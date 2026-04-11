import type { Actor } from './schema';

class ModelLevelRegistry {
  private actors: Actor[] = [];

  addActor(actorDef: Actor) {
    this.actors.push(actorDef);
  }

  getAll() {
    return {
      actors: [...this.actors],
    };
  }

  clearAll() {
    this.actors = [];
  }
}

export const modelLevelRegistry = new ModelLevelRegistry();

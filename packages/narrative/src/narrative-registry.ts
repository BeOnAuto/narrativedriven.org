import createDebug from 'debug';
import type { Scene } from './index';
import { SceneSchema } from './schema';

const debug = createDebug('auto:narrative:registry');
// Set non-error-like colors for debug namespace
// Colors: 0=gray, 1=red, 2=green, 3=yellow, 4=blue, 5=magenta, 6=cyan
if ('color' in debug && typeof debug === 'object') {
  (debug as { color: string }).color = '6'; // cyan
}

class SceneRegistry {
  private scenes: Scene[] = [];
  private instanceId = Math.random().toString(36).substring(7);

  constructor() {
    debug('Creating new SceneRegistry instance: %s', this.instanceId);
  }

  register(scene: Scene) {
    debug('Registering scene: %s on instance %s', scene.name, this.instanceId);
    debug('Scene moments: %d', scene.moments.length);
    debug('Scenes array before push: %d', this.scenes.length);
    debug('Array object ID before: %s', this.scenes);
    const validated = SceneSchema.parse(scene);
    this.scenes.push(validated);
    debug('Scenes array after push: %d', this.scenes.length);
    debug('Array object ID after: %s', this.scenes);
    debug(
      'Successfully registered scene: %s on instance %s, total scenes: %d',
      scene.name,
      this.instanceId,
      this.scenes.length,
    );
  }

  getAllScenes(): Scene[] {
    debug('Getting all scenes, count: %d', this.scenes.length);
    debug('Registry instance ID: %s', this.instanceId);
    debug('Array object ID: %s', this.scenes);
    debug('this === registry? %s', this === registry);
    if (this.scenes.length > 0) {
      debug(
        'Scenes: %o',
        this.scenes.map((f) => f.name),
      );
    }
    return [...this.scenes];
  }

  clearAll() {
    debug('Clearing all scenes on instance %s, current count: %d', this.instanceId, this.scenes.length);
    if (this.scenes.length > 0) {
      debug(
        'Clearing scenes on instance %s: %o',
        this.instanceId,
        this.scenes.map((f) => f.name),
      );
    }
    this.scenes = [];
    debug('Cleared! Instance %s now has %d scenes', this.instanceId, this.scenes.length);
  }
}

export const registry = new SceneRegistry();

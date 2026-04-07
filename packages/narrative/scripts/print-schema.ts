import { zodToJsonSchema } from 'zod-to-json-schema';
import {
  CommandMomentSchema,
  IntegrationSchema,
  MessageSchema,
  QueryMomentSchema,
  ReactMomentSchema,
  SceneSchema,
} from '../src';

const schemas = Object.fromEntries(
  Object.entries({
    scene: SceneSchema,
    message: MessageSchema,
    integration: IntegrationSchema,
    commandMoment: CommandMomentSchema,
    queryMoment: QueryMomentSchema,
    reactMoment: ReactMomentSchema,
  }).map(([k, v]) => [
    k,
    zodToJsonSchema(v, {
      $refStrategy: 'root',
      target: 'jsonSchema7',
      definitionPath: 'definitions',
      name: k[0].toUpperCase() + k.slice(1),
    }),
  ]),
);

console.log(JSON.stringify(schemas, null, 2));

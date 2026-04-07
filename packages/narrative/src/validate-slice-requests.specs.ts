import { describe, expect, it } from 'vitest';
import type { Model } from './schema';
import { validateMomentRequests } from './validate-slice-requests';

function emptyModel(overrides: Partial<Model> = {}): Model {
  return {
    variant: 'specs',
    scenes: [],
    messages: [],
    modules: [],
    ...overrides,
  };
}

describe('validateMomentRequests', () => {
  describe('burst 1: parse safety', () => {
    it('returns empty array for empty model', () => {
      expect(validateMomentRequests(emptyModel())).toEqual([]);
    });

    it('skips moments without request', () => {
      const model = emptyModel({
        scenes: [
          {
            name: 'TestFlow',
            moments: [
              {
                type: 'command',
                name: 'DoThing',
                client: { specs: [] },
                server: { description: 'desc', specs: [] },
              },
            ],
          },
        ],
      });
      expect(validateMomentRequests(model)).toEqual([]);
    });

    it('skips moments with empty string request', () => {
      const model = emptyModel({
        scenes: [
          {
            name: 'TestFlow',
            moments: [
              {
                type: 'command',
                name: 'DoThing',
                request: '',
                client: { specs: [] },
                server: { description: 'desc', specs: [] },
              },
            ],
          },
        ],
      });
      expect(validateMomentRequests(model)).toEqual([]);
    });

    it('returns request_parse_error for invalid syntax', () => {
      const model = emptyModel({
        scenes: [
          {
            name: 'TestFlow',
            moments: [
              {
                type: 'command',
                name: 'DoThing',
                request: 'not valid graphql {{{',
                client: { specs: [] },
                server: { description: 'desc', specs: [] },
              },
            ],
          },
        ],
      });
      expect(validateMomentRequests(model)).toEqual([
        {
          type: 'request_parse_error',
          message: expect.any(String),
          sceneName: 'TestFlow',
          momentName: 'DoThing',
        },
      ]);
    });

    it('returns request_parse_error for anonymous operation', () => {
      const model = emptyModel({
        scenes: [
          {
            name: 'TestFlow',
            moments: [
              {
                type: 'command',
                name: 'DoThing',
                request: 'mutation { doThing { success } }',
                client: { specs: [] },
                server: { description: 'desc', specs: [] },
              },
            ],
          },
        ],
      });
      expect(validateMomentRequests(model)).toEqual([
        {
          type: 'request_parse_error',
          message: 'Operation must have a name',
          sceneName: 'TestFlow',
          momentName: 'DoThing',
        },
      ]);
    });

    it('returns request_parse_error when no operation definition found', () => {
      const model = emptyModel({
        scenes: [
          {
            name: 'TestFlow',
            moments: [
              {
                type: 'command',
                name: 'DoThing',
                request: 'fragment F on User { id }',
                client: { specs: [] },
                server: { description: 'desc', specs: [] },
              },
            ],
          },
        ],
      });
      expect(validateMomentRequests(model)).toEqual([
        {
          type: 'request_parse_error',
          message: 'No operation found in request',
          sceneName: 'TestFlow',
          momentName: 'DoThing',
        },
      ]);
    });

    it('parses JSON AST format without error', () => {
      const sdl = 'mutation DoThing($input: DoThingInput!) { doThing(input: $input) { success } }';
      const { parse } = require('graphql');
      const ast = parse(sdl);
      const jsonAst = JSON.stringify(ast);

      const model = emptyModel({
        scenes: [
          {
            name: 'TestFlow',
            moments: [
              {
                type: 'command',
                name: 'DoThing',
                request: jsonAst,
                client: { specs: [] },
                server: { description: 'desc', specs: [] },
              },
            ],
            messages: [],
          },
        ],
        messages: [
          {
            type: 'command',
            name: 'DoThing',
            fields: [],
          },
        ],
      });
      const errors = validateMomentRequests(model);
      const parseErrors = errors.filter((e) => e.type === 'request_parse_error');
      expect(parseErrors).toEqual([]);
    });
  });

  describe('burst 2: mutation validation', () => {
    it('returns mutation_wrong_operation_type when command moment uses query', () => {
      const model = emptyModel({
        scenes: [
          {
            name: 'TestFlow',
            moments: [
              {
                type: 'command',
                name: 'DoThing',
                request: 'query DoThing { doThing { id } }',
                client: { specs: [] },
                server: { description: 'desc', specs: [] },
              },
            ],
          },
        ],
      });
      expect(validateMomentRequests(model)).toEqual([
        {
          type: 'mutation_wrong_operation_type',
          message: "Command moment 'DoThing' request should be a mutation, but found query",
          sceneName: 'TestFlow',
          momentName: 'DoThing',
        },
      ]);
    });

    it('returns mutation_missing_input_arg when no $input variable', () => {
      const model = emptyModel({
        scenes: [
          {
            name: 'TestFlow',
            moments: [
              {
                type: 'command',
                name: 'DoThing',
                request: 'mutation DoThing($name: String!) { doThing(name: $name) { success } }',
                client: { specs: [] },
                server: { description: 'desc', specs: [] },
              },
            ],
          },
        ],
      });
      expect(validateMomentRequests(model)).toEqual([
        {
          type: 'mutation_missing_input_arg',
          message: "Mutation 'DoThing' is missing required $input variable",
          sceneName: 'TestFlow',
          momentName: 'DoThing',
        },
      ]);
    });

    it('returns mutation_input_type_mismatch when input type does not match', () => {
      const model = emptyModel({
        scenes: [
          {
            name: 'TestFlow',
            moments: [
              {
                type: 'command',
                name: 'DoThing',
                request: 'mutation DoThing($input: WrongInput!) { doThing(input: $input) { success } }',
                client: { specs: [] },
                server: { description: 'desc', specs: [] },
              },
            ],
          },
        ],
      });
      expect(validateMomentRequests(model)).toEqual([
        {
          type: 'mutation_input_type_mismatch',
          message: "Mutation 'DoThing' input type should be 'DoThingInput', but found 'WrongInput'",
          sceneName: 'TestFlow',
          momentName: 'DoThing',
        },
      ]);
    });

    it('returns mutation_message_not_found when command not in messages', () => {
      const model = emptyModel({
        scenes: [
          {
            name: 'TestFlow',
            moments: [
              {
                type: 'command',
                name: 'DoThing',
                request: 'mutation DoThing($input: DoThingInput!) { doThing(input: $input) { success } }',
                client: { specs: [] },
                server: { description: 'desc', specs: [] },
              },
            ],
          },
        ],
        messages: [],
      });
      expect(validateMomentRequests(model)).toEqual([
        {
          type: 'mutation_message_not_found',
          message: "No command message 'DoThing' found in model.messages",
          sceneName: 'TestFlow',
          momentName: 'DoThing',
        },
      ]);
    });

    it('returns no errors for valid mutation', () => {
      const model = emptyModel({
        scenes: [
          {
            name: 'TestFlow',
            moments: [
              {
                type: 'command',
                name: 'DoThing',
                request: 'mutation DoThing($input: DoThingInput!) { doThing(input: $input) { success } }',
                client: { specs: [] },
                server: { description: 'desc', specs: [] },
              },
            ],
          },
        ],
        messages: [
          {
            type: 'command',
            name: 'DoThing',
            fields: [{ name: 'value', type: 'string', required: true }],
          },
        ],
      });
      expect(validateMomentRequests(model)).toEqual([]);
    });
  });

  describe('burst 3: query validation — operation type, state, top-level fields', () => {
    it('returns query_wrong_operation_type when query moment uses mutation', () => {
      const model = emptyModel({
        scenes: [
          {
            name: 'TestFlow',
            moments: [
              {
                type: 'query',
                name: 'GetThing',
                request: 'mutation GetThing($input: GetThingInput!) { getThing(input: $input) { success } }',
                client: { specs: [] },
                server: { description: 'desc', specs: [] },
              },
            ],
          },
        ],
      });
      expect(validateMomentRequests(model)).toEqual([
        {
          type: 'query_wrong_operation_type',
          message: "Query moment 'GetThing' request should be a query, but found mutation",
          sceneName: 'TestFlow',
          momentName: 'GetThing',
        },
      ]);
    });

    it('returns query_state_not_found when target state not in messages', () => {
      const model = emptyModel({
        scenes: [
          {
            name: 'TestFlow',
            moments: [
              {
                type: 'query',
                name: 'GetThing',
                request: 'query GetThing { getThing { id name } }',
                client: { specs: [] },
                server: {
                  description: 'desc',
                  data: {
                    items: [
                      { target: { type: 'State', name: 'ThingState' }, origin: { type: 'projection', name: 'thing' } },
                    ],
                  },
                  specs: [],
                },
              },
            ],
          },
        ],
        messages: [],
      });
      expect(validateMomentRequests(model)).toEqual([
        {
          type: 'query_state_not_found',
          message: "State 'ThingState' referenced by query 'GetThing' not found in model.messages",
          sceneName: 'TestFlow',
          momentName: 'GetThing',
        },
      ]);
    });

    it('returns query_field_not_found when selecting field not on state', () => {
      const model = emptyModel({
        scenes: [
          {
            name: 'TestFlow',
            moments: [
              {
                type: 'query',
                name: 'GetThing',
                request: 'query GetThing { getThing { id name missing } }',
                client: { specs: [] },
                server: {
                  description: 'desc',
                  data: {
                    items: [
                      { target: { type: 'State', name: 'ThingState' }, origin: { type: 'projection', name: 'thing' } },
                    ],
                  },
                  specs: [],
                },
              },
            ],
          },
        ],
        messages: [
          {
            type: 'state',
            name: 'ThingState',
            fields: [
              { name: 'id', type: 'string', required: true },
              { name: 'name', type: 'string', required: true },
            ],
          },
        ],
      });
      expect(validateMomentRequests(model)).toEqual([
        {
          type: 'query_field_not_found',
          message: "Field 'missing' in query 'GetThing' not found on state 'ThingState'",
          sceneName: 'TestFlow',
          momentName: 'GetThing',
        },
      ]);
    });

    it('skips query moment without data gracefully', () => {
      const model = emptyModel({
        scenes: [
          {
            name: 'TestFlow',
            moments: [
              {
                type: 'query',
                name: 'GetThing',
                request: 'query GetThing { getThing { id } }',
                client: { specs: [] },
                server: { description: 'desc', specs: [] },
              },
            ],
          },
        ],
      });
      expect(validateMomentRequests(model)).toEqual([]);
    });

    it('skips __typename in selection', () => {
      const model = emptyModel({
        scenes: [
          {
            name: 'TestFlow',
            moments: [
              {
                type: 'query',
                name: 'GetThing',
                request: 'query GetThing { getThing { __typename id } }',
                client: { specs: [] },
                server: {
                  description: 'desc',
                  data: {
                    items: [
                      { target: { type: 'State', name: 'ThingState' }, origin: { type: 'projection', name: 'thing' } },
                    ],
                  },
                  specs: [],
                },
              },
            ],
          },
        ],
        messages: [
          {
            type: 'state',
            name: 'ThingState',
            fields: [{ name: 'id', type: 'string', required: true }],
          },
        ],
      });
      expect(validateMomentRequests(model)).toEqual([]);
    });

    it('returns no errors for valid query', () => {
      const model = emptyModel({
        scenes: [
          {
            name: 'TestFlow',
            moments: [
              {
                type: 'query',
                name: 'GetThing',
                request: 'query GetThing { getThing { id name } }',
                client: { specs: [] },
                server: {
                  description: 'desc',
                  data: {
                    items: [
                      { target: { type: 'State', name: 'ThingState' }, origin: { type: 'projection', name: 'thing' } },
                    ],
                  },
                  specs: [],
                },
              },
            ],
          },
        ],
        messages: [
          {
            type: 'state',
            name: 'ThingState',
            fields: [
              { name: 'id', type: 'string', required: true },
              { name: 'name', type: 'string', required: true },
            ],
          },
        ],
      });
      expect(validateMomentRequests(model)).toEqual([]);
    });
  });

  describe('burst 4: query nested field validation', () => {
    it('returns query_nested_field_not_found for nested field not in inline object', () => {
      const model = emptyModel({
        scenes: [
          {
            name: 'TestFlow',
            moments: [
              {
                type: 'query',
                name: 'GetThing',
                request: 'query GetThing { getThing { id address { street missing } } }',
                client: { specs: [] },
                server: {
                  description: 'desc',
                  data: {
                    items: [
                      { target: { type: 'State', name: 'ThingState' }, origin: { type: 'projection', name: 'thing' } },
                    ],
                  },
                  specs: [],
                },
              },
            ],
          },
        ],
        messages: [
          {
            type: 'state',
            name: 'ThingState',
            fields: [
              { name: 'id', type: 'string', required: true },
              { name: 'address', type: '{ street: string; city: string }', required: true },
            ],
          },
        ],
      });
      expect(validateMomentRequests(model)).toEqual([
        {
          type: 'query_nested_field_not_found',
          message: "Nested field 'missing' in query 'GetThing' not found on type of 'address'",
          sceneName: 'TestFlow',
          momentName: 'GetThing',
        },
      ]);
    });

    it('resolves nested field on referenced message type', () => {
      const model = emptyModel({
        scenes: [
          {
            name: 'TestFlow',
            moments: [
              {
                type: 'query',
                name: 'GetThing',
                request: 'query GetThing { getThing { id detail { value } } }',
                client: { specs: [] },
                server: {
                  description: 'desc',
                  data: {
                    items: [
                      { target: { type: 'State', name: 'ThingState' }, origin: { type: 'projection', name: 'thing' } },
                    ],
                  },
                  specs: [],
                },
              },
            ],
          },
        ],
        messages: [
          {
            type: 'state',
            name: 'ThingState',
            fields: [
              { name: 'id', type: 'string', required: true },
              { name: 'detail', type: 'DetailInfo', required: true },
            ],
          },
          {
            type: 'state',
            name: 'DetailInfo',
            fields: [{ name: 'value', type: 'string', required: true }],
          },
        ],
      });
      expect(validateMomentRequests(model)).toEqual([]);
    });

    it('skips nested field on unresolvable type without error', () => {
      const model = emptyModel({
        scenes: [
          {
            name: 'TestFlow',
            moments: [
              {
                type: 'query',
                name: 'GetThing',
                request: 'query GetThing { getThing { id metadata { anything } } }',
                client: { specs: [] },
                server: {
                  description: 'desc',
                  data: {
                    items: [
                      { target: { type: 'State', name: 'ThingState' }, origin: { type: 'projection', name: 'thing' } },
                    ],
                  },
                  specs: [],
                },
              },
            ],
          },
        ],
        messages: [
          {
            type: 'state',
            name: 'ThingState',
            fields: [
              { name: 'id', type: 'string', required: true },
              { name: 'metadata', type: 'JSON', required: true },
            ],
          },
        ],
      });
      expect(validateMomentRequests(model)).toEqual([]);
    });

    it('resolves nested fields on bracket array syntax type', () => {
      const model = emptyModel({
        scenes: [
          {
            name: 'TestFlow',
            moments: [
              {
                type: 'query',
                name: 'GetThing',
                request: 'query GetThing { getThing { id items { name } } }',
                client: { specs: [] },
                server: {
                  description: 'desc',
                  data: {
                    items: [
                      { target: { type: 'State', name: 'ThingState' }, origin: { type: 'projection', name: 'thing' } },
                    ],
                  },
                  specs: [],
                },
              },
            ],
          },
        ],
        messages: [
          {
            type: 'state',
            name: 'ThingState',
            fields: [
              { name: 'id', type: 'string', required: true },
              { name: 'items', type: '{ name: string; value: number }[]', required: true },
            ],
          },
        ],
      });
      expect(validateMomentRequests(model)).toEqual([]);
    });

    it('returns no errors for valid query with nested selections', () => {
      const model = emptyModel({
        scenes: [
          {
            name: 'TestFlow',
            moments: [
              {
                type: 'query',
                name: 'GetThing',
                request: 'query GetThing { getThing { id address { street city } } }',
                client: { specs: [] },
                server: {
                  description: 'desc',
                  data: {
                    items: [
                      { target: { type: 'State', name: 'ThingState' }, origin: { type: 'projection', name: 'thing' } },
                    ],
                  },
                  specs: [],
                },
              },
            ],
          },
        ],
        messages: [
          {
            type: 'state',
            name: 'ThingState',
            fields: [
              { name: 'id', type: 'string', required: true },
              { name: 'address', type: '{ street: string; city: string }', required: true },
            ],
          },
        ],
      });
      expect(validateMomentRequests(model)).toEqual([]);
    });
  });

  describe('burst 5: integration', () => {
    it('returns no false positives on a questionnaires-style model', () => {
      const model = emptyModel({
        scenes: [
          {
            name: 'Questionnaire Management',
            moments: [
              {
                type: 'command',
                name: 'SubmitAnswer',
                request:
                  'mutation SubmitAnswer($input: SubmitAnswerInput!) { submitAnswer(input: $input) { success } }',
                client: { specs: [] },
                server: { description: 'Submit an answer', specs: [] },
              },
              {
                type: 'query',
                name: 'GetQuestionnaire',
                request: 'query GetQuestionnaire { getQuestionnaire { id title questions { text options } } }',
                client: { specs: [] },
                server: {
                  description: 'Get questionnaire',
                  data: {
                    items: [
                      {
                        target: { type: 'State', name: 'QuestionnaireState' },
                        origin: { type: 'projection', name: 'questionnaire' },
                      },
                    ],
                  },
                  specs: [],
                },
              },
              {
                type: 'command',
                name: 'CreateQuestionnaire',
                request:
                  'mutation CreateQuestionnaire($input: CreateQuestionnaireInput!) { createQuestionnaire(input: $input) { success } }',
                client: { specs: [] },
                server: { description: 'Create questionnaire', specs: [] },
              },
            ],
          },
        ],
        messages: [
          {
            type: 'command',
            name: 'SubmitAnswer',
            fields: [
              { name: 'questionId', type: 'string', required: true },
              { name: 'answer', type: 'string', required: true },
            ],
          },
          {
            type: 'command',
            name: 'CreateQuestionnaire',
            fields: [
              { name: 'title', type: 'string', required: true },
              { name: 'questions', type: 'Array<{ text: string; options: string[] }>', required: true },
            ],
          },
          {
            type: 'state',
            name: 'QuestionnaireState',
            fields: [
              { name: 'id', type: 'string', required: true },
              { name: 'title', type: 'string', required: true },
              { name: 'questions', type: 'Array<{ text: string; options: string[] }>', required: true },
            ],
          },
          {
            type: 'event',
            name: 'AnswerSubmitted',
            fields: [
              { name: 'questionId', type: 'string', required: true },
              { name: 'answer', type: 'string', required: true },
            ],
          },
        ],
      });
      expect(validateMomentRequests(model)).toEqual([]);
    });

    it('catches multiple errors across scenes', () => {
      const model = emptyModel({
        scenes: [
          {
            name: 'Flow1',
            moments: [
              {
                type: 'command',
                name: 'BadCmd',
                request: 'query BadCmd { bad { id } }',
                client: { specs: [] },
                server: { description: 'desc', specs: [] },
              },
            ],
          },
          {
            name: 'Flow2',
            moments: [
              {
                type: 'query',
                name: 'BadQuery',
                request: 'mutation BadQuery($input: BadQueryInput!) { bad(input: $input) { id } }',
                client: { specs: [] },
                server: { description: 'desc', specs: [] },
              },
            ],
          },
        ],
      });
      expect(validateMomentRequests(model)).toEqual([
        {
          type: 'mutation_wrong_operation_type',
          message: "Command moment 'BadCmd' request should be a mutation, but found query",
          sceneName: 'Flow1',
          momentName: 'BadCmd',
        },
        {
          type: 'query_wrong_operation_type',
          message: "Query moment 'BadQuery' request should be a query, but found mutation",
          sceneName: 'Flow2',
          momentName: 'BadQuery',
        },
      ]);
    });
  });
});

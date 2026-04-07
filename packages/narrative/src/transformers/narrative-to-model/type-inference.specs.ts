import { describe, expect, it } from 'vitest';
import type { Message, Scene } from '../../index';
import { scenesToModel } from './index';
import { buildTypeInfoFromMessages, messageToTypeInfo } from './type-inference';

describe('Type inference in narrative-to-model transformer', () => {
  it('should correctly extract command types from when clauses', () => {
    const flows: Scene[] = [
      {
        name: 'Test Flow',
        id: 'FLOW-001',
        moments: [
          {
            id: 'SLICE-001',
            type: 'command',
            name: 'Submit Answer Command',
            client: { specs: [] },
            server: {
              description: 'Submit answer server',
              specs: [
                {
                  type: 'gherkin',
                  feature: 'Submit Answer Specs',
                  rules: [
                    {
                      id: 'RULE-001',
                      name: 'Should accept answer submission',
                      examples: [
                        {
                          name: 'Valid answer submission',
                          steps: [
                            {
                              keyword: 'When',
                              text: 'AnswerQuestion',
                              docString: {
                                questionnaireId: 'q-001',
                                participantId: 'participant-abc',
                                questionId: 'q1',
                                answer: 'Yes',
                              },
                            },
                            {
                              keyword: 'Then',
                              text: 'QuestionAnswered',
                              docString: {
                                questionnaireId: 'q-001',
                                participantId: 'participant-abc',
                                questionId: 'q1',
                                answer: 'Yes',
                                savedAt: new Date(),
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
          {
            id: 'SLICE-002',
            type: 'command',
            name: 'Submit Questionnaire Command',
            client: { specs: [] },
            server: {
              description: 'Submit questionnaire server',
              specs: [
                {
                  type: 'gherkin',
                  feature: 'Submit Questionnaire Specs',
                  rules: [
                    {
                      id: 'RULE-002',
                      name: 'Should submit questionnaire',
                      examples: [
                        {
                          name: 'Valid questionnaire submission',
                          steps: [
                            {
                              keyword: 'When',
                              text: 'SubmitQuestionnaire',
                              docString: {
                                questionnaireId: 'q-001',
                                participantId: 'participant-abc',
                              },
                            },
                            {
                              keyword: 'Then',
                              text: 'QuestionnaireSubmitted',
                              docString: {
                                questionnaireId: 'q-001',
                                participantId: 'participant-abc',
                                submittedAt: new Date(),
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    ];

    const model = scenesToModel(flows);

    // Should have the correct command messages extracted
    expect(model.messages.some((msg) => msg.name === 'AnswerQuestion')).toBe(true);
    expect(model.messages.some((msg) => msg.name === 'SubmitQuestionnaire')).toBe(true);
    expect(model.messages.some((msg) => msg.name === 'QuestionAnswered')).toBe(true);
    expect(model.messages.some((msg) => msg.name === 'QuestionnaireSubmitted')).toBe(true);

    // Should NOT have InferredType fallback
    expect(model.messages.some((msg) => msg.name === 'InferredType')).toBe(false);

    // Verify the command messages have the correct structure
    const answerQuestionMsg = model.messages.find((msg) => msg.name === 'AnswerQuestion');
    expect(answerQuestionMsg?.type).toBe('command');
    expect(answerQuestionMsg?.fields).toBeDefined();

    const submitQuestionnaireMsg = model.messages.find((msg) => msg.name === 'SubmitQuestionnaire');
    expect(submitQuestionnaireMsg?.type).toBe('command');
    expect(submitQuestionnaireMsg?.fields).toBeDefined();
  });

  it('should handle single object when/then clauses correctly', () => {
    const flows: Scene[] = [
      {
        name: 'Single Object Flow',
        id: 'FLOW-001',
        moments: [
          {
            id: 'SLICE-001',
            type: 'command',
            name: 'Single Object Command',
            client: { specs: [] },
            server: {
              description: 'Single object server',
              specs: [
                {
                  type: 'gherkin',
                  feature: 'Single Object Specs',
                  rules: [
                    {
                      id: 'RULE-001',
                      name: 'Should handle single object',
                      examples: [
                        {
                          name: 'Single object example',
                          steps: [
                            {
                              keyword: 'When',
                              text: 'TestCommand',
                              docString: { test: 'value' },
                            },
                            {
                              keyword: 'Then',
                              text: 'TestEvent',
                              docString: { result: 'success' },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    ];

    const model = scenesToModel(flows);

    // Should extract the command and event types from single objects
    expect(model.messages.some((msg) => msg.name === 'TestCommand')).toBe(true);
    expect(model.messages.some((msg) => msg.name === 'TestEvent')).toBe(true);
    expect(model.messages.some((msg) => msg.name === 'InferredType')).toBe(false);
  });
});

describe('Messages-derived fallback in type resolution', () => {
  it('resolves InferredType in second example When step via messages populated by first example', () => {
    const flows: Scene[] = [
      {
        name: 'Booking Flow',
        id: 'FLOW-001',
        moments: [
          {
            id: 'SLICE-001',
            type: 'command',
            name: 'Request Booking',
            client: { specs: [] },
            server: {
              description: 'Request booking server',
              specs: [
                {
                  type: 'gherkin',
                  feature: 'Request Booking Specs',
                  rules: [
                    {
                      id: 'RULE-001',
                      name: 'Happy path',
                      examples: [
                        {
                          name: 'Room available',
                          steps: [
                            {
                              keyword: 'When',
                              text: 'RequestBooking',
                              docString: { guestId: 'g-1', roomType: 'suite' },
                            },
                            {
                              keyword: 'Then',
                              text: 'BookingRequested',
                              docString: { guestId: 'g-1', roomType: 'suite' },
                            },
                          ],
                        },
                        {
                          name: 'Capacity exceeded',
                          steps: [
                            {
                              keyword: 'When',
                              text: 'InferredType',
                              docString: { guestId: 'g-2', roomType: 'double' },
                            },
                            {
                              keyword: 'Then',
                              text: 'BookingDenied',
                              docString: { guestId: 'g-2', reason: 'no availability' },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    ];

    const model = scenesToModel(flows);

    expect(model.messages.some((msg) => msg.name === 'InferredType')).toBe(false);
    expect(model.messages.some((msg) => msg.name === 'RequestBooking')).toBe(true);
    expect(model.messages.some((msg) => msg.name === 'BookingRequested')).toBe(true);
    expect(model.messages.some((msg) => msg.name === 'BookingDenied')).toBe(true);
  });
});

describe('messageToTypeInfo', () => {
  it('converts a Message to TypeInfo with correct field mapping', () => {
    const msg: Message = {
      name: 'RequestBooking',
      type: 'command',
      fields: [
        { name: 'guestId', type: 'string', required: true },
        { name: 'roomType', type: 'string', required: false },
      ],
    };

    const result = messageToTypeInfo(msg);

    expect(result).toEqual({
      stringLiteral: 'RequestBooking',
      classification: 'command',
      dataFields: [
        { name: 'guestId', type: 'string', required: true },
        { name: 'roomType', type: 'string', required: false },
      ],
    });
  });
});

describe('buildTypeInfoFromMessages', () => {
  it('returns undefined for an empty messages map', () => {
    const messages = new Map<string, Message>();

    expect(buildTypeInfoFromMessages(messages)).toEqual(undefined);
  });

  it('builds a TypeInfo map from a populated messages map', () => {
    const messages = new Map<string, Message>([
      [
        'RequestBooking',
        {
          name: 'RequestBooking',
          type: 'command',
          fields: [{ name: 'guestId', type: 'string', required: true }],
        },
      ],
      [
        'BookingRequested',
        {
          name: 'BookingRequested',
          type: 'event',
          fields: [
            { name: 'guestId', type: 'string', required: true },
            { name: 'bookedAt', type: 'Date', required: true },
          ],
        },
      ],
    ]);

    const result = buildTypeInfoFromMessages(messages);

    expect(result).toEqual(
      new Map([
        [
          'RequestBooking',
          {
            stringLiteral: 'RequestBooking',
            classification: 'command',
            dataFields: [{ name: 'guestId', type: 'string', required: true }],
          },
        ],
        [
          'BookingRequested',
          {
            stringLiteral: 'BookingRequested',
            classification: 'event',
            dataFields: [
              { name: 'guestId', type: 'string', required: true },
              { name: 'bookedAt', type: 'Date', required: true },
            ],
          },
        ],
      ]),
    );
  });
});

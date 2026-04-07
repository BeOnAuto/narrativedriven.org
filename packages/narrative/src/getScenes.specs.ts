import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { InMemoryFileStore } from '@auto-engineer/file-store';
import { NodeFileStore } from '@auto-engineer/file-store/node';
import { beforeEach, describe, expect, it } from 'vitest';
import { clearGetScenesCache, getScenes } from './getScenes';
import { type Example, type Model, modelToNarrative, type QueryMoment, type Scene } from './index';
import { modelSchema } from './schema';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pattern = /\.(narrative)\.(ts)$/;

describe('getScenes', (_mode) => {
  let vfs: NodeFileStore;
  let root: string;

  beforeEach(() => {
    vfs = new NodeFileStore();
    root = path.resolve(__dirname);
  });
  it('loads multiple scenes and generates correct models', async () => {
    const flows = await getScenes({ vfs, root: path.resolve(__dirname), pattern, fastFsScan: true });
    const schemas = flows.toModel();

    const parseResult = modelSchema.safeParse(schemas);
    if (!parseResult.success) {
      console.error(`Schema validation errors:`, parseResult.error.format());
    }
    expect(parseResult.success).toBe(true);

    expect(schemas).toHaveProperty('variant', 'specs');
    expect(schemas).toHaveProperty('scenes');
    expect(schemas).toHaveProperty('messages');
    expect(schemas).toHaveProperty('integrations');

    const flowsArray = schemas.scenes;
    expect(Array.isArray(flowsArray)).toBe(true);
    expect(flowsArray.length).toBeGreaterThanOrEqual(2);

    const names = flowsArray.map((f: { name: string }) => f.name);
    expect(names).toContain('items');
    expect(names).toContain('Place order');

    const items = flowsArray.find((f: { name: string }) => f.name === 'items');
    const placeOrder = flowsArray.find((f: { name: string }) => f.name === 'Place order');
    expect(items).toBeDefined();
    expect(placeOrder).toBeDefined();

    if (items) {
      expect(items.moments).toHaveLength(2);
      const createItemMoment = items.moments[0];
      expect(createItemMoment.type).toBe('command');
      expect(createItemMoment.name).toBe('Create item');
      expect(createItemMoment.stream).toBe('item-${id}');
      if (createItemMoment.type === 'command') {
        expect(createItemMoment.client.specs).toBeDefined();
        expect(Array.isArray(createItemMoment.client.specs)).toBe(true);
        expect(createItemMoment.client.specs).toHaveLength(1);
        expect(createItemMoment.client.specs[0].type).toBe('describe');
        expect(createItemMoment.client.specs[0].title).toBe('A form that allows users to add items');
        if (createItemMoment.client.specs[0].type === 'describe') {
          expect(createItemMoment.client.specs[0].children).toHaveLength(1);
        }
        expect(createItemMoment.server.specs).toBeDefined();
        expect(Array.isArray(createItemMoment.server.specs)).toBe(true);
        expect(createItemMoment.server.specs).toHaveLength(1);
        const spec = createItemMoment.server.specs[0];
        expect(spec.feature).toBeDefined();
        expect(spec.rules).toHaveLength(1);
        const rule = spec.rules[0];
        expect(rule.name).toBeDefined();
        expect(rule.examples).toHaveLength(1);
        const example = rule.examples[0];
        expect(example.steps).toBeDefined();
        expect(example.steps.length).toBeGreaterThanOrEqual(2);
        const whenStep = example.steps.find((s) => s.keyword === 'When');
        const thenStep = example.steps.find((s) => s.keyword === 'Then');
        expect(whenStep).toBeDefined();
        expect(thenStep).toBeDefined();
        if (whenStep && 'text' in whenStep) {
          expect(whenStep.text).toBe('CreateItem');
          expect(whenStep.docString).toMatchObject({
            itemId: 'item_123',
            description: 'A new item',
          });
        }
        if (thenStep && 'text' in thenStep) {
          expect(thenStep.text).toBe('ItemCreated');
          expect(thenStep.docString).toMatchObject({
            id: 'item_123',
            description: 'A new item',
            addedAt: new Date('2024-01-15T10:00:00.000Z'),
          });
        }
      }

      const viewItemMoment = items.moments[1] as QueryMoment;
      expect(viewItemMoment.type).toBe('query');
      expect(viewItemMoment.name).toBe('view items');
      expect(viewItemMoment.client.specs).toBeDefined();
      expect(Array.isArray(viewItemMoment.client.specs)).toBe(true);
      expect(viewItemMoment.client.specs).toHaveLength(1);
      expect(viewItemMoment.client.specs[0].type).toBe('describe');
      expect(viewItemMoment.client.specs[0].title).toBe('view Items Screen');
      if (viewItemMoment.client.specs[0].type === 'describe') {
        expect(viewItemMoment.client.specs[0].children).toHaveLength(3);
      }
      expect(viewItemMoment.request).toBeDefined();
      expect(viewItemMoment.request).toMatch(
        /query items\(\$itemId: String!\) {\s+items\(itemId: \$itemId\) {\s+id\s+description\s+}/,
      );

      const data = viewItemMoment?.server?.data;
      if (!data || !Array.isArray(data.items)) throw new Error('No data found in view items slice');

      expect(data.items).toHaveLength(1);
      expect(data.items[0].target).toMatchObject({ type: 'State', name: 'items' });
      expect(data.items[0].origin).toMatchObject({ name: 'ItemsProjection', type: 'projection' });

      const specs = viewItemMoment?.server?.specs;
      if (specs == null || specs.length === 0 || specs[0].feature === '')
        throw new Error('No specs found in view items slice');
      expect(specs).toBeDefined();
    }

    if (placeOrder) {
      expect(placeOrder.moments).toHaveLength(1);
      const submitOrderMoment = placeOrder.moments[0];
      expect(submitOrderMoment.type).toBe('command');
      expect(submitOrderMoment.name).toBe('Submit order');
      expect(submitOrderMoment.stream).toBe('order-${orderId}');

      if (submitOrderMoment.type === 'command') {
        expect(submitOrderMoment.client.specs).toBeDefined();
        expect(Array.isArray(submitOrderMoment.client.specs)).toBe(true);
        expect(submitOrderMoment.client.specs).toHaveLength(1);
        expect(submitOrderMoment.client.specs[0].type).toBe('describe');
        expect(submitOrderMoment.client.specs[0].title).toBe('Order submission form');
        if (submitOrderMoment.client.specs[0].type === 'describe') {
          expect(submitOrderMoment.client.specs[0].children).toHaveLength(2);
        }
        expect(submitOrderMoment.server.specs).toBeDefined();
        expect(Array.isArray(submitOrderMoment.server.specs)).toBe(true);
        expect(submitOrderMoment.server.specs).toHaveLength(1);
        const spec = submitOrderMoment.server.specs[0];
        expect(spec.rules).toHaveLength(1);
        const rule = spec.rules[0];
        expect(rule.examples).toHaveLength(1);
        const example = rule.examples[0];
        expect(example.steps).toBeDefined();
        expect(example.steps.length).toBeGreaterThanOrEqual(2);
        const whenStep = example.steps.find((s) => s.keyword === 'When');
        const thenStep = example.steps.find((s) => s.keyword === 'Then');
        expect(whenStep).toBeDefined();
        expect(thenStep).toBeDefined();
        if (whenStep && 'text' in whenStep) {
          expect(whenStep.text).toBe('PlaceOrder');
          expect(whenStep.docString).toMatchObject({ productId: 'product_789', quantity: 3 });
        }
        if (thenStep && 'text' in thenStep) {
          expect(thenStep.text).toBe('OrderPlaced');
          expect(thenStep.docString).toMatchObject({
            orderId: 'order_001',
            productId: 'product_789',
            quantity: 3,
            placedAt: new Date('2024-01-20T10:00:00.000Z'),
          });
        }
      }
    }

    const messages = schemas.messages;
    expect(messages.length).toBeGreaterThan(0);

    const commandMessages = messages.filter((m) => m.type === 'command');
    const eventMessages = messages.filter((m) => m.type === 'event');

    expect(commandMessages.some((m) => m.name === 'CreateItem')).toBe(true);
    expect(commandMessages.some((m) => m.name === 'PlaceOrder')).toBe(true);
    expect(eventMessages.some((m) => m.name === 'ItemCreated')).toBe(true);
    expect(eventMessages.some((m) => m.name === 'OrderPlaced')).toBe(true);

    const createItemCommand = commandMessages.find((m) => m.name === 'CreateItem');
    if (createItemCommand) {
      expect(createItemCommand.fields).toContainEqual(
        expect.objectContaining({ name: 'itemId', type: 'string', required: true }),
      );
      expect(createItemCommand.fields).toContainEqual(
        expect.objectContaining({ name: 'description', type: 'string', required: true }),
      );
    }

    const itemCreatedEvent = eventMessages.find((m) => m.name === 'ItemCreated');
    if (itemCreatedEvent) {
      expect(itemCreatedEvent.fields).toContainEqual(
        expect.objectContaining({ name: 'id', type: 'string', required: true }),
      );
      expect(itemCreatedEvent.fields).toContainEqual(
        expect.objectContaining({ name: 'description', type: 'string', required: true }),
      );
      expect(itemCreatedEvent.fields).toContainEqual(
        expect.objectContaining({ name: 'addedAt', type: 'Date', required: true }),
      );
    }
  });

  it('validates the complete schema with Zod', async () => {
    const flows = await getScenes({ vfs: vfs, root, pattern: /\.(narrative)\.(ts)$/, fastFsScan: true });
    const schemas = flows.toModel();
    const parsed = modelSchema.parse(schemas);
    expect(parsed.variant).toBe('specs');
    expect(Array.isArray(parsed.scenes)).toBe(true);
    expect(Array.isArray(parsed.messages)).toBe(true);
    expect(Array.isArray(parsed.integrations)).toBe(true);
  });

  it('should handle scenes with integrations', async () => {
    const flows = await getScenes({ vfs: vfs, root: root, pattern: /\.(narrative)\.(ts)$/, fastFsScan: true });
    const specsSchema = flows.toModel();

    const flowsWithIntegrations = specsSchema.scenes.filter((f) =>
      f.moments.some((s) => {
        if (s.type === 'command' || s.type === 'query') {
          return (
            s.server.data?.items?.some(
              (d) =>
                ('destination' in d && d.destination?.type === 'integration') ||
                ('origin' in d && d.origin?.type === 'integration'),
            ) ?? false
          );
        }
        return false;
      }),
    );

    if (flowsWithIntegrations.length > 0) {
      expect(specsSchema?.integrations?.length ?? 0).toBeGreaterThan(0);
    }
  });

  it('should handle react slices correctly', async () => {
    const flows = await getScenes({ vfs: vfs, root: root, pattern: /\.(narrative)\.(ts)$/, fastFsScan: true });
    const specsSchema = flows.toModel();

    const reactMoments = specsSchema.scenes.flatMap((f) => f.moments.filter((s) => s.type === 'react'));
    reactMoments.forEach((slice) => {
      if (slice.type === 'react') {
        expect(slice.server).toBeDefined();
        expect(slice.server.specs).toBeDefined();
        expect(Array.isArray(slice.server.specs)).toBe(true);
        expect(slice.server.specs.length).toBeGreaterThanOrEqual(1);
        const spec = slice.server.specs[0];
        expect(spec.rules).toBeDefined();
        expect(Array.isArray(spec.rules)).toBe(true);
        spec.rules.forEach((rule) => {
          rule.examples.forEach((example) => {
            expect(example.steps).toBeDefined();
            expect(Array.isArray(example.steps)).toBe(true);
          });
        });
      }
    });
  });

  it('should parse and validate a complete flow with all slice types', async () => {
    const flows = await getScenes({ vfs: vfs, root: root, pattern: /\.(narrative)\.(ts)$/, fastFsScan: true });
    const schemas = flows.toModel();

    const validationResult = modelSchema.safeParse(schemas);
    if (!validationResult.success) {
      console.error(`Validation errors:`, JSON.stringify(validationResult.error.format(), null, 2));
    }
    expect(validationResult.success).toBe(true);

    const validatedData = validationResult.data!;
    expect(
      validatedData.scenes.every((flow) =>
        flow.moments.every((slice) => {
          if (slice.type === 'command' || slice.type === 'query') {
            return slice.client !== undefined && slice.server !== undefined;
          } else if (slice.type === 'react') {
            return slice.server !== undefined;
          } else if (slice.type === 'experience') {
            return slice.client !== undefined;
          }
          return false;
        }),
      ),
    ).toBe(true);
  });

  it('should have ids for scenes and slices that have ids', async () => {
    const flows = await getScenes({ vfs: vfs, root: root, pattern: /\.(narrative)\.(ts)$/, fastFsScan: true });

    const schemas = flows.toModel();

    const testFlowWithIds = schemas.scenes.find((f) => f.name === 'Test Flow with IDs');
    if (!testFlowWithIds) return;
    const commandMoment = testFlowWithIds.moments.find((s) => s.name === 'Create test item');
    expect(commandMoment?.id).toBe('SLICE-001');
    expect(commandMoment?.type).toBe('command');
    const queryMoment = testFlowWithIds.moments.find((s) => s.name === 'Get test items');
    expect(queryMoment?.id).toBe('SLICE-002');
    expect(queryMoment?.type).toBe('query');
    const reactMoment = testFlowWithIds.moments.find((s) => s.name === 'React to test event');
    expect(reactMoment?.id).toBe('SLICE-003');
    expect(reactMoment?.type).toBe('react');
  });

  it('should have ids for command slice rules', async () => {
    const flows = await getScenes({ vfs: vfs, root: root, pattern: /\.(narrative)\.(ts)$/, fastFsScan: true });
    const schemas = flows.toModel();

    const testFlowWithIds = schemas.scenes.find((f) => f.name === 'Test Flow with IDs');
    if (!testFlowWithIds) return;

    const commandMoment = testFlowWithIds.moments.find((s) => s.name === 'Create test item');
    if (commandMoment?.type !== 'command') return;

    expect(commandMoment.server.specs[0].rules).toHaveLength(2);

    const rule1 = commandMoment.server.specs[0].rules.find(
      (r) => r.name === 'Valid test items should be created successfully',
    );
    expect(rule1?.id).toBe('RULE-001');

    const rule2 = commandMoment.server.specs[0].rules.find((r) => r.name === 'Invalid test items should be rejected');
    expect(rule2?.id).toBe('RULE-002');
  });

  it('should have ids for query slice rules', async () => {
    const flows = await getScenes({ vfs: vfs, root: root, pattern: /\.(narrative)\.(ts)$/, fastFsScan: true });
    const schemas = flows.toModel();

    const testFlowWithIds = schemas.scenes.find((f) => f.name === 'Test Flow with IDs');
    if (!testFlowWithIds) return;

    const queryMoment = testFlowWithIds.moments.find((s) => s.name === 'Get test items');
    if (queryMoment?.type !== 'query') return;

    expect(queryMoment.server.specs[0].rules).toHaveLength(1);

    const rule3 = queryMoment.server.specs[0].rules.find(
      (r) => r.name === 'Items should be retrievable after creation',
    );
    expect(rule3?.id).toBe('RULE-003');
  });

  it('should have ids for react slice rules', async () => {
    const flows = await getScenes({ vfs: vfs, root: root, pattern: /\.(narrative)\.(ts)$/, fastFsScan: true });
    const schemas = flows.toModel();

    const testFlowWithIds = schemas.scenes.find((f) => f.name === 'Test Flow with IDs');
    if (!testFlowWithIds) return;

    const reactMoment = testFlowWithIds.moments.find((s) => s.name === 'React to test event');
    if (reactMoment?.type !== 'react') return;

    expect(reactMoment.server.specs[0].rules).toHaveLength(1);

    const rule4 = reactMoment.server.specs[0].rules.find((r) => r.name === 'System should react to test item creation');
    expect(rule4?.id).toBe('RULE-004');
  });

  it('should handle when examples correctly', async () => {
    const flows = await getScenes({
      vfs,
      root,
      pattern: /(?:^|\/)questionnaires\.narrative\.(?:ts|tsx|js|jsx|mjs|cjs)$/,
    });
    const model = flows.toModel();

    const questionnaireFlow = model.scenes.find((f) => f.name === 'Questionnaires');
    expect(questionnaireFlow).toBeDefined();

    if (questionnaireFlow) {
      const submitMoment = questionnaireFlow.moments.find((s) => s.name === 'submits the questionnaire');
      expect(submitMoment?.type).toBe('command');

      if (submitMoment?.type === 'command') {
        const example = submitMoment.server?.specs?.[0]?.rules[0]?.examples[0];
        const whenStep = example?.steps?.find((s) => s.keyword === 'When');
        if (whenStep && 'text' in whenStep) {
          expect(whenStep.text).toBe('SubmitQuestionnaire');
        }
      }
    }
  });

  it('should correctly assign commandRef correctly', async () => {
    const flows = await getScenes({
      vfs,
      root,
      pattern: /(?:^|\/)questionnaires\.narrative\.(?:ts|tsx|js|jsx|mjs|cjs)$/,
      fastFsScan: true,
    });
    const model = flows.toModel();
    validateCommandRef(model);
  });

  it('should handle experience slice with client specs', async () => {
    const memoryVfs = new InMemoryFileStore();
    const flowWithExperienceContent = `
import { scene, experience, it, specs } from '@auto-engineer/narrative';

scene('Test Experience Flow', () => {
  experience('Homepage', 'H1a4Bn6Cy').client(() => {
    specs(() => {
      it('show a hero section with a welcome message');
      it('allow user to start the questionnaire');
    });
  });
});
      `;

    await memoryVfs.write('/test/experience.narrative.ts', new TextEncoder().encode(flowWithExperienceContent));

    const flows = await getScenes({ vfs: memoryVfs, root: '/test', pattern, fastFsScan: true });
    const model = flows.toModel();

    const experienceFlow = model.scenes.find((f) => f.name === 'Test Experience Flow');
    expect(experienceFlow).toBeDefined();

    if (experienceFlow) {
      const homepageMoment = experienceFlow.moments.find((s) => s.name === 'Homepage');
      expect(homepageMoment).toBeDefined();
      expect(homepageMoment?.type).toBe('experience');

      if (homepageMoment?.type === 'experience') {
        expect(homepageMoment.client).toBeDefined();
        expect(homepageMoment.client.specs).toBeDefined();
        expect(Array.isArray(homepageMoment.client.specs)).toBe(true);
        expect(homepageMoment.client.specs).toHaveLength(2);
        expect(homepageMoment.client.specs[0].type).toBe('it');
        expect(homepageMoment.client.specs[0].title).toBe('show a hero section with a welcome message');
        expect(homepageMoment.client.specs[1].type).toBe('it');
        expect(homepageMoment.client.specs[1].title).toBe('allow user to start the questionnaire');
      }
    }
  });

  it('simulates browser execution with transpiled CommonJS code', async () => {
    const memoryVfs = new InMemoryFileStore();
    const flowContent = `
import { scene, experience, it, specs } from '@auto-engineer/narrative';

scene('Browser Test Flow', () => {
  experience('HomePage').client(() => {
    specs(() => {
      it('render correctly');
    });
  });
});
      `;

    await memoryVfs.write('/browser/test.narrative.ts', new TextEncoder().encode(flowContent));

    const { executeAST } = await import('./loader');
    const { registry } = await import('./narrative-registry');

    registry.clearAll();

    await executeAST(['/browser/test.narrative.ts'], memoryVfs, {}, '/browser');

    const flows = registry.getAllScenes();
    expect(flows).toHaveLength(1);
    expect(flows[0].name).toBe('Browser Test Flow');
    expect(flows[0].moments).toHaveLength(1);

    const slice = flows[0].moments[0];
    expect(slice.type).toBe('experience');
    expect(slice.name).toBe('HomePage');

    if (slice.type === 'experience') {
      expect(slice.client).toBeDefined();
      expect(slice.client.specs).toBeDefined();
      expect(Array.isArray(slice.client.specs)).toBe(true);
      expect(slice.client.specs).toHaveLength(1);
      expect(slice.client.specs[0].type).toBe('it');
      expect(slice.client.specs[0].title).toBe('render correctly');
    }
  });

  it('handles experience slice with ES module interop correctly', async () => {
    const memoryVfs = new InMemoryFileStore();

    const { executeAST } = await import('./loader');
    const { registry } = await import('./narrative-registry');

    const flowContent = `
import { scene, experience } from '@auto-engineer/narrative';

scene('Questionnaires', 'Q9m2Kp4Lx', () => {
  experience('Homepage', 'H1a4Bn6Cy').client(() => {});
});
      `;

    await memoryVfs.write('/browser/questionnaires.narrative.ts', new TextEncoder().encode(flowContent));

    registry.clearAll();

    await expect(
      executeAST(['/browser/questionnaires.narrative.ts'], memoryVfs, {}, '/browser'),
    ).resolves.toBeDefined();

    const flows = registry.getAllScenes();
    expect(flows).toHaveLength(1);
    expect(flows[0].name).toBe('Questionnaires');
    expect(flows[0].moments).toHaveLength(1);

    const slice = flows[0].moments[0];
    expect(slice.type).toBe('experience');
    expect(slice.name).toBe('Homepage');
  });

  it('should handle flow type resolutions correctly', async () => {
    const memoryVfs = new InMemoryFileStore();
    const questionnaireFlowContent = `
import { data, scene, should, specs, rule, example } from '../narrative';
import { command, query } from '../fluent-builder';
import gql from 'graphql-tag';
import { source } from '../data-narrative-builders';
import { type Event, type Command, type State } from '../types';

type QuestionAnswered = Event<
  'QuestionAnswered',
  {
    questionnaireId: string;
    participantId: string;
    questionId: string;
    answer: unknown;
    savedAt: Date;
  }
>;

type SubmitQuestionnaire = Command<
  'SubmitQuestionnaire',
  {
    questionnaireId: string;
    participantId: string;
  }
>;

type AnswerQuestion = Command<
  'AnswerQuestion',
  {
    questionnaireId: string;
    participantId: string;
    questionId: string;
    answer: unknown;
  }
>;

type QuestionnaireProgress = State<
  'QuestionnaireProgress',
  {
    questionnaireId: string;
    participantId: string;
    status: 'in_progress' | 'ready_to_submit' | 'submitted';
    currentQuestionId: string | null;
    remainingQuestions: string[];
    answers: { questionId: string; value: unknown }[];
  }
>;

scene('questionnaires-test', () => {
  query('views progress')
    .server(() => {
      specs('Questionnaire progress display', () => {
        rule('shows answered questions', () => {
          example('question already answered')
            .given<QuestionAnswered>({
              questionnaireId: 'q-001',
              participantId: 'participant-abc',
              questionId: 'q1',
              answer: 'Yes',
              savedAt: new Date('2030-01-01T09:05:00Z'),
            })
            .when({})
            .then<QuestionnaireProgress>({
              questionnaireId: 'q-001',
              participantId: 'participant-abc',
              status: 'in_progress',
              currentQuestionId: 'q2',
              remainingQuestions: ['q2', 'q3'],
              answers: [{ questionId: 'q1', value: 'Yes' }],
            });
        });
      });
    });
  
  command('submits questionnaire')
    .server(() => {
      specs('Questionnaire submission', () => {
        rule('allows submission when ready', () => {
          example('submit completed questionnaire')
            .when<SubmitQuestionnaire>({
              questionnaireId: 'q-001',
              participantId: 'participant-abc',
            })
            .then<QuestionAnswered>({
              questionnaireId: 'q-001',
              participantId: 'participant-abc',
              questionId: 'final',
              answer: 'submitted',
              savedAt: new Date('2030-01-01T09:10:00Z'),
            });
        });
      });
    });
});
    `;

    await memoryVfs.write('/test/questionnaires.narrative.ts', new TextEncoder().encode(questionnaireFlowContent));

    const flows = await getScenes({ vfs: memoryVfs, root: '/test', pattern, fastFsScan: true });
    const model = flows.toModel();
    const testFlow = model.scenes.find((f) => f.name === 'questionnaires-test');
    expect(testFlow).toBeDefined();
    if (testFlow !== null && testFlow !== undefined) {
      validateSubmitQuestionnaireCommand(testFlow);
      validateQuestionAnsweredEvent(model);
      validateGivenSectionEventRefs(testFlow);
      validateCurrentQuestionIdType(model);
    }
  });

  it('correctly distinguishes between State and Event types in given clauses with empty when', async () => {
    const flows = await getScenes({ vfs, root, pattern, fastFsScan: true });
    const model = flows.toModel();

    const mixedGivenFlow = model.scenes.find((f) => f.name === 'Mixed Given Types');
    expect(mixedGivenFlow).toBeDefined();

    if (!mixedGivenFlow) return;

    const queryMoment = mixedGivenFlow.moments.find((s) => s.name === 'system status check');
    expect(queryMoment).toBeDefined();
    expect(queryMoment?.type).toBe('query');

    if (queryMoment?.type !== 'query') return;

    const example = queryMoment.server.specs[0].rules[0]?.examples[0];
    expect(example).toBeDefined();

    if (example !== null && example !== undefined) {
      validateMixedGivenTypes(example);
      validateEmptyWhenClause(example);
      validateThenClause(example);
      validateMixedGivenTypeMessages(model);
    }
  });

  it('does not emit empty generics or empty when clauses', async () => {
    const flows = await getScenes({
      vfs,
      root,
      pattern: /(?:^|\/)questionnaires\.narrative\.(?:ts|tsx|js|jsx|mjs|cjs)$/,
      fastFsScan: true,
    });

    const model = flows.toModel();
    const result = await modelToNarrative(model);
    const code = result.files.map((f) => f.code).join('\n');

    expect(code).not.toMatch(/\.when<>\(\{\}\)/);
    expect(code).not.toMatch(/\.when<\s*\{\s*}\s*>\(\{}\)/);
    expect(code).not.toMatch(/\.when\(\{}\)/);
  });

  it('should not generate phantom messages with empty names', async () => {
    const flows = await getScenes({
      vfs,
      root: root,
      pattern: /(?:^|\/)questionnaires\.narrative\.(?:ts|tsx|js|jsx|mjs|cjs)$/,
      fastFsScan: true,
    });
    const model = flows.toModel();

    const phantomMessages = model.messages.filter((message) => message.name === '');
    expect(phantomMessages).toHaveLength(0);

    const allMessages = model.messages;
    expect(allMessages.every((message) => message.name.length > 0)).toBe(true);
  });

  it('reproduces the questionnaires bug: submits the questionnaire should use SubmitQuestionnaire, not SendQuestionnaireLink', async () => {
    const model = await createQuestionnaireBugTestModel();
    validateQuestionnaireBugFix(model);
  });

  it('should convert all given events to eventRef', async (): Promise<void> => {
    const memoryVfs = new InMemoryFileStore();
    const todoSummaryFlowContent = `
import { scene, query, specs, rule, example, type Event, type State } from '@auto-engineer/narrative';

type TodoAdded = Event<
  'TodoAdded',
  {
    todoId: string;
    description: string;
    status: 'pending';
    addedAt: Date;
  }
>;

type TodoMarkedInProgress = Event<
  'TodoMarkedInProgress',
  {
    todoId: string;
    markedAt: Date;
  }
>;

type TodoMarkedComplete = Event<
  'TodoMarkedComplete',
  {
    todoId: string;
    completedAt: Date;
  }
>;

type TodoListSummary = State<
  'TodoListSummary',
  {
    summaryId: string;
    totalTodos: number;
    pendingCount: number;
    inProgressCount: number;
    completedCount: number;
    completionPercentage: number;
  }
>;

scene('Todo List', () => {
  query('views completion summary')
    .server(() => {
      specs(() => {
        rule('summary shows overall todo list statistics', () => {
          example('calculates summary from multiple todos')
            .given<TodoAdded>({
              todoId: 'todo-001',
              description: 'Buy groceries',
              status: 'pending',
              addedAt: new Date('2030-01-01T09:00:00Z'),
            })
            .and<TodoAdded>({
              todoId: 'todo-002',
              description: 'Write report',
              status: 'pending',
              addedAt: new Date('2030-01-01T09:10:00Z'),
            })
            .and<TodoAdded>({
              todoId: 'todo-003',
              description: 'Call client',
              status: 'pending',
              addedAt: new Date('2030-01-01T09:20:00Z'),
            })
            .and<TodoMarkedInProgress>({
              todoId: 'todo-001',
              markedAt: new Date('2030-01-01T10:00:00Z'),
            })
            .and<TodoMarkedComplete>({
              todoId: 'todo-002',
              completedAt: new Date('2030-01-01T11:00:00Z'),
            })
            .when({})
            .then<TodoListSummary>({
              summaryId: 'main-summary',
              totalTodos: 3,
              pendingCount: 1,
              inProgressCount: 1,
              completedCount: 1,
              completionPercentage: 33,
            });
        });
      });
    });
});
    `;

    await memoryVfs.write('/test/todo-summary.narrative.ts', new TextEncoder().encode(todoSummaryFlowContent));

    const flows = await getScenes({ vfs: memoryVfs, root: '/test', pattern, fastFsScan: true });
    const model = flows.toModel();

    const todoFlow = model.scenes.find((f) => f.name === 'Todo List');
    expect(todoFlow).toBeDefined();

    if (!todoFlow) return;

    const summaryMoment = todoFlow.moments.find((s) => s.name === 'views completion summary');
    expect(summaryMoment?.type).toBe('query');

    if (summaryMoment?.type !== 'query') return;

    const example = summaryMoment.server.specs[0].rules[0]?.examples[0];
    expect(example).toBeDefined();
    expect(example.steps).toBeDefined();
    expect(Array.isArray(example.steps)).toBe(true);

    const givenAndSteps = example.steps.filter((s) => s.keyword === 'Given' || s.keyword === 'And');
    expect(givenAndSteps).toHaveLength(5);

    validateGivenItemsHaveEventRef(givenAndSteps);
    validateTodoEventRefs(givenAndSteps);
    validateTodoMessages(model);
  });
});

function validateGivenItemsHaveEventRef(givenSteps: unknown[]): void {
  for (let i = 0; i < givenSteps.length; i++) {
    const step = givenSteps[i] as { keyword?: string; text?: string };
    if (typeof step === 'object' && step !== null) {
      expect(step.keyword === 'Given' || step.keyword === 'And').toBe(true);
      expect('text' in step).toBe(true);
    }
  }
}

function expectStepText(step: unknown, expectedType: string): void {
  if (step !== null && step !== undefined && typeof step === 'object' && 'text' in step) {
    expect((step as { text: string }).text).toBe(expectedType);
  }
}

function validateTodoEventRefs(givenSteps: unknown[]): void {
  expectStepText(givenSteps[0], 'TodoAdded');
  expectStepText(givenSteps[1], 'TodoAdded');
  expectStepText(givenSteps[2], 'TodoAdded');
  expectStepText(givenSteps[3], 'TodoMarkedInProgress');
  expectStepText(givenSteps[4], 'TodoMarkedComplete');
}

function validateTodoMessages(model: Model): void {
  const todoAddedEvent = model.messages.find((m) => m.name === 'TodoAdded');
  expect(todoAddedEvent).toBeDefined();
  expect(todoAddedEvent?.type).toBe('event');

  const todoMarkedInProgressEvent = model.messages.find((m) => m.name === 'TodoMarkedInProgress');
  expect(todoMarkedInProgressEvent).toBeDefined();
  expect(todoMarkedInProgressEvent?.type).toBe('event');

  const todoMarkedCompleteEvent = model.messages.find((m) => m.name === 'TodoMarkedComplete');
  expect(todoMarkedCompleteEvent).toBeDefined();
  expect(todoMarkedCompleteEvent?.type).toBe('event');

  const todoListSummaryState = model.messages.find((m) => m.name === 'TodoListSummary');
  expect(todoListSummaryState).toBeDefined();
  expect(todoListSummaryState?.type).toBe('state');
}

function validateSubmitQuestionnaireCommand(questionnaireFlow: Scene): void {
  const submitMoment = questionnaireFlow.moments.find((s) => s.name === 'submits questionnaire');
  expect(submitMoment?.type).toBe('command');
  if (submitMoment?.type === 'command') {
    const example = submitMoment.server?.specs?.[0]?.rules[0]?.examples[0];
    const whenStep = example?.steps?.find((s) => s.keyword === 'When');
    if (whenStep && 'text' in whenStep) {
      expect(whenStep.text).toBe('SubmitQuestionnaire');
    }
  }
}

function validateQuestionAnsweredEvent(model: Model): void {
  const questionAnsweredMessage = model.messages.find((m) => m.name === 'QuestionAnswered');
  expect(questionAnsweredMessage?.type).toBe('event');
}

function validateGivenSectionEventRefs(questionnaireFlow: Scene): void {
  const viewsMoment = questionnaireFlow.moments.find((s) => s.name === 'views progress');
  if (viewsMoment?.type === 'query') {
    const example = viewsMoment.server?.specs?.[0]?.rules[0]?.examples[0];
    if (example?.steps !== undefined && Array.isArray(example.steps)) {
      const givenStep = example.steps.find((s) => s.keyword === 'Given');
      if (givenStep && 'text' in givenStep) {
        expect(givenStep.text).toBe('QuestionAnswered');
      }
    }
  }
}

function validateCurrentQuestionIdType(model: Model): void {
  const progressMessage = model.messages.find((m) => m.name === 'QuestionnaireProgress');
  expect(progressMessage?.type).toBe('state');
  const currentQuestionIdField = progressMessage?.fields.find((f) => f.name === 'currentQuestionId');
  expect(currentQuestionIdField?.type).toBe('string | null');
}

function validateMixedGivenTypes(example: Example): void {
  expect(example.name).toBe('system with 2 items reaches max of 2');
  expect(example.steps).toBeDefined();
  expect(Array.isArray(example.steps)).toBe(true);

  const givenSteps = example.steps.filter((s) => s.keyword === 'Given' || s.keyword === 'And');
  expect(givenSteps).toHaveLength(4);

  const firstGiven = givenSteps[0];
  expect('text' in firstGiven).toBe(true);
  if ('text' in firstGiven) {
    expect(firstGiven.text).toBe('ConfigState');
  }

  const secondGiven = givenSteps[1];
  expect('text' in secondGiven).toBe(true);
  if ('text' in secondGiven) {
    expect(secondGiven.text).toBe('SystemInitialized');
  }

  const thirdGiven = givenSteps[2];
  expect('text' in thirdGiven).toBe(true);
  if ('text' in thirdGiven) {
    expect(thirdGiven.text).toBe('ItemAdded');
  }

  const fourthGiven = givenSteps[3];
  expect('text' in fourthGiven).toBe(true);
  if ('text' in fourthGiven) {
    expect(fourthGiven.text).toBe('ItemAdded');
  }
}

function validateEmptyWhenClause(example: Example): void {
  const whenStep = example.steps.find((s) => s.keyword === 'When');
  expect(whenStep).toBeUndefined();
}

function validateThenClause(example: Example): void {
  const thenSteps = example.steps.filter((s) => s.keyword === 'Then');
  expect(thenSteps).toHaveLength(1);

  const thenOutcome = thenSteps[0];
  expect('text' in thenOutcome).toBe(true);
  if ('text' in thenOutcome) {
    expect(thenOutcome.text).toBe('SystemStatus');
  }
}

function validateMixedGivenTypeMessages(model: Model): void {
  const configStateMessage = model.messages.find((m) => m.name === 'ConfigState');
  expect(configStateMessage).toBeDefined();
  expect(configStateMessage?.type).toBe('state');

  const systemInitializedMessage = model.messages.find((m) => m.name === 'SystemInitialized');
  expect(systemInitializedMessage).toBeDefined();
  expect(systemInitializedMessage?.type).toBe('event');

  const itemAddedMessage = model.messages.find((m) => m.name === 'ItemAdded');
  expect(itemAddedMessage).toBeDefined();
  expect(itemAddedMessage?.type).toBe('event');

  const systemStatusMessage = model.messages.find((m) => m.name === 'SystemStatus');
  expect(systemStatusMessage).toBeDefined();
  expect(systemStatusMessage?.type).toBe('state');
}

async function createQuestionnaireBugTestModel(): Promise<Model> {
  const memoryVfs = new InMemoryFileStore();
  const questionnaireFlowContent = getQuestionnaireFlowContent();
  await memoryVfs.write('/test/questionnaires-bug.narrative.ts', new TextEncoder().encode(questionnaireFlowContent));
  const flows = await getScenes({ vfs: memoryVfs, root: '/test', pattern, fastFsScan: true });
  return flows.toModel();
}

function getQuestionnaireFlowContent(): string {
  return `
import {
  command,
  query,
  experience,
  scene,
  describe,
  it,
  specs,
  rule,
  example,
  gql,
  source,
  data,
  sink,
  type Command,
  type Event,
  type State,
} from '@auto-engineer/narrative';

type SendQuestionnaireLink = Command<
  'SendQuestionnaireLink',
  {
    questionnaireId: string;
    participantId: string;
  }
>;

type QuestionnaireLinkSent = Event<
  'QuestionnaireLinkSent',
  {
    questionnaireId: string;
    participantId: string;
    link: string;
    sentAt: Date;
  }
>;

type QuestionnaireSubmitted = Event<
  'QuestionnaireSubmitted',
  {
    questionnaireId: string;
    participantId: string;
    submittedAt: Date;
  }
>;

type SubmitQuestionnaire = Command<
  'SubmitQuestionnaire',
  {
    questionnaireId: string;
    participantId: string;
  }
>;

scene('Questionnaires', 'Q9m2Kp4Lx', () => {
  command('sends the questionnaire link', 'S2b5Cp7Dz')
    .server(() => {
      specs(() => {
        rule('questionnaire link is sent to participant', 'r0A1Bo8X', () => {
          example('sends the questionnaire link successfully')
            .when<SendQuestionnaireLink>({
              questionnaireId: 'q-001',
              participantId: 'participant-abc',
            })
            .then<QuestionnaireLinkSent>({
              questionnaireId: 'q-001',
              participantId: 'participant-abc',
              link: 'https://app.example.com/q/q-001?participant=participant-abc',
              sentAt: new Date('2030-01-01T09:00:00Z'),
            });
        });
      });
      data([sink().event('QuestionnaireLinkSent').toStream('questionnaire-participantId')]);
    })
    .request(gql\`
      mutation SendQuestionnaireLink($input: SendQuestionnaireLinkInput!) {
        sendQuestionnaireLink(input: $input) {
          success
        }
      }
    \`)
    .client(() => {
      describe('Questionnaire Link', () => {
        it('display a confirmation message when the link is sent');
        it('handle errors when the link cannot be sent');
      });
    });

  command('submits the questionnaire', 'T5k9Jw3V')
    .server(() => {
      specs(() => {
        rule('questionnaire allowed to be submitted when all questions are answered', 'r4H0Lx4U', () => {
          example('submits the questionnaire successfully')
            .when<SubmitQuestionnaire>({
              questionnaireId: 'q-001',
              participantId: 'participant-abc',
            })
            .then<QuestionnaireSubmitted>({
              questionnaireId: 'q-001',
              participantId: 'participant-abc',
              submittedAt: new Date('2030-01-01T09:00:00Z'),
            });
        });
      });
      data([sink().event('QuestionnaireSubmitted').toStream('questionnaire-participantId')]);
    })
    .request(gql\`
      mutation SubmitQuestionnaire($input: SubmitQuestionnaireInput!) {
        submitQuestionnaire(input: $input) {
          success
        }
      }
    \`)
    .client(() => {
      describe('Submission Confirmation', () => {
        it('display a confirmation message upon successful submission');
      });
    });
});`;
}

function validateQuestionnaireBugFix(model: Model): void {
  const questionnaireFlow = getQuestionnaireFlowFromModel(model);
  const submitMoment = getSubmitMoment(questionnaireFlow);
  const submitExample = getSubmitExample(submitMoment);

  validateSubmitCommandRef(submitExample);
  validateLinkMomentCommandRef(questionnaireFlow);
}

function getQuestionnaireFlowFromModel(model: Model): Scene {
  const questionnaireFlow = model.scenes.find((f) => f.name === 'Questionnaires');
  expect(questionnaireFlow).toBeDefined();
  if (questionnaireFlow === null || questionnaireFlow === undefined) {
    throw new Error('Questionnaire flow not found');
  }
  return questionnaireFlow;
}

function getSubmitMoment(questionnaireFlow: Scene): {
  type: 'command';
  server: { specs: { type: 'gherkin'; feature: string; rules: { examples: unknown[] }[] }[] };
} {
  const submitMoment = questionnaireFlow.moments.find((s) => s.name === 'submits the questionnaire');
  expect(submitMoment).toBeDefined();
  expect(submitMoment?.type).toBe('command');
  if (submitMoment?.type !== 'command') {
    throw new Error('Submit slice is not a command');
  }
  return submitMoment as {
    type: 'command';
    server: { specs: { type: 'gherkin'; feature: string; rules: { examples: unknown[] }[] }[] };
  };
}

function getSubmitExample(submitMoment: {
  server: { specs: { type: 'gherkin'; feature: string; rules: { examples: unknown[] }[] }[] };
}): unknown {
  const rule = submitMoment.server?.specs?.[0]?.rules[0];
  expect(rule).toBeDefined();
  expect(rule?.examples).toHaveLength(1);
  const example = rule?.examples[0];
  expect((example as { name?: string })?.name).toBe('submits the questionnaire successfully');
  return example;
}

function validateSubmitCommandRef(example: unknown): void {
  const ex = example as { steps?: { keyword: string; text?: string }[] };
  expect(ex?.steps).toBeDefined();
  const whenStep = ex?.steps?.find((s) => s.keyword === 'When');
  if (whenStep && 'text' in whenStep) {
    expect(whenStep.text).toBe('SubmitQuestionnaire');
    expect(whenStep.text).not.toBe('SendQuestionnaireLink');
  } else {
    throw new Error('Expected steps to have a When step with text property');
  }
}

function validateLinkMomentCommandRef(questionnaireFlow: Scene): void {
  const linkMoment = questionnaireFlow.moments.find((s) => s.name === 'sends the questionnaire link');
  expect(linkMoment?.type).toBe('command');
  if (linkMoment?.type === 'command') {
    const linkExample = linkMoment.server?.specs?.[0]?.rules[0]?.examples[0];
    const ex = linkExample as { steps?: { keyword: string; text?: string }[] };
    const whenStep = ex?.steps?.find((s) => s.keyword === 'When');
    if (whenStep && 'text' in whenStep) {
      expect(whenStep.text).toBe('SendQuestionnaireLink');
    }
  }
}

function validateCommandRef(model: Model): void {
  const questionnaireFlow = getQuestionnaireFlowFromModel(model);
  const submitMoment = getSubmitMomentFromFlow(questionnaireFlow);
  const serverSpecs = getServerSpecsFromMoment(submitMoment);
  const rule = getFirstRuleFromSpecs(serverSpecs);
  const example = getFirstExampleFromRule(rule);

  validateExampleCommandRef(example);
  validateThenEvents(example);
}

function getSubmitMomentFromFlow(questionnaireFlow: Scene): unknown {
  const submitMoment = questionnaireFlow.moments.find((s) => s.name === 'submits the questionnaire');
  expect(submitMoment).toBeDefined();
  expect(submitMoment?.type).toBe('command');
  if (submitMoment?.type !== 'command') {
    throw new Error('Submit slice is not a command');
  }
  return submitMoment;
}

function getServerSpecsFromMoment(submitMoment: unknown): unknown {
  const slice = submitMoment as { server?: { specs?: unknown[] } };
  const serverSpecs = slice.server?.specs;
  expect(serverSpecs).toBeDefined();
  expect(Array.isArray(serverSpecs)).toBe(true);
  expect(serverSpecs).toHaveLength(1);
  const firstSpec = (serverSpecs as unknown[])[0] as { rules?: unknown[] };
  expect(firstSpec?.rules).toBeDefined();
  expect(firstSpec?.rules).toHaveLength(1);
  return firstSpec;
}

function getFirstRuleFromSpecs(serverSpecs: unknown): unknown {
  const specs = serverSpecs as { rules?: unknown[] };
  const rule = specs?.rules?.[0];
  expect(rule).toBeDefined();
  const r = rule as { name?: string; examples?: unknown[] };
  expect(r?.name).toBe('questionnaire allowed to be submitted when all questions are answered');
  expect(r?.examples).toBeDefined();
  expect(r?.examples).toHaveLength(1);
  return rule;
}

function getFirstExampleFromRule(rule: unknown): unknown {
  const r = rule as { examples?: unknown[] };
  const example = r?.examples?.[0];
  expect(example).toBeDefined();
  const ex = example as { name?: string };
  expect(ex?.name).toBe('submits the questionnaire successfully');
  return example;
}

function validateExampleCommandRef(example: unknown): void {
  const ex = example as { steps?: Array<{ keyword: string; text?: string; docString?: unknown }> };
  expect(ex?.steps).toBeDefined();
  const whenStep = ex?.steps?.find((s) => s.keyword === 'When');
  expect(whenStep).toBeDefined();
  if (whenStep && 'text' in whenStep) {
    expect(whenStep.text).toBe('SubmitQuestionnaire');
    expect(whenStep.text).not.toBe('SendQuestionnaireLink');
    expect(whenStep.docString).toEqual({
      questionnaireId: 'q-001',
      participantId: 'participant-abc',
    });
  } else {
    throw new Error('Expected when step to have text property');
  }
}

function validateThenEvents(example: unknown): void {
  const ex = example as { steps?: Array<{ keyword: string; text?: string; docString?: unknown }> };
  expect(ex?.steps).toBeDefined();
  const thenSteps = ex?.steps?.filter((s) => s.keyword === 'Then');
  expect(thenSteps).toHaveLength(1);

  const thenStep = thenSteps?.[0];
  if (thenStep && 'text' in thenStep) {
    expect(thenStep.text).toBe('QuestionnaireSubmitted');
    expect(thenStep.docString).toEqual({
      questionnaireId: 'q-001',
      participantId: 'participant-abc',
      submittedAt: new Date('2030-01-01T09:00:00.000Z'),
    });
  }
}

describe('modules in toModel()', () => {
  it('should derive modules from scenes with different sourceFiles', async () => {
    const memoryVfs = new InMemoryFileStore();

    const ordersContent = `
import { scene, command, specs, rule, example, type Command, type Event } from '@auto-engineer/narrative';

type CreateOrder = Command<'CreateOrder', { orderId: string }>;
type OrderCreated = Event<'OrderCreated', { orderId: string; createdAt: Date }>;

scene('Orders', () => {
  command('create order')
    .server(() => {
      specs(() => {
        rule('creates an order', () => {
          example('order created')
            .when<CreateOrder>({ orderId: 'order-001' })
            .then<OrderCreated>({ orderId: 'order-001', createdAt: new Date('2030-01-01T09:00:00Z') });
        });
      });
    });
});
`;

    const usersContent = `
import { scene, command, specs, rule, example, type Command, type Event } from '@auto-engineer/narrative';

type CreateUser = Command<'CreateUser', { userId: string; name: string }>;
type UserCreated = Event<'UserCreated', { userId: string; name: string; createdAt: Date }>;

scene('Users', () => {
  command('create user')
    .server(() => {
      specs(() => {
        rule('creates a user', () => {
          example('user created')
            .when<CreateUser>({ userId: 'user-001', name: 'Alice' })
            .then<UserCreated>({ userId: 'user-001', name: 'Alice', createdAt: new Date('2030-01-01T09:00:00Z') });
        });
      });
    });
});
`;

    await memoryVfs.write('/test/orders.narrative.ts', new TextEncoder().encode(ordersContent));
    await memoryVfs.write('/test/users.narrative.ts', new TextEncoder().encode(usersContent));

    const flows = await getScenes({
      vfs: memoryVfs,
      root: '/test',
      pattern: /\.narrative\.ts$/,
      fastFsScan: true,
    });
    const model = flows.toModel();

    expect(model.modules).toBeDefined();
    expect(model.modules.length).toBe(2);

    const sourceFiles = model.modules.map((m) => m.sourceFile);
    expect(sourceFiles.some((sf) => sf.includes('orders.narrative.ts'))).toBe(true);
    expect(sourceFiles.some((sf) => sf.includes('users.narrative.ts'))).toBe(true);

    const ordersModule = model.modules.find((m) => m.sourceFile.includes('orders.narrative.ts'));
    const usersModule = model.modules.find((m) => m.sourceFile.includes('users.narrative.ts'));

    expect(ordersModule).toBeDefined();
    expect(ordersModule?.isDerived).toBe(true);

    expect(usersModule).toBeDefined();
    expect(usersModule?.isDerived).toBe(true);
  });

  it('should include all messages in derived module declarations', async () => {
    const memoryVfs = new InMemoryFileStore();

    const content = `
import { scene, command, specs, rule, example, type Command, type Event } from '@auto-engineer/narrative';

type CreateOrder = Command<'CreateOrder', { orderId: string }>;
type OrderCreated = Event<'OrderCreated', { orderId: string }>;

scene('Orders', () => {
  command('create order')
    .server(() => {
      specs(() => {
        rule('creates order', () => {
          example('order created')
            .when<CreateOrder>({ orderId: 'order-001' })
            .then<OrderCreated>({ orderId: 'order-001' });
        });
      });
    });
});
`;

    await memoryVfs.write('/test/orders.narrative.ts', new TextEncoder().encode(content));

    const flows = await getScenes({
      vfs: memoryVfs,
      root: '/test',
      pattern: /\.narrative\.ts$/,
      fastFsScan: true,
    });
    const model = flows.toModel();

    expect(model.modules).toHaveLength(1);
    const mod = model.modules[0];

    const declaredNames = mod.declares.messages.map((m) => m.name);
    expect(declaredNames).toContain('CreateOrder');
    expect(declaredNames).toContain('OrderCreated');
  });

  it('should group scenes from same sourceFile into one module', async () => {
    const memoryVfs = new InMemoryFileStore();

    const content = `
import { scene, command, query, specs, rule, example, type Command, type Event, type State } from '@auto-engineer/narrative';

type CreateTodo = Command<'CreateTodo', { todoId: string }>;
type TodoCreated = Event<'TodoCreated', { todoId: string }>;
type TodoList = State<'TodoList', { todos: string[] }>;

scene('Create Todos', () => {
  command('add todo')
    .server(() => {
      specs(() => {
        rule('adds todo', () => {
          example('todo added')
            .when<CreateTodo>({ todoId: 'todo-001' })
            .then<TodoCreated>({ todoId: 'todo-001' });
        });
      });
    });
});

scene('View Todos', () => {
  query('list todos')
    .server(() => {
      specs(() => {
        rule('shows todos', () => {
          example('todos listed')
            .given<TodoCreated>({ todoId: 'todo-001' })
            .when({})
            .then<TodoList>({ todos: ['todo-001'] });
        });
      });
    });
});
`;

    await memoryVfs.write('/test/todos.narrative.ts', new TextEncoder().encode(content));

    const flows = await getScenes({
      vfs: memoryVfs,
      root: '/test',
      pattern: /\.narrative\.ts$/,
      fastFsScan: true,
    });
    const model = flows.toModel();

    expect(model.modules).toHaveLength(1);
    expect(model.modules[0].contains.sceneIds).toHaveLength(2);

    const sceneNames = model.scenes.map((n) => n.name);
    expect(sceneNames).toContain('Create Todos');
    expect(sceneNames).toContain('View Todos');
  });

  it('should validate model with modules passes schema', async () => {
    const memoryVfs = new InMemoryFileStore();

    const content = `
import { scene, command, specs, rule, example, type Command, type Event } from '@auto-engineer/narrative';

type DoSomething = Command<'DoSomething', { id: string }>;
type SomethingDone = Event<'SomethingDone', { id: string }>;

scene('Test', () => {
  command('do something')
    .server(() => {
      specs(() => {
        rule('does something', () => {
          example('something done')
            .when<DoSomething>({ id: '001' })
            .then<SomethingDone>({ id: '001' });
        });
      });
    });
});
`;

    await memoryVfs.write('/test/test.narrative.ts', new TextEncoder().encode(content));

    const flows = await getScenes({
      vfs: memoryVfs,
      root: '/test',
      pattern: /\.narrative\.ts$/,
      fastFsScan: true,
    });
    const model = flows.toModel();

    const parseResult = modelSchema.safeParse(model);
    if (!parseResult.success) {
      console.error('Schema validation errors:', parseResult.error.format());
    }
    expect(parseResult.success).toBe(true);
    expect(parseResult.data?.modules).toBeDefined();
    expect(parseResult.data?.modules.length).toBeGreaterThan(0);
  });
});

describe('projection DSL methods', () => {
  it('should generate correct origin for singleton projection', async () => {
    const memoryVfs = new InMemoryFileStore();
    const flowContent = `
import { scene, query, specs, rule, example, data, source, type Event, type State } from '@auto-engineer/narrative';

type TodoAdded = Event<'TodoAdded', { todoId: string; description: string; addedAt: Date }>;
type TodoListSummary = State<'TodoListSummary', { summaryId: string; totalTodos: number }>;

scene('Projection Test', () => {
  query('views summary')
    .server(() => {
      specs(() => {
        rule('shows summary', () => {
          example('summary')
            .given<TodoAdded>({ todoId: 'todo-001', description: 'Test', addedAt: new Date('2030-01-01T09:00:00Z') })
            .when({})
            .then<TodoListSummary>({ summaryId: 'main', totalTodos: 1 });
        });
      });
      data([source().state<TodoListSummary>('TodoListSummary').fromSingletonProjection('TodoSummary')]);
    });
});
    `;

    await memoryVfs.write('/test/projection.narrative.ts', new TextEncoder().encode(flowContent));

    const flows = await getScenes({ vfs: memoryVfs, root: '/test', pattern, fastFsScan: true });
    const model = flows.toModel();

    const projectionFlow = model.scenes.find((f) => f.name === 'Projection Test');
    expect(projectionFlow).toBeDefined();

    if (!projectionFlow) return;

    const summaryMoment = projectionFlow.moments.find((s) => s.name === 'views summary');
    expect(summaryMoment?.type).toBe('query');

    if (summaryMoment?.type !== 'query') return;

    const data = summaryMoment.server.data;
    expect(data).toBeDefined();
    expect(data?.items).toHaveLength(1);

    expect(data?.items?.[0].origin).toMatchObject({
      type: 'projection',
      name: 'TodoSummary',
      singleton: true,
    });

    expect(data?.items?.[0].origin).not.toHaveProperty('idField');
  });

  it('should generate correct origin for regular projection with single idField', async () => {
    const memoryVfs = new InMemoryFileStore();
    const flowContent = `
import { scene, query, specs, rule, example, data, source, type Event, type State } from '@auto-engineer/narrative';

type TodoAdded = Event<'TodoAdded', { todoId: string; description: string; addedAt: Date }>;
type TodoState = State<'TodoState', { todoId: string; description: string; status: string }>;

scene('Projection Test', () => {
  query('views todo')
    .server(() => {
      specs(() => {
        rule('shows todo', () => {
          example('todo')
            .given<TodoAdded>({ todoId: 'todo-001', description: 'Test', addedAt: new Date('2030-01-01T09:00:00Z') })
            .when({})
            .then<TodoState>({ todoId: 'todo-001', description: 'Test', status: 'pending' });
        });
      });
      data([source().state<TodoState>('TodoState').fromProjection('Todos', 'todoId')]);
    });
});
    `;

    await memoryVfs.write('/test/projection.narrative.ts', new TextEncoder().encode(flowContent));

    const flows = await getScenes({ vfs: memoryVfs, root: '/test', pattern, fastFsScan: true });
    const model = flows.toModel();

    const projectionFlow = model.scenes.find((f) => f.name === 'Projection Test');
    expect(projectionFlow).toBeDefined();

    if (!projectionFlow) return;

    const todoMoment = projectionFlow.moments.find((s) => s.name === 'views todo');
    expect(todoMoment?.type).toBe('query');

    if (todoMoment?.type !== 'query') return;

    const data = todoMoment.server.data;
    expect(data).toBeDefined();
    expect(data?.items).toHaveLength(1);

    expect(data?.items?.[0].origin).toMatchObject({
      type: 'projection',
      name: 'Todos',
      idField: 'todoId',
    });

    expect(data?.items?.[0].origin).not.toHaveProperty('singleton');
  });

  it('should generate correct origin for composite projection with multiple idFields', async () => {
    const memoryVfs = new InMemoryFileStore();
    const flowContent = `
import { scene, query, specs, rule, example, data, source, type Event, type State } from '@auto-engineer/narrative';

type UserProjectAssigned = Event<'UserProjectAssigned', { userId: string; projectId: string; assignedAt: Date }>;
type UserProjectState = State<'UserProjectState', { userId: string; projectId: string; role: string }>;

scene('Projection Test', () => {
  query('views user project')
    .server(() => {
      specs(() => {
        rule('shows user project', () => {
          example('user project')
            .given<UserProjectAssigned>({ userId: 'user-001', projectId: 'proj-001', assignedAt: new Date('2030-01-01T09:00:00Z') })
            .when({})
            .then<UserProjectState>({ userId: 'user-001', projectId: 'proj-001', role: 'admin' });
        });
      });
      data([source().state<UserProjectState>('UserProjectState').fromCompositeProjection('UserProjects', ['userId', 'projectId'])]);
    });
});
    `;

    await memoryVfs.write('/test/projection.narrative.ts', new TextEncoder().encode(flowContent));

    const flows = await getScenes({ vfs: memoryVfs, root: '/test', pattern, fastFsScan: true });
    const model = flows.toModel();

    const projectionFlow = model.scenes.find((f) => f.name === 'Projection Test');
    expect(projectionFlow).toBeDefined();

    if (!projectionFlow) return;

    const userProjectMoment = projectionFlow.moments.find((s) => s.name === 'views user project');
    expect(userProjectMoment?.type).toBe('query');

    if (userProjectMoment?.type !== 'query') return;

    const data = userProjectMoment.server.data;
    expect(data).toBeDefined();
    expect(data?.items).toHaveLength(1);

    expect(data?.items?.[0].origin).toMatchObject({
      type: 'projection',
      name: 'UserProjects',
      idField: ['userId', 'projectId'],
    });

    expect(data?.items?.[0].origin).not.toHaveProperty('singleton');
  });

  it('should validate all three projection patterns together', async () => {
    const memoryVfs = new InMemoryFileStore();
    const flowContent = `
import { scene, query, specs, rule, example, data, source, type Event, type State } from '@auto-engineer/narrative';

type TodoAdded = Event<'TodoAdded', { todoId: string; userId: string; projectId: string; description: string; addedAt: Date }>;

type TodoListSummary = State<'TodoListSummary', { summaryId: string; totalTodos: number }>;
type TodoState = State<'TodoState', { todoId: string; description: string; status: string }>;
type UserProjectTodos = State<'UserProjectTodos', { userId: string; projectId: string; todos: string[] }>;

scene('All Projection Patterns', () => {
  query('views summary')
    .server(() => {
      specs(() => {
        rule('shows summary', () => {
          example('summary')
            .given<TodoAdded>({ todoId: 'todo-001', userId: 'u1', projectId: 'p1', description: 'Test', addedAt: new Date('2030-01-01T09:00:00Z') })
            .when({})
            .then<TodoListSummary>({ summaryId: 'main', totalTodos: 1 });
        });
      });
      data([source().state<TodoListSummary>('TodoListSummary').fromSingletonProjection('TodoSummary')]);
    });

  query('views todo')
    .server(() => {
      specs(() => {
        rule('shows todo', () => {
          example('todo')
            .given<TodoAdded>({ todoId: 'todo-001', userId: 'u1', projectId: 'p1', description: 'Test', addedAt: new Date('2030-01-01T09:00:00Z') })
            .when({})
            .then<TodoState>({ todoId: 'todo-001', description: 'Test', status: 'pending' });
        });
      });
      data([source().state<TodoState>('TodoState').fromProjection('Todos', 'todoId')]);
    });

  query('views user project todos')
    .server(() => {
      specs(() => {
        rule('shows user project todos', () => {
          example('user project todos')
            .given<TodoAdded>({ todoId: 'todo-001', userId: 'u1', projectId: 'p1', description: 'Test', addedAt: new Date('2030-01-01T09:00:00Z') })
            .when({})
            .then<UserProjectTodos>({ userId: 'u1', projectId: 'p1', todos: ['todo-001'] });
        });
      });
      data([source().state<UserProjectTodos>('UserProjectTodos').fromCompositeProjection('UserProjectTodos', ['userId', 'projectId'])]);
    });
});
    `;

    await memoryVfs.write('/test/projection.narrative.ts', new TextEncoder().encode(flowContent));

    const flows = await getScenes({ vfs: memoryVfs, root: '/test', pattern, fastFsScan: true });
    const model = flows.toModel();

    const parseResult = modelSchema.safeParse(model);
    if (!parseResult.success) {
      console.error('Schema validation errors:', parseResult.error.format());
    }
    expect(parseResult.success).toBe(true);

    const projectionFlow = model.scenes.find((f) => f.name === 'All Projection Patterns');
    expect(projectionFlow).toBeDefined();

    if (!projectionFlow) return;

    expect(projectionFlow.moments).toHaveLength(3);

    const summaryMoment = projectionFlow.moments.find((s) => s.name === 'views summary');
    if (summaryMoment?.type === 'query') {
      const data = summaryMoment.server.data;
      expect(data?.items?.[0].origin).toMatchObject({
        type: 'projection',
        name: 'TodoSummary',
        singleton: true,
      });
    }

    const todoMoment = projectionFlow.moments.find((s) => s.name === 'views todo');
    if (todoMoment?.type === 'query') {
      const data = todoMoment.server.data;
      expect(data?.items?.[0].origin).toMatchObject({
        type: 'projection',
        name: 'Todos',
        idField: 'todoId',
      });
    }

    const userProjectMoment = projectionFlow.moments.find((s) => s.name === 'views user project todos');
    if (userProjectMoment?.type === 'query') {
      const data = userProjectMoment.server.data;
      expect(data?.items?.[0].origin).toMatchObject({
        type: 'projection',
        name: 'UserProjectTodos',
        idField: ['userId', 'projectId'],
      });
    }
  });

  it('should capture optional id on data sink and source items', async () => {
    const memoryVfs = new InMemoryFileStore();

    const flowContent = `
import { scene, command, query, specs, rule, example, data, sink, source, type Event, type State } from '@auto-engineer/narrative';

type OrderPlaced = Event<'OrderPlaced', { orderId: string; amount: number }>;
type OrderState = State<'OrderState', { orderId: string; status: string }>;

scene('Data Item IDs', () => {
  command('places order')
    .server(() => {
      specs(() => {
        rule('order is placed', () => {
          example('places order')
            .when({})
            .then<OrderPlaced>({ orderId: 'ord-001', amount: 100 });
        });
      });
      data([
        sink('SINK-001').event('OrderPlaced').toStream('orders-stream'),
      ]);
    });

  query('views order status')
    .server(() => {
      specs(() => {
        rule('shows order status', () => {
          example('order status')
            .given<OrderPlaced>({ orderId: 'ord-001', amount: 100 })
            .when({})
            .then<OrderState>({ orderId: 'ord-001', status: 'pending' });
        });
      });
      data([
        source('SOURCE-001').state<OrderState>('OrderState').fromProjection('Orders', 'orderId'),
      ]);
    });
});
    `;

    await memoryVfs.write('/test/data-ids.narrative.ts', new TextEncoder().encode(flowContent));

    const flows = await getScenes({ vfs: memoryVfs, root: '/test', pattern, fastFsScan: true });
    const model = flows.toModel();

    const parseResult = modelSchema.safeParse(model);
    expect(parseResult.success).toBe(true);

    const dataIdsFlow = model.scenes.find((f) => f.name === 'Data Item IDs');
    expect(dataIdsFlow).toBeDefined();

    if (!dataIdsFlow) return;

    const commandMoment = dataIdsFlow.moments.find((s) => s.name === 'places order');
    if (commandMoment?.type === 'command') {
      const sinkData = commandMoment.server.data;
      expect(sinkData?.items).toHaveLength(1);
      expect(sinkData?.items?.[0].id).toBe('SINK-001');
    }

    const queryMoment = dataIdsFlow.moments.find((s) => s.name === 'views order status');
    if (queryMoment?.type === 'query') {
      const sourceData = queryMoment.server.data;
      expect(sourceData?.items).toHaveLength(1);
      expect(sourceData?.items?.[0].id).toBe('SOURCE-001');
    }
  });
});

describe('round-trip: model -> narrative code -> VFS -> getScenes -> toModel', { timeout: 30_000 }, () => {
  it('preserves step text values through full round-trip', async () => {
    const inputModel: Model = {
      variant: 'specs',
      scenes: [
        {
          name: 'Stay management',
          moments: [
            {
              type: 'command',
              name: 'Publish stay',
              stream: 'stay-${stayId}',
              client: { specs: [] },
              server: {
                description: '',
                specs: [
                  {
                    type: 'gherkin',
                    feature: 'Publishing stays',
                    rules: [
                      {
                        name: 'A valid stay can be published',
                        examples: [
                          {
                            name: 'publish a draft stay',
                            steps: [
                              {
                                keyword: 'Given',
                                text: 'StayCreated',
                                docString: { stayId: 'stay_1', title: 'Beach house' },
                              },
                              {
                                keyword: 'When',
                                text: 'PublishStay',
                                docString: { stayId: 'stay_1' },
                              },
                              {
                                keyword: 'Then',
                                text: 'StayPublished',
                                docString: { stayId: 'stay_1', publishedAt: '2024-06-01T00:00:00.000Z' },
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
                data: undefined,
              },
            },
          ],
        },
      ],
      messages: [
        {
          type: 'event',
          name: 'StayCreated',
          fields: [
            { name: 'stayId', type: 'string', required: true },
            { name: 'title', type: 'string', required: true },
          ],
        },
        {
          type: 'command',
          name: 'PublishStay',
          fields: [{ name: 'stayId', type: 'string', required: true }],
        },
        {
          type: 'event',
          name: 'StayPublished',
          fields: [
            { name: 'stayId', type: 'string', required: true },
            { name: 'publishedAt', type: 'string', required: true },
          ],
        },
      ],
      modules: [],
    };

    const generated = await modelToNarrative(inputModel);

    const vfs = new InMemoryFileStore();
    clearGetScenesCache();

    for (const file of generated.files) {
      const filePath = `/project/${file.path}`;
      await vfs.write(filePath, new TextEncoder().encode(file.code));
    }

    const result = await getScenes({
      vfs,
      root: '/project',
      pattern: /\.(narrative)\.(ts)$/,
      fastFsScan: true,
    });

    const roundTrippedModel = result.toModel();

    const stayNarrative = roundTrippedModel.scenes.find((n) => n.name === 'Stay management');
    const publishMoment = stayNarrative!.moments.find((s) => s.name === 'Publish stay');
    expect(publishMoment!.type).toBe('command');

    if (publishMoment?.type === 'command') {
      const example = publishMoment.server.specs[0].rules[0].examples[0];
      expect(example.steps).toEqual([
        { keyword: 'Given', text: 'StayCreated', docString: { stayId: 'stay_1', title: 'Beach house' } },
        { keyword: 'When', text: 'PublishStay', docString: { stayId: 'stay_1' } },
        {
          keyword: 'Then',
          text: 'StayPublished',
          docString: { stayId: 'stay_1', publishedAt: '2024-06-01T00:00:00.000Z' },
        },
      ]);
    }
  });

  it('preserves step text with multiple given events and multiple examples', async () => {
    const inputModel: Model = {
      variant: 'specs',
      scenes: [
        {
          name: 'Order processing',
          moments: [
            {
              type: 'command',
              name: 'Complete order',
              stream: 'order-${orderId}',
              client: { specs: [] },
              server: {
                description: '',
                specs: [
                  {
                    type: 'gherkin',
                    feature: 'Completing orders',
                    rules: [
                      {
                        name: 'An order with items can be completed',
                        examples: [
                          {
                            name: 'complete an order with payment',
                            steps: [
                              {
                                keyword: 'Given',
                                text: 'OrderCreated',
                                docString: { orderId: 'ord_1', customerId: 'cust_1' },
                              },
                              {
                                keyword: 'And',
                                text: 'PaymentReceived',
                                docString: { orderId: 'ord_1', amount: 100 },
                              },
                              {
                                keyword: 'When',
                                text: 'CompleteOrder',
                                docString: { orderId: 'ord_1' },
                              },
                              {
                                keyword: 'Then',
                                text: 'OrderCompleted',
                                docString: { orderId: 'ord_1', completedAt: '2024-06-01T00:00:00.000Z' },
                              },
                            ],
                          },
                          {
                            name: 'reject order without payment',
                            steps: [
                              {
                                keyword: 'Given',
                                text: 'OrderCreated',
                                docString: { orderId: 'ord_2', customerId: 'cust_2' },
                              },
                              {
                                keyword: 'When',
                                text: 'CompleteOrder',
                                docString: { orderId: 'ord_2' },
                              },
                              {
                                keyword: 'Then',
                                text: 'OrderRejected',
                                docString: { orderId: 'ord_2', reason: 'no payment' },
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
                data: undefined,
              },
            },
          ],
        },
      ],
      messages: [
        {
          type: 'event',
          name: 'OrderCreated',
          fields: [
            { name: 'orderId', type: 'string', required: true },
            { name: 'customerId', type: 'string', required: true },
          ],
        },
        {
          type: 'event',
          name: 'PaymentReceived',
          fields: [
            { name: 'orderId', type: 'string', required: true },
            { name: 'amount', type: 'number', required: true },
          ],
        },
        {
          type: 'command',
          name: 'CompleteOrder',
          fields: [{ name: 'orderId', type: 'string', required: true }],
        },
        {
          type: 'event',
          name: 'OrderCompleted',
          fields: [
            { name: 'orderId', type: 'string', required: true },
            { name: 'completedAt', type: 'string', required: true },
          ],
        },
        {
          type: 'event',
          name: 'OrderRejected',
          fields: [
            { name: 'orderId', type: 'string', required: true },
            { name: 'reason', type: 'string', required: true },
          ],
        },
      ],
      modules: [],
    };

    const generated = await modelToNarrative(inputModel);

    const vfs = new InMemoryFileStore();
    clearGetScenesCache();

    for (const file of generated.files) {
      const filePath = `/project/${file.path}`;
      await vfs.write(filePath, new TextEncoder().encode(file.code));
    }

    const result = await getScenes({
      vfs,
      root: '/project',
      pattern: /\.(narrative)\.(ts)$/,
      fastFsScan: true,
    });

    const roundTrippedModel = result.toModel();

    const orderNarrative = roundTrippedModel.scenes.find((n) => n.name === 'Order processing');
    const completeMoment = orderNarrative!.moments.find((s) => s.name === 'Complete order');
    expect(completeMoment!.type).toBe('command');

    if (completeMoment?.type === 'command') {
      const examples = completeMoment.server.specs[0].rules[0].examples;

      expect(examples[0].steps).toEqual([
        { keyword: 'Given', text: 'OrderCreated', docString: { orderId: 'ord_1', customerId: 'cust_1' } },
        { keyword: 'And', text: 'PaymentReceived', docString: { orderId: 'ord_1', amount: 100 } },
        { keyword: 'When', text: 'CompleteOrder', docString: { orderId: 'ord_1' } },
        {
          keyword: 'Then',
          text: 'OrderCompleted',
          docString: { orderId: 'ord_1', completedAt: '2024-06-01T00:00:00.000Z' },
        },
      ]);

      expect(examples[1].steps).toEqual([
        { keyword: 'Given', text: 'OrderCreated', docString: { orderId: 'ord_2', customerId: 'cust_2' } },
        { keyword: 'When', text: 'CompleteOrder', docString: { orderId: 'ord_2' } },
        { keyword: 'Then', text: 'OrderRejected', docString: { orderId: 'ord_2', reason: 'no payment' } },
      ]);
    }
  });

  it('preserves step text with multiple scenes in separate modules', async () => {
    const inputModel: Model = {
      variant: 'specs',
      scenes: [
        {
          name: 'Stays',
          sourceFile: 'stays.narrative.ts',
          moments: [
            {
              type: 'command',
              name: 'Create stay',
              stream: 'stay-${stayId}',
              client: { specs: [] },
              server: {
                description: '',
                specs: [
                  {
                    type: 'gherkin',
                    feature: 'Creating stays',
                    rules: [
                      {
                        name: 'A valid stay can be created',
                        examples: [
                          {
                            name: 'create a new stay',
                            steps: [
                              {
                                keyword: 'When',
                                text: 'CreateStay',
                                docString: { stayId: 'stay_1', title: 'Cozy cabin' },
                              },
                              {
                                keyword: 'Then',
                                text: 'StayCreated',
                                docString: { stayId: 'stay_1', title: 'Cozy cabin' },
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
                data: undefined,
              },
            },
          ],
        },
        {
          name: 'Bookings',
          sourceFile: 'bookings.narrative.ts',
          moments: [
            {
              type: 'command',
              name: 'Book stay',
              stream: 'booking-${bookingId}',
              client: { specs: [] },
              server: {
                description: '',
                specs: [
                  {
                    type: 'gherkin',
                    feature: 'Booking stays',
                    rules: [
                      {
                        name: 'A published stay can be booked',
                        examples: [
                          {
                            name: 'book a published stay',
                            steps: [
                              {
                                keyword: 'Given',
                                text: 'StayPublished',
                                docString: { stayId: 'stay_1', publishedAt: '2024-01-01T00:00:00.000Z' },
                              },
                              {
                                keyword: 'When',
                                text: 'BookStay',
                                docString: { stayId: 'stay_1', guestId: 'guest_1' },
                              },
                              {
                                keyword: 'Then',
                                text: 'StayBooked',
                                docString: {
                                  stayId: 'stay_1',
                                  guestId: 'guest_1',
                                  bookedAt: '2024-02-01T00:00:00.000Z',
                                },
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
                data: undefined,
              },
            },
          ],
        },
      ],
      messages: [
        {
          type: 'command',
          name: 'CreateStay',
          fields: [
            { name: 'stayId', type: 'string', required: true },
            { name: 'title', type: 'string', required: true },
          ],
        },
        {
          type: 'event',
          name: 'StayCreated',
          fields: [
            { name: 'stayId', type: 'string', required: true },
            { name: 'title', type: 'string', required: true },
          ],
        },
        {
          type: 'event',
          name: 'StayPublished',
          fields: [
            { name: 'stayId', type: 'string', required: true },
            { name: 'publishedAt', type: 'string', required: true },
          ],
        },
        {
          type: 'command',
          name: 'BookStay',
          fields: [
            { name: 'stayId', type: 'string', required: true },
            { name: 'guestId', type: 'string', required: true },
          ],
        },
        {
          type: 'event',
          name: 'StayBooked',
          fields: [
            { name: 'stayId', type: 'string', required: true },
            { name: 'guestId', type: 'string', required: true },
            { name: 'bookedAt', type: 'string', required: true },
          ],
        },
      ],
      modules: [
        {
          sourceFile: 'stays.narrative.ts',
          isDerived: true,
          contains: { sceneIds: [] },
          declares: {
            messages: [
              { kind: 'command', name: 'CreateStay' },
              { kind: 'event', name: 'StayCreated' },
            ],
          },
        },
        {
          sourceFile: 'bookings.narrative.ts',
          isDerived: true,
          contains: { sceneIds: [] },
          declares: {
            messages: [
              { kind: 'event', name: 'StayPublished' },
              { kind: 'command', name: 'BookStay' },
              { kind: 'event', name: 'StayBooked' },
            ],
          },
        },
      ],
    };

    const generated = await modelToNarrative(inputModel);

    const vfs = new InMemoryFileStore();
    clearGetScenesCache();

    for (const file of generated.files) {
      const filePath = `/project/${file.path}`;
      await vfs.write(filePath, new TextEncoder().encode(file.code));
    }

    const result = await getScenes({
      vfs,
      root: '/project',
      pattern: /\.(narrative)\.(ts)$/,
      fastFsScan: true,
    });

    const roundTrippedModel = result.toModel();

    const bookingsNarrative = roundTrippedModel.scenes.find((n) => n.name === 'Bookings');
    const bookMoment = bookingsNarrative!.moments.find((s) => s.name === 'Book stay');
    expect(bookMoment!.type).toBe('command');

    if (bookMoment?.type === 'command') {
      const example = bookMoment.server.specs[0].rules[0].examples[0];
      expect(example.steps).toEqual([
        {
          keyword: 'Given',
          text: 'StayPublished',
          docString: { stayId: 'stay_1', publishedAt: '2024-01-01T00:00:00.000Z' },
        },
        { keyword: 'When', text: 'BookStay', docString: { stayId: 'stay_1', guestId: 'guest_1' } },
        {
          keyword: 'Then',
          text: 'StayBooked',
          docString: { stayId: 'stay_1', guestId: 'guest_1', bookedAt: '2024-02-01T00:00:00.000Z' },
        },
      ]);
    }

    const staysNarrative = roundTrippedModel.scenes.find((n) => n.name === 'Stays');
    const createMoment = staysNarrative!.moments.find((s) => s.name === 'Create stay');
    expect(createMoment!.type).toBe('command');

    if (createMoment?.type === 'command') {
      const example = createMoment.server.specs[0].rules[0].examples[0];
      expect(example.steps).toEqual([
        { keyword: 'When', text: 'CreateStay', docString: { stayId: 'stay_1', title: 'Cozy cabin' } },
        { keyword: 'Then', text: 'StayCreated', docString: { stayId: 'stay_1', title: 'Cozy cabin' } },
      ]);
    }
  });
});

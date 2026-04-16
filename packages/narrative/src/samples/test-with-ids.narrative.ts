import { command, query, react } from '../fluent-builder';
import { example, rule, scene, specs, thenError } from '../narrative';
import { defineCommand, defineEvent, defineState } from '../types';

const TestItemCreated = defineEvent<{
  id: string;
  name: string;
  createdAt: Date;
}>('TestItemCreated');

const CreateTestItem = defineCommand<{
  itemId: string;
  name: string;
}>('CreateTestItem');

const TestItemState = defineState<{
  id: string;
  name: string;
}>('TestItemState');

const SendNotification = defineEvent<{
  message: string;
  recipientId: string;
}>('SendNotification');

scene('Test Flow with IDs', 'FLOW-001', () => {
  command('Create test item', 'SLICE-001')
    .client(() => {})
    .server(() => {
      specs('Test item creation specs', () => {
        rule('Valid test items should be created successfully', 'RULE-001', () => {
          example('User creates a new test item with valid data')
            .when(CreateTestItem, 'the user submits a new test item', {
              itemId: 'test_123',
              name: 'Test Item',
            })
            .then(TestItemCreated, 'the test item is recorded', {
              id: 'test_123',
              name: 'Test Item',
              createdAt: new Date('2024-01-15T10:00:00Z'),
            });
        });

        rule('Invalid test items should be rejected', 'RULE-002', () => {
          example('User tries to create item with empty name').when(CreateTestItem, 'the user submits a test item with an empty name', {
            itemId: 'test_456',
            name: '',
          });
          thenError('ValidationError', 'Item name cannot be empty');
        });
      });
    });

  query('Get test items', 'SLICE-002')
    .client(() => {})
    .server(() => {
      specs('Test item retrieval specs', () => {
        rule('Items should be retrievable after creation', 'RULE-003', () => {
          example('Item becomes available after creation event')
            .when(TestItemCreated, 'a test item has been created', {
              id: 'test_123',
              name: 'Test Item',
              createdAt: new Date('2024-01-15T10:00:00Z'),
            })
            .then(TestItemState, 'the test item is retrievable', {
              id: 'test_123',
              name: 'Test Item',
            });
        });
      });
    });

  react('React to test event', 'SLICE-003').server(() => {
    specs('Test event reaction specs', () => {
      rule('System should react to test item creation', 'RULE-004', () => {
        example('Notification sent when test item is created')
          .when(TestItemCreated, 'a test item is created', {
            id: 'test_789',
            name: 'Another Test Item',
            createdAt: new Date('2024-01-16T10:00:00Z'),
          })
          .then(SendNotification, 'a notification is sent to the admin', {
            message: 'New test item created: Another Test Item',
            recipientId: 'admin',
          });
      });
    });
  });
});

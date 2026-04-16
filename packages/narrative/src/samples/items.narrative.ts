import gql from 'graphql-tag';
import { source } from '../data-narrative-builders';
import { command, query } from '../fluent-builder';
import { data, describe, example, it, rule, scene, specs } from '../narrative';
import { defineCommand, defineEvent, defineState } from '../types';

const ItemCreated = defineEvent<{
  id: string;
  description: string;
  addedAt: Date;
}>('ItemCreated');

const CreateItem = defineCommand<{
  itemId: string;
  description: string;
}>('CreateItem');

const AvailableItems = defineState<{
  id: string;
  description: string;
}>('AvailableItems');

scene('items', () => {
  command('Create item')
    .stream('item-${id}')
    .client(() => {
      describe('A form that allows users to add items', () => {
        it('have fields for id and description');
      });
    })
    .server(() => {
      specs('User can add an item', () => {
        rule('Valid items should be created successfully', () => {
          example('User creates a new item with valid data')
            .when(CreateItem, 'the user creates a new item', {
              itemId: 'item_123',
              description: 'A new item',
            })
            .then(ItemCreated, 'the item is recorded', {
              id: 'item_123',
              description: 'A new item',
              addedAt: new Date('2024-01-15T10:00:00Z'),
            });
        });
      });
    });

  query('view items')
    .request(gql`
      query items($itemId: String!) {
        items(itemId: $itemId) {
          id
          description
        }
      }
    `)
    .client(() => {
      describe('view Items Screen', () => {
        it('display all items');
        it('show quantity selectors for each item');
        it('allow removing items');
      });
    })
    .server(() => {
      data([source().state('items').fromProjection('ItemsProjection', 'itemId')]);
      specs('Suggested items are available for viewing', () => {
        rule('Items should be available for viewing after creation', () => {
          example('Item becomes available after creation event')
            .when(ItemCreated, 'an item has been created', {
              id: 'item_123',
              description: 'A new item',
              addedAt: new Date('2024-01-15T10:00:00Z'),
            })
            .then(AvailableItems, 'the item is listed as available', {
              id: 'item_123',
              description: 'A new item',
            });
        });
      });
    });
});

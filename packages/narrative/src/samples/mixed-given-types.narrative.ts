import { query } from '../fluent-builder';
import { example, rule, scene, specs } from '../narrative';
import { defineEvent, defineState } from '../types';

const ConfigState = defineState<{
  configId: string;
  maxItems: number;
}>('ConfigState');

const ItemAdded = defineEvent<{
  itemId: string;
  addedAt: Date;
}>('ItemAdded');

const SystemInitialized = defineEvent<{
  systemId: string;
  timestamp: Date;
}>('SystemInitialized');

const SystemStatus = defineState<{
  systemId: string;
  itemCount: number;
  status: 'ready' | 'full';
}>('SystemStatus');

scene('Mixed Given Types', 'FLOW-MGT', () => {
  query('system status check', 'SLICE-MGT-001')
    .client(() => {})
    .server(() => {
      specs('System status specs', () => {
        rule('system reaches full capacity when configured limit is reached', 'RULE-MGT-001', () => {
          example('system with 2 items reaches max of 2')
            .given(ConfigState, 'config sets max items to 2', {
              configId: 'config-001',
              maxItems: 2,
            })
            .and(SystemInitialized, 'the system has been initialized', {
              systemId: 'system-001',
              timestamp: new Date('2024-01-01T10:00:00Z'),
            })
            .and(ItemAdded, 'an item is added', {
              itemId: 'item-001',
              addedAt: new Date('2024-01-01T10:01:00Z'),
            })
            .and(ItemAdded, 'another item is added', {
              itemId: 'item-002',
              addedAt: new Date('2024-01-01T10:02:00Z'),
            })
            .then(SystemStatus, 'the system is full', {
              systemId: 'system-001',
              itemCount: 2,
              status: 'full',
            });
        });
      });
    });
});

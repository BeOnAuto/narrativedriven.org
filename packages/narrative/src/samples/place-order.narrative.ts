import { command } from '../fluent-builder';
import { describe, example, it, rule, scene, specs } from '../narrative';
import { defineCommand, defineEvent } from '../types';

const PlaceOrder = defineCommand<{
  productId: string;
  quantity: number;
}>('PlaceOrder');

const OrderPlaced = defineEvent<{
  orderId: string;
  productId: string;
  quantity: number;
  placedAt: Date;
}>('OrderPlaced');

scene('Place order', () => {
  command('Submit order')
    .stream('order-${orderId}')
    .client(() => {
      describe('Order submission form', () => {
        it('allow product selection');
        it('allow quantity input');
      });
    })
    .server(() => {
      specs('User submits a new order', () => {
        rule('Valid orders should be processed successfully', () => {
          example('User places order for available product')
            .when(PlaceOrder, 'the user places an order', {
              productId: 'product_789',
              quantity: 3,
            })
            .then(OrderPlaced, 'the order is placed', {
              orderId: 'order_001',
              productId: 'product_789',
              quantity: 3,
              placedAt: new Date('2024-01-20T10:00:00Z'),
            });
        });
      });
    });
});

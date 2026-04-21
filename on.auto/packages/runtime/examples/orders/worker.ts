import { createServer } from '@onauto/runtime';
import { ordersApp } from './model';

const { app } = createServer(ordersApp);

export default app;

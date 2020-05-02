import { Router } from 'express';
// Rota de transações
import transactionsRouter from './transactions.routes';
// Instanciando rotas
const routes = Router();
// Instanciando rotas de transações
routes.use('/transactions', transactionsRouter);

export default routes;

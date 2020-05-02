import { getCustomRepository } from 'typeorm';
import { Router } from 'express';

import multer from 'multer';
import uploadConfig from '../config/upload';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  // Lista de transações
  const allTransactions = await transactionsRepository.find();
  // Balance das transações
  const transactionBalance = await transactionsRepository.getBalance();

  // Criando estrutura transação
  const transactions = {
    transactions: allTransactions,
    balance: transactionBalance,
  };

  // Respondendo ao usuário
  return response.json(transactions);
});

transactionsRouter.post('/', async (request, response) => {
  // Recebendo dados do usuário
  const { title, type, value, category } = request.body;

  // Instanciando serviço de criação de transação
  const createTransaction = new CreateTransactionService();

  // Criando transação
  const transaction = await createTransaction.execute({
    title,
    type,
    value,
    category,
  });
  // Respondendo ao usuário
  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  // Recebendo dados do usuário
  const { id } = request.params;
  // Criando serviço de deletar
  const deleteTransaction = new DeleteTransactionService();
  // Executando serviço para deletar transação
  await deleteTransaction.execute(id);
  // Retornando resposta
  return response.status(204).json();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    // Criando serviço de importação
    const importTransaction = new ImportTransactionsService();
    // Executando serviço
    const transactions = await importTransaction.execute(request.file.filename);

    // Respondendo ao usuário
    return response.json(transactions);
  },
);

export default transactionsRouter;

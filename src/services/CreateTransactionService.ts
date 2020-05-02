import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import CreateCategoryService from './CreateCategoryService';

interface Request {
  category: string;
  title: string;
  type: 'income' | 'outcome';
  value: number;
}

class CreateTransactionService {
  // Executa serviço de criação
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    // Instancia temporária do repositório
    const transactionRepository = getCustomRepository(TransactionRepository);
    // Criando serviço de criação de categoria
    const createCategory = new CreateCategoryService();
    // Id da categoria criada
    const categoryId = await createCategory.execute(category);

    // Lista de transações
    const allTransactions = await transactionRepository.getBalance();

    // Se outcome for maior que dinheiro em caixa
    if (type === 'outcome' && allTransactions.total < value) {
      throw new AppError(
        'O valor do outcome não pode ultrapassar o valor total de income',
        400,
      );
    }

    // Criando transação no repositório
    const transaction = transactionRepository.create({
      title,
      type,
      value,
      category_id: categoryId,
    });

    // Salvando informações no banco de dados
    await transactionRepository.save(transaction);
    // Retornando resultado criado
    return transaction;
  }
}

export default CreateTransactionService;

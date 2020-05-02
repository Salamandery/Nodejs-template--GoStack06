import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    let income = 0;
    let outcome = 0;

    // Lista de transações
    const transactions = await this.find();

    // Criando balanço
    for (let i = 0; i < transactions.length; i += 1) {
      if (transactions[i].type === 'income') {
        income += parseInt(transactions[i].value.toString(), 10);
      } else {
        outcome += parseInt(transactions[i].value.toString(), 10);
      }
    }

    // Estrutura do balance
    const balance = {
      income,
      outcome,
      total: income - outcome,
    };

    // Retornando resposta do balance
    return balance;
  }
}

export default TransactionsRepository;

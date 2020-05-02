import { getCustomRepository, getRepository, In } from 'typeorm';
import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionRepository from '../repositories/TransactionsRepository';

interface CSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(file: string): Promise<Transaction[]> {
    // Repositorios
    const transactionsRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);
    // Arquivo de importação
    const csvFilePath = path.resolve(__dirname, '..', '..', `tmp/${file}`);
    // Leitura de arquivo csv
    const readCSVStream = fs.createReadStream(csvFilePath);
    // Configuração de leitura
    const parseStream = csvParse({
      from_line: 2,
    });
    // Pegando instancia do arquivo
    const parseCSV = readCSVStream.pipe(parseStream);
    // Array de transações criadas
    const transactions: CSVTransaction[] = [];
    const categories: string[] = [];
    // Pegando informações do arquivo
    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      // Incluindo transação no array
      transactions.push({ title, type, value, category });
      // Incluindo category no array
      categories.push(category);
    });

    // Promise de finalização
    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });
    // Buscando categorias existentes
    const categoryExists = await categoryRepository.find({
      where: { title: In(categories) },
    });
    // Verificando categogiras existentes
    const categoryExistTitle = categoryExists.map(
      (category: Category) => category.title,
    );
    // Filtrando categorias existentes
    const addCategoryTitle = categories
      .filter(category => !categoryExistTitle.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);
    // Criando categorias no repositório
    const newCategories = categoryRepository.create(
      addCategoryTitle.map(title => ({
        title,
      })),
    );
    // Salvando categorias
    await categoryRepository.save(newCategories);

    // Lista de categorias
    const finalCategories = [...newCategories, ...categoryExists];

    // Criando transações no repositório
    const createTransactions = transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    // Salvando transações no banco de dados
    await transactionsRepository.save(createTransactions);
    // Deleta arquivo temporário
    await fs.promises.unlink(csvFilePath);

    // Enviando resposta de transações
    return createTransactions;
  }
}

export default ImportTransactionsService;

import path from 'path';
import fs from 'fs';
import csv from 'csvtojson';

import uploadConfig from '../config/upload';

import Transaction from '../models/Transaction';

import CreateTransactionService from './CreateTransactionService';

interface Request {
  fileName: string;
}

class ImportTransactionsService {
  async execute({ fileName }: Request): Promise<Transaction[]> {
    // TODO
    const filePath = path.join(uploadConfig.directory, fileName);

    const transactionsJson = await csv().fromFile(filePath);

    await fs.promises.unlink(filePath);

    const createTransaction = new CreateTransactionService();

    const transactions: Transaction[] | void = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const transaction of transactionsJson) {
      // eslint-disable-next-line no-await-in-loop
      const item = await createTransaction.execute(transaction);
      transactions.push(item);
    }

    return transactions;
  }
}

export default ImportTransactionsService;

import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionRequest } from './transaction.dto';
import { Transaction, TransactionStatus } from './transaction.entity';

@Injectable()
export class TransactionService {
    constructor(
        @Inject('ANTI_FRAUD_SERVICE') private readonly antiFraudClient: ClientKafka,
        @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>,
    ) {}

    async handlerGetTransactions() {
        const transactions = await this.transactionRepository.find();

        return JSON.stringify(transactions.map(transaction =>({
            transactionExternalId: transaction.id,
            transactionType: {
                name: transaction.tranferTypeId
            },
            transactionStatus: {
                name: transaction.status
            },
            value: transaction.value,
            createdAt: transaction.createdAt
        })));
    }

    async handlerTransactionCreated(data: TransactionRequest) {
        const newTransaction = this.transactionRepository.create(data);
        await this.transactionRepository.save(newTransaction);

        this.antiFraudClient.emit('anti_fraud_validate', JSON.stringify(newTransaction));

        return JSON.stringify({
            transactionExternalId: newTransaction.id,
            transactionType: {
                name: newTransaction.tranferTypeId
            },
            transactionStatus: {
                name: newTransaction.status
            },
            value: newTransaction.value,
            createdAt: newTransaction.createdAt
        });
    }

    handlerAntiFraudValidated(response: any) {
        const status = response.approved ? TransactionStatus.APPROVED : TransactionStatus.REJECTED;
        this.transactionRepository.update(response.id, {status});
    }
}

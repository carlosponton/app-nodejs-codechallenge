import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsResolver } from './transactions.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TRANSACTION_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction',
            brokers: ['localhost:9092']
          },
          consumer: {
            groupId: 'transaction-consumer'
          }
        }
      }
    ]),
  ],
  providers: [TransactionsService, TransactionsResolver]
})
export class TransactionsModule { }
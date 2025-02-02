import { Module } from '@nestjs/common';
import { AntiFraudModule } from './anti-fraud/anti-fraud.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [AntiFraudModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfirmationsService } from './confirmations.service';
import { ConfirmationsController } from './confirmations.controller';
import { Confirmation } from './entities/confirmation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Confirmation])],
  controllers: [ConfirmationsController],
  providers: [ConfirmationsService],
  exports: [ConfirmationsService],
})
export class ConfirmationsModule {}

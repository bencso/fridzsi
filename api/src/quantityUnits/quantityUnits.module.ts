import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuantityUnits } from './entities/quantityUnits.entity';
import { QuantityUnitsService } from './quantityUnits.service';
import { QuantityUnitsController } from './quantityUnits.controller';

@Module({
  imports: [TypeOrmModule.forFeature([QuantityUnits])],
  controllers: [QuantityUnitsController],
  providers: [QuantityUnitsService],
  exports: [QuantityUnitsService],
})
export class QuantityUnitsModule {}

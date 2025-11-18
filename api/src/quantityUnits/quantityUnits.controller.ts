import { Controller, Get } from '@nestjs/common';
import {
  quantityTypesParams,
  QuantityUnits,
} from './entities/quantityUnits.entity';
import { DataSource } from 'typeorm';

@Controller()
export class QuantityUnitsController {
  constructor(private readonly dataSource: DataSource) {}

  @Get('/quantityTypes')
  async getUnits(): Promise<quantityTypesParams[]> {
    return (await this.dataSource.getRepository(QuantityUnits).find()) || [];
  }
}

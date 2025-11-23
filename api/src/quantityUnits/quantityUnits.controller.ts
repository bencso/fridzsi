import { Controller, Get } from '@nestjs/common';
import { QuantityUnitsService } from './quantityUnits.service';

@Controller()
export class QuantityUnitsController {
  constructor(private readonly quantityUnitsService: QuantityUnitsService) {}

  @Get('/quantityTypes')
  async getUnits() {
    return await this.quantityUnitsService.findAll();
  }

  @Get('/quantityTypesTest')
  async getTest(): Promise<any> {
    return await this.quantityUnitsService.convertToHighest();
  }
}

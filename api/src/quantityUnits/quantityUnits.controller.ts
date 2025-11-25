import { Controller, Get, Param, Req } from '@nestjs/common';
import { QuantityUnitsService } from './quantityUnits.service';
import { Request } from 'express';

@Controller()
export class QuantityUnitsController {
  constructor(private readonly quantityUnitsService: QuantityUnitsService) {}

  @Get('/quantityTypes')
  async getUnits() {
    return await this.quantityUnitsService.findAll();
  }

  @Get('/quantityTypesTestById/:id')
  async getTestById(@Param('id') id: number): Promise<any> {
    return await this.quantityUnitsService.getHighest({
      id: id,
    });
  }

  @Get('/quantityTypesTest')
  async getTest(): Promise<any> {
    return await this.quantityUnitsService.getHighest({});
  }

  @Get('/quantityTypesTestUser/:product')
  async getTestUser(
    @Req() request: Request,
    @Param('product') productName?: string,
  ): Promise<any> {
    return await this.quantityUnitsService.convertToHighest({
      request,
      productName,
    });
  }
}

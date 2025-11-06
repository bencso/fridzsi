import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { ShoppingListService } from './shoppinglist.service';
import { Request } from 'express';

@Controller('shoppinglist')
export class ShoppingListController {
  constructor(private readonly shoppinglistService: ShoppingListService) {}

  @Get('/items/:date')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getItemByDate(@Param('date') date: string, request: Request) {
    return this.shoppinglistService.getItemByDate({
      date: date,
      request: request,
    });
  }

  @Get('/items/dates')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getItemDates(request: Request) {
    return this.shoppinglistService.getItemDates({
      request: request,
    });
  }
}

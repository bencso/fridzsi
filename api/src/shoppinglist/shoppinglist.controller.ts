import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { ShoppingListService } from './shoppinglist.service';
import { Request } from 'express';
import { CreateShoppingListItemDto } from './dto/create-shoppinglist-item.dto';

@Controller('shoppinglist')
export class ShoppingListController {
  constructor(private readonly shoppinglistService: ShoppingListService) {}

  @Get('/items/date/:date')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getItemByDate(@Param('date') date: string, @Req() request: Request) {
    return this.shoppinglistService.getItemByDate({
      date: date,
      request: request,
    });
  }

  @Get('/items/dates')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getItemDates(@Req() request: Request) {
    return this.shoppinglistService.getItemDates({
      request: request,
    });
  }

  @Post('/items/create')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async createItem(
    @Body() data: CreateShoppingListItemDto,
    @Req() request: Request,
  ) {
    return this.shoppinglistService.createItem({ request, data });
  }

  @Post('/items/remove/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async removeItem(@Param(':id') id: number, @Req() request: Request) {
    return this.shoppinglistService.removeItem({ request, id });
  }
}

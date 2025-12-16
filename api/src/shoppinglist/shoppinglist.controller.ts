import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseArrayPipe,
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

  @Get('/items/code/:code')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getItemByCode(@Param('code') code: string, @Req() request: Request) {
    return this.shoppinglistService.getItemByCode({
      code: code,
      request: request,
    });
  }

  @Get('/item/id/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getItemById(@Param('id') id: string, @Req() request: Request) {
    return this.shoppinglistService.getItemById({
      id: id,
      request: request,
    });
  }

  @Get('/items/now')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getItemNow(@Req() request: Request) {
    return this.shoppinglistService.getItemNow({
      query: '',
      request: request,
    });
  }

  @Get('/items/now/:q')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getItemNowWithQuery(
    @Param('q') query: string,
    @Req() request: Request,
  ) {
    return this.shoppinglistService.getItemNow({
      query,
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
  @Post('/items/edit/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async editItem(
    @Param('id')
    id: number,
    @Body() data: { quantity: number; quantityUnitId: number },
    @Req() request: Request,
  ) {
    return this.shoppinglistService.editItem({
      request,
      id,
      quantity: data.quantity,
      quantityUnitId: data.quantityUnitId,
    });
  }

  @Post('/items/remove/:ids')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async removeItem(
    @Param('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
    ids: number[],
    @Req() request: Request,
  ) {
    return this.shoppinglistService.removeItem({
      request,
      ids,
    });
  }
}

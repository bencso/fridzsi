import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { DataSource, LessThanOrEqual } from 'typeorm';
import { SessionService } from 'src/sessions/sessions.service';
import { ProductService } from 'src/product/product.service';
import { ShoppingList } from './entities/shoppinglist.entity';
import { Request } from 'express';
import { ReturnDto } from 'src/dto/return.dto';

@Injectable()
export class ShoppingListService {
  constructor(
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
    private readonly sessionsService: SessionService,
    private readonly productService: ProductService,
  ) {}

  async getItemByDate({
    date,
    request,
  }: {
    date: string;
    request: Request;
  }): Promise<ShoppingList[] | ReturnDto> {
    try {
      const convertedDate = new Date(date);

      const requestUser =
        await this.sessionsService.validateAccessToken(request);
      const user = await this.usersService.findUser(requestUser.email);

      const shoppingList = await this.dataSource
        .getRepository(ShoppingList)
        .createQueryBuilder()
        .select()
        .where({
          day: LessThanOrEqual(convertedDate),
          user: user,
        })
        .getMany();

      if (shoppingList.length > 0) {
        return shoppingList;
      } else {
        return {
          message: ['Nincs felvittt item-e a felhasználónak!'],
          statusCode: 401,
        };
      }
    } catch {
      return {
        message: ['Hiba történt a lekérdezés során!'],
        statusCode: 401,
      };
    }
  }

  async getItemDates({
    request,
  }: {
    request: Request;
  }): Promise<ShoppingList[] | ReturnDto> {
    try {
      const requestUser =
        await this.sessionsService.validateAccessToken(request);
      const user = await this.usersService.findUser(requestUser.email);

      const dates = await this.dataSource
        .getRepository(ShoppingList)
        .createQueryBuilder()
        .select(['date'])
        .where({
          user: user,
        })
        .groupBy('date')
        .execute();

      if (dates.length > 0) {
        return dates;
      } else {
        return {
          message: ['Nincs felvittt item-e a felhasználónak!'],
          statusCode: 401,
        };
      }
    } catch {
      return {
        message: ['Hiba történt a lekérdezés során!'],
        statusCode: 401,
      };
    }
  }
}

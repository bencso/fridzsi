import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { DataSource, MoreThanOrEqual } from 'typeorm';
import { SessionService } from 'src/sessions/sessions.service';
import { ProductService } from 'src/product/product.service';
import { ShoppingList } from './entities/shoppinglist.entity';
import { Request } from 'express';
import { ReturnDto } from 'src/dto/return.dto';
import { CreateShoppingListItemDto } from './dto/create-shoppinglist-item.dto';

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
          day: MoreThanOrEqual(convertedDate),
          user: user,
        })
        .getMany();

      if (shoppingList.length > 0) {
        return shoppingList;
      } else {
        return {
          message: ['Nincs felvitt item-e a felhasználónak!'],
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
  }): Promise<Date[] | ReturnDto> {
    try {
      const requestUser =
        await this.sessionsService.validateAccessToken(request);
      const user = await this.usersService.findUser(requestUser.email);

      const dates = await this.dataSource
        .getRepository(ShoppingList)
        .createQueryBuilder()
        .select(['day'])
        .where({
          user: user,
          day: MoreThanOrEqual(new Date()),
        })
        .groupBy('day')
        .getRawMany();

      if (dates.length > 0) {
        return [
          ...dates.map((date: any) => {
            return new Date(date.day);
          }),
        ];
      } else {
        return {
          message: ['Nincs felvitt item-e a felhasználónak!'],
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

  async createItem({
    request,
    data,
  }: {
    request: Request;
    data: CreateShoppingListItemDto;
  }): Promise<ShoppingList | ReturnDto> {
    try {
      const convertedDate = new Date(data.day);

      if (!data.code && !data.product_name)
        throw new Error('Kérem adja meg legalább a nevét vagy a kódját');

      if (data.amount <= 0)
        throw new Error('A mennyiségnek legalább 1 kell lennie');

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (convertedDate < today) throw new Error('A dátum nem lehet a múltba!');

      const requestUser =
        await this.sessionsService.validateAccessToken(request);
      const user = await this.usersService.findUser(requestUser.email);

      let product;

      if (data.code) {
        product = await this.productService.getItemById(data.code);
      } else {
        const productByName = await this.productService.getItemByKeyword(
          data.product_name,
        );

        if (productByName.length > 0) product = productByName[0];
      }

      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(ShoppingList)
        .values({
          user: user,
          product: product ? product : null,
          customProductName: product ? null : data.product_name,
          amount: data.amount,
          day: convertedDate,
        })
        .execute();

      return {
        message: [
          `Sikeresen létrehozva a/az ${product ? product.name : data.product_name}!`,
        ],
        statusCode: 200,
      };
    } catch (error: any) {
      return {
        message: ['Hiba történt a létrehozás során! ' + error],
        statusCode: 401,
      };
    }
  }
}

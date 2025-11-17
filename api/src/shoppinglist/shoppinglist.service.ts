import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { DataSource, Equal } from 'typeorm';
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
      console.log(date);
      const convertedDate = new Date(date);

      const requestUser =
        await this.sessionsService.validateAccessToken(request);
      const user = await this.usersService.findUser(requestUser.email);

      const shoppingList = await this.dataSource
        .getRepository(ShoppingList)
        .createQueryBuilder('shoppinglist')
        .leftJoinAndSelect('shoppinglist.product', 'product')
        .select([
          "COALESCE(shoppinglist.customProductName, 'Unkown/Ismeretlen') as customProductName",
          'product.product_name',
          'product.product_quantity_unit',
          'shoppinglist.id',
          'shoppinglist.quantity',
          'shoppinglist.day',
        ])
        .where({
          day: Equal(convertedDate),
          user: user,
        })
        .getRawMany();

      if (shoppingList.length > 0) {
        console.log(shoppingList);
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

  async getItemNow({
    query,
    request,
  }: {
    query: string;
    request: Request;
  }): Promise<ShoppingList[] | ReturnDto> {
    try {
      const requestUser =
        await this.sessionsService.validateAccessToken(request);
      const user = await this.usersService.findUser(requestUser.email);

      const shoppingList = await this.dataSource
        .getRepository(ShoppingList)
        .createQueryBuilder('shoppinglist')
        .leftJoinAndSelect('shoppinglist.product', 'product')
        .select([
          "COALESCE(shoppinglist.customProductName, 'Unkown/Ismeretlen') as customProductName",
          'product.product_name',
          'product.product_quantity_unit',
          'shoppinglist.id',
          'shoppinglist.quantity',
          'shoppinglist.day',
        ])
        .where({
          day: Equal(new Date()),
          user: user,
        });

      if (query.length > 0) {
        shoppingList.andWhere(
          'LOWER(product.product_name) LIKE :query OR LOWER(shoppinglist.customProductName) LIKE :query',
          {
            query: `%${query.toLowerCase()}%`,
          },
        );
      }

      const result = await shoppingList.getRawMany();
      if (result.length > 0) {
        return result;
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
        .createQueryBuilder('shoppinglist')
        .select('shoppinglist.day', 'day')
        .where('shoppinglist.user = :userId', { userId: user.id })
        .andWhere('shoppinglist.day >= :today', { today: new Date() })
        .groupBy('shoppinglist.day')
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
      console.log('ASD:' + convertedDate);

      if (!data.code && !data.product_name)
        throw new Error('Kérem adja meg legalább a nevét vagy a kódját');

      if (data.quantity <= 0)
        throw new Error('A mennyiségnek legalább 1 kell lennie');

      const today = new Date();

      const convertedDateOnly = new Date(
        convertedDate.getFullYear(),
        convertedDate.getMonth(),
        convertedDate.getDate(),
      );
      const todayOnly = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      );

      if (convertedDateOnly < todayOnly)
        throw new Error('A dátum nem lehet a múltba!');

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
          quantity: data.quantity,
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

  async removeItem({
    id,
    request,
    body,
  }: {
    id: number;
    request: Request;
    body: { quantity: number };
  }) {
    try {
      const requestUser =
        await this.sessionsService.validateAccessToken(request);
      const user = await this.usersService.findUser(requestUser.email);

      const haveThisItem = await this.dataSource
        .getRepository(ShoppingList)
        .createQueryBuilder('shoppinglist')
        .select(['shoppinglist.id', 'shoppinglist.quantity', 'shoppinglist.user'])
        .where('shoppinglist.id = :id', { id: id })
        .andWhere('shoppinglist.user = :userId', { userId: user.id })
        .getOne();

      if (haveThisItem) {
        if (haveThisItem.quantity <= body.quantity) {
          await this.dataSource
            .createQueryBuilder()
            .delete()
            .from(ShoppingList)
            .where('id = :id', { id: id })
            .andWhere('user = :userId', { userId: user.id })
            .execute();
        } else {
          await this.dataSource
            .createQueryBuilder()
            .update(ShoppingList)
            .set({ quantity: haveThisItem.quantity - body.quantity })
            .where('id = :id', { id: id })
            .andWhere('user = :userId', { userId: user.id })
            .execute();
        }
        return {
          message: ['Sikeres törlés'],
          statusCode: 200,
        };
      } else {
        return {
          message: ['Nem található ilyen item'],
          statusCode: 401,
        };
      }
    } catch (error: any) {
      return {
        message: ['Hiba történt a létrehozás során! ' + error],
        statusCode: 401,
      };
    }
  }
}

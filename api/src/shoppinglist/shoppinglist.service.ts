import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { DataSource, Equal } from 'typeorm';
import { SessionService } from 'src/sessions/sessions.service';
import { ProductService } from 'src/product/product.service';
import { ShoppingList } from './entities/shoppinglist.entity';
import { Request } from 'express';
import { ReturnDataDto, ReturnDto } from 'src/dto/return.dto';
import { CreateShoppingListItemDto } from './dto/create-shoppinglist-item.dto';
import { QuantityUnits } from 'src/quantityUnits/entities/quantityUnits.entity';
import { QuantityUnitsService } from 'src/quantityUnits/quantityUnits.service';

@Injectable()
export class ShoppingListService {
  constructor(
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
    private readonly sessionsService: SessionService,
    private readonly productService: ProductService,
    private readonly quantityService: QuantityUnitsService,
  ) {}

  async getItemByDate({
    date,
    request,
  }: {
    date: string;
    request: Request;
  }): Promise<ReturnDataDto | ReturnDto> {
    try {
      const convertedDate = new Date(date);

      const requestUser =
        await this.sessionsService.validateAccessToken(request);
      const user = await this.usersService.findUser(requestUser.email);

      if (user) {
        const shoppingList = await this.dataSource
          .getRepository(ShoppingList)
          .createQueryBuilder('shoppinglist')
          .leftJoinAndSelect('shoppinglist.product', 'product')
          .leftJoinAndSelect('shoppinglist.quantity_unit', 'quantity_unit')
          .select([
            "COALESCE(shoppinglist.customProductName, 'Unknown/Ismeretlen') as customProductName",
            'product.product_name',
            'product.code as code',
            'shoppinglist.id',
            'shoppinglist.quantity as quantity',
            'shoppinglist.day',
            'quantity_unit.id as quantityunitid',
            'quantity_unit.label as quantityUnit',
            'quantity_unit.en as quantityUnitEn',
            'quantity_unit.hu as quantityUnitHu',
          ])
          .where('shoppinglist.day = :day', { day: convertedDate })
          .andWhere('shoppinglist.user = :userId', { userId: user.id })
          .getRawMany();

        const returnConvertationData =
          await this.quantityService.convertToHighest({
            request,
            products: shoppingList,
          });
        const convertedQuantityArray = returnConvertationData.data[0];
        const returnProducts = [
          convertedQuantityArray.reduce((acc: any, curr: any) => {
            acc[curr.code] = acc[curr.code] || [];
            acc[curr.code].push(curr);
            return acc;
          }, {}),
        ];

        return shoppingList.length > 0
          ? {
              message: ['Sikeres lekérdezés'],
              statusCode: 200,
              data: returnProducts,
            }
          : {
              message: ['Nincs semmi a raktárjában a felhasználónak!'],
              statusCode: 404,
              data: shoppingList,
            };
      } else return { message: ['Sikertelen lekérdezés'], statusCode: 404 };
    } catch {
      return {
        message: ['Hiba történt a lekérdezés során!'],
        statusCode: 401,
      };
    }
  }

  async getItemById({
    code,
    request,
  }: {
    code: string;
    request: Request;
  }): Promise<ReturnDataDto | ReturnDto> {
    try {
      const requestUser =
        await this.sessionsService.validateAccessToken(request);
      const user = await this.usersService.findUser(requestUser.email);

      if (user) {
        const shoppingList = await this.dataSource
          .getRepository(ShoppingList)
          .createQueryBuilder('shoppinglist')
          .leftJoinAndSelect('shoppinglist.product', 'product')
          .leftJoinAndSelect('shoppinglist.quantity_unit', 'quantity_unit')
          .select([
            "COALESCE(shoppinglist.customProductName, 'Unknown/Ismeretlen') as customProductName",
            'product.product_name as name',
            'product.code as code',
            'shoppinglist.id as id',
            'shoppinglist.quantity as quantity',
            'shoppinglist.day as day',
            'quantity_unit.id as quantityunitid',
            'quantity_unit.label as quantityUnit',
            'quantity_unit.en as quantityUnitEn',
            'quantity_unit.hu as quantityUnitHu',
          ])
          .where('product.code = :code', { code: code })
          .andWhere('shoppinglist.user = :userId', { userId: user.id })
          .orderBy('shoppinglist.day, quantity_unit.id, shoppinglist.quantity')
          .getRawMany();

        console.log(shoppingList);

        return shoppingList.length > 0
          ? {
              message: ['Sikeres lekérdezés'],
              statusCode: 200,
              data: shoppingList,
            }
          : {
              message: ['Nincs semmi a raktárjában a felhasználónak!'],
              statusCode: 404,
              data: shoppingList,
            };
      } else return { message: ['Sikertelen lekérdezés'], statusCode: 404 };
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
        .leftJoinAndSelect('shoppinglist.quantity_unit', 'quantity_unit')
        .select([
          "COALESCE(shoppinglist.customProductName, 'Unknown/Ismeretlen') as customProductName",
          'product.product_name',
          'product.product_quantity_unit',
          'shoppinglist.id',
          'shoppinglist.quantity',
          'shoppinglist.quantity_unit',
          'shoppinglist.day',
          'quantity_unit.label as quantityUnit',
          'quantity_unit.en as quantityUnitEn',
          'quantity_unit.hu as quantityUnitHu',
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

      let product = null;

      if (data.code) {
        product = await this.productService.getItemById(data.code);
      } else {
        const productByName = await this.productService.getItemByKeyword(
          data.product_name,
        );

        if (productByName.length > 0) product = productByName[0];
      }

      const quantityUnit = await this.dataSource
        .getRepository(QuantityUnits)
        .createQueryBuilder('quantity_unit')
        .select()
        .whereInIds(data.quantity_unit || 1)
        .getOne();

      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(ShoppingList)
        .values({
          user: user,
          product: product ? product : null,
          customProductName: product ? null : data.product_name,
          quantity: data.quantity,
          quantity_unit: quantityUnit,
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

  async removeItem({ ids, request }: { ids: number[]; request: Request }) {
    try {
      const requestUser =
        await this.sessionsService.validateAccessToken(request);
      const user = await this.usersService.findUser(requestUser.email);
      console.log(ids);

      const haveThisItem = await this.dataSource
        .getRepository(ShoppingList)
        .createQueryBuilder('shoppinglist')
        .select([
          'shoppinglist.id',
          'shoppinglist.quantity',
          'shoppinglist.user',
        ])
        .where('shoppinglist.id IN (:...ids)', { ids })
        .andWhere('shoppinglist.user = :userId', { userId: user.id })
        .getOne();

      if (haveThisItem) {
        await this.dataSource
          .createQueryBuilder()
          .delete()
          .from(ShoppingList)
          .where('id IN (:...ids)', { ids })
          .andWhere('user = :userId', { userId: user.id })
          .execute();
        return {
          message: ['Sikeres törlés'],
          statusCode: 200,
        };
      } else {
        return {
          message: ['Hiba történt a létrehozás során!'],
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

  async editItem({
    id,
    quantity,
    quantityUnitId,
    request,
  }: {
    id: number;
    quantity: number;
    quantityUnitId: number;
    request: Request;
  }) {
    try {
      const requestUser =
        await this.sessionsService.validateAccessToken(request);
      const user = await this.usersService.findUser(requestUser.email);

      const haveThisItem = await this.dataSource
        .getRepository(ShoppingList)
        .createQueryBuilder('shoppinglist')
        .select([
          'shoppinglist.id',
          'shoppinglist.quantity',
          'shoppinglist.user',
        ])
        .where('shoppinglist.id = id', { id })
        .andWhere('shoppinglist.user = :userId', { userId: user.id })
        .getOne();

      if (haveThisItem) {
        //TODO: A váltást megcsinálni
        console.log(quantity, quantityUnitId);
        return {
          message: ['Sikeres törlés'],
          statusCode: 200,
        };
      } else {
        return {
          message: ['Hiba történt a létrehozás során!'],
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

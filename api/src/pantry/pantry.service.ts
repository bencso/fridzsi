import { Injectable } from '@nestjs/common';
import { CreatePantryItemDto } from './dto/create-pantry-item.dto';
import { UsersService } from 'src/users/users.service';
import { DataSource, In } from 'typeorm';
import { SessionService } from 'src/sessions/sessions.service';
import { Request } from 'express';
import { ProductService } from 'src/product/product.service';
import { Pantry } from './entities/pantry.entity';
import { QuantityUnits } from 'src/quantityUnits/entities/quantityUnits.entity';
import { QuantityUnitsService } from 'src/quantityUnits/quantityUnits.service';

@Injectable()
export class PantryService {
  constructor(
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
    private readonly sessionsService: SessionService,
    private readonly productService: ProductService,
    private readonly quantityUnitsService: QuantityUnitsService,
  ) {}
  async create(request: Request, createPantryItemDto: CreatePantryItemDto) {
    const requestUser = await this.sessionsService.validateAccessToken(request);
    const user = await this.usersService.findUser(requestUser.email);

    let productId = null;

    try {
      if (user) {
        productId = await this.productService.getItemId(
          createPantryItemDto.code,
        );

        if (!productId) {
          const createdProduct = await this.productService.create(request, {
            product_name: createPantryItemDto.product_name,
            code: createPantryItemDto.code,
          });
          productId = createdProduct?.id ?? createdProduct;
        }

        const quantityUnit = await this.dataSource
          .getRepository(QuantityUnits)
          .createQueryBuilder('quantity_unit')
          .select()
          .whereInIds(createPantryItemDto.quanity_units || 1)
          .getOne();

        await this.dataSource
          .getRepository(Pantry)
          .createQueryBuilder()
          .insert()
          .values({
            user: { id: user.id },
            product: { id: productId },
            quantity: createPantryItemDto.quantity,
            quantity_unit: quantityUnit,
            expiredAt: createPantryItemDto.expiredAt || new Date(),
          })
          .execute();

        return { message: ['Sikeres létrehozás'], statusCode: 200 };
      }
    } catch {
      return { message: ['Sikertelen létrehozás'], statusCode: 403 };
    }
  }

  async getUserPantry(request: Request) {
    const requestUser = await this.sessionsService.validateAccessToken(request);
    const user = await this.usersService.findUser(requestUser.email);

    if (user) {
      const products = await this.dataSource
        .getRepository(Pantry)
        .createQueryBuilder('pantry')
        .innerJoin('pantry.product', 'product')
        .innerJoin('pantry.quantity_unit', 'quantity_unit')
        .select([
          'pantry.id AS index',
          'product.product_name AS name',
          'pantry.quantity AS quantity',
          'pantry.quantity_unit AS quantityUnit',
          'pantry.expiredAt AS expiredAt',
          'product.code AS code',
          'product.id AS productId',
          'quantity_unit.label as quantityUnit',
          'quantity_unit.id as quantityUnitId',
          'quantity_unit.en as quantityUnitEn',
          'quantity_unit.hu as quantityUnitHu',
        ])
        .where('pantry.user = :userId', { userId: user.id })
        .andWhere('pantry.expiredAt >= :now', { now: new Date() })
        .getRawMany();

      const returnData = await this.quantityUnitsService.convertToHighest({
        request,
        products: products,
      });
      const returnProducts = returnData.data;

      return products.length > 0
        ? {
            message: ['Sikeres lekérdezés'],
            statusCode: 200,
            products: returnProducts,
          }
        : {
            message: ['Nincs semmi a raktárjában a felhasználónak!'],
            statusCode: 404,
            products: products,
          };
    } else return { message: ['Sikertelen lekérdezés'], statusCode: 404 };
  }

  async getUserPantryItemByCode(request: Request, code: string) {
    const requestUser = await this.sessionsService.validateAccessToken(request);
    const user = await this.usersService.findUser(requestUser.email);

    if (user) {
      const products = await this.dataSource
        .getRepository(Pantry)
        .createQueryBuilder('pantry')
        .innerJoin('pantry.product', 'product')
        .innerJoin('pantry.quantity_unit', 'quantity_unit')
        .select([
          'pantry.id AS index',
          'product.product_name AS name',
          'pantry.quantity AS quantity',
          'pantry.quantity_unit AS quantityUnit',
          'pantry.expiredAt AS expiredAt',
          'product.code AS code',
          'quantity_unit.label as quantityUnit',
          'quantity_unit.en as quantityUnitEn',
          'quantity_unit.hu as quantityUnitHu',
        ])
        .where('pantry.user = :userId', { userId: user.id })
        .andWhere('product.code = :code', { code })
        .andWhere('pantry.expiredAt >= :now', { now: new Date() })
        .getRawMany();

      return products.length > 0
        ? {
            message: ['Sikeres lekérdezés'],
            statusCode: 200,
            products,
          }
        : {
            message: [
              'Nincs semmi a raktárjában a felhasználónak az alábbi kóddal!',
            ],
            statusCode: 404,
            products: [],
          };
    } else return { message: ['Sikertelen lekérdezés'], statusCode: 404 };
  }

  async remove(request: Request, id: number[]) {
    const requestUser = await this.sessionsService.validateAccessToken(request);
    const user = await this.usersService.findUser(requestUser.email);

    if (user) {
      const product = await this.dataSource
        .getRepository(Pantry)
        .createQueryBuilder()
        .where({
          id: In(id),
          user: user,
        })
        .getCount();

      if (product > 0) {
        try {
          this.dataSource.getRepository(Pantry).delete({
            id: In(id),
            user: user,
          });

          return { message: ['Sikeres törlés'], statusCode: 200 };
        } catch {
          return { message: ['Sikertelen törlés'], statusCode: 404 };
        }
      } else return { message: ['Sikertelen törlés'], statusCode: 404 };
    }
  }

  async edit(
    request: Request,
    id: number,
    quantity: number,
    quantityType: number,
  ) {
    if (quantity <= 0) {
      return {
        message: ['A mennyiség nem lehet kisebb vagy egyenlő nullával'],
        statusCode: 400,
      };
    }
    const requestUser = await this.sessionsService.validateAccessToken(request);
    const user = await this.usersService.findUser(requestUser.email);

    if (user) {
      const product = await this.dataSource
        .getRepository(Pantry)
        .createQueryBuilder()
        .where({
          id: id,
          user: user,
        })
        .getCount();

      if (product > 0) {
        try {
          this.dataSource
            .getRepository(Pantry)
            .createQueryBuilder()
            .update({
              quantity: quantity,
              quantity_unit: { id: String(quantityType) },
            })
            .where({
              id: id,
              user: user,
            })
            .execute();
          return { message: ['Sikeres módosítás'], statusCode: 200 };
        } catch {
          return { message: ['Sikertelen módosítás'], statusCode: 404 };
        }
      } else return { message: ['Sikertelen módosítás'], statusCode: 404 };
    }
  }
}

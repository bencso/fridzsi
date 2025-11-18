import { Injectable } from '@nestjs/common';
import { CreatePantryItemDto } from './dto/create-pantry-item.dto';
import { UsersService } from 'src/users/users.service';
import { DataSource, In } from 'typeorm';
import { SessionService } from 'src/sessions/sessions.service';
import { Request } from 'express';
import { ProductService } from 'src/product/product.service';
import { Pantry } from './entities/pantry.entity';

@Injectable()
export class PantryService {
  constructor(
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
    private readonly sessionsService: SessionService,
    private readonly productService: ProductService,
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

        await this.dataSource
          .getRepository(Pantry)
          .createQueryBuilder()
          .insert()
          .values({
            user: { id: user.id },
            product: { id: productId },
            quantity: createPantryItemDto.quantity,
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
        .select([
          'pantry.id AS index',
          'product.product_name AS name',
          'pantry.quantity AS quantity',
          'pantry.quantity_unit AS quantityUnit',
          'pantry.expiredAt AS expiredAt',
          'product.code AS code',
        ])
        .where('pantry.user = :userId', { userId: user.id })
        .andWhere('pantry.expiredAt >= :now', { now: new Date() })
        .getRawMany();

      console.log(products);

      const returnProducts = [
        products.reduce((acc, curr) => {
          acc[curr.code] = acc[curr.code] || [];
          acc[curr.code].push(curr);
          return acc;
        }, {}),
      ];

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
        .select([
          'pantry.id AS index',
          'product.product_name AS name',
          'pantry.quantity AS quantity',
          'pantry.quantity_unit AS quantityUnit',
          'pantry.expiredAt AS expiredAt',
          'product.code AS code',
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

  async edit(request: Request, id: number, quantity: number) {
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

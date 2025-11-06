import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProductDto } from './dto/Product';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/CreateProductDto';
import { SessionService } from 'src/sessions/sessions.service';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';
import { SearchProductDto } from './dto/SearchProductDto';

@Injectable()
export class ProductService {
  constructor(
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
    private readonly sessionsService: SessionService,
  ) {}

  async getItemById(code: string): Promise<ProductDto> {
    const product = await this.dataSource
      .getRepository(Product)
      .createQueryBuilder()
      .select()
      .where({ code: code })
      .getOne();

    if (product) return product;
    else return null;
  }

  async getItemByKeyword(keyword: string): Promise<SearchProductDto[]> {
    const product = await this.dataSource
      .getRepository(Product)
      .createQueryBuilder()
      .select()
      .where('LOWER(product_name) LIKE LOWER(:keyword)', {
        keyword: `%${keyword}%`,
      })
      .getMany();

    if (product)
      return product.map((product: ProductDto) => ({
        name: product.product_name,
        code: product.code,
      }));
    else return null;
  }

  async getItemId(code: string): Promise<any> {
    const product = await this.dataSource
      .getRepository(Product)
      .createQueryBuilder()
      .select()
      .where({
        code: code,
      })
      .getOne();

    if (product) return product.id;
    else return null;
  }

  async create(request: Request, createProductDto: CreateProductDto) {
    const requestUser = await this.sessionsService.validateAccessToken(request);
    const user = await this.usersService.findUser(requestUser.email);

    if (user) {
      try {
        const product = await this.dataSource
          .getRepository(Product)
          .createQueryBuilder()
          .insert()
          .values({
            ...createProductDto,
          })
          .execute();

        return product.identifiers[0]['id'];
      } catch {
        throw new Error('Hiba történt az új termék felvitel közben');
      }
    } else throw new Error('Hiba történt az új termék felvitel közben');
  }
}

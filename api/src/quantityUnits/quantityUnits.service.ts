import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';
import {
  quantityTypesParams,
  QuantityUnits,
} from './entities/quantityUnits.entity';
import { Request } from 'express';
import { Pantry } from 'src/pantry/entities/pantry.entity';
import { Product } from 'src/product/entities/product.entity';
import { SessionService } from 'src/sessions/sessions.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class QuantityUnitsService {
  constructor(
    @InjectRepository(QuantityUnits)
    private readonly quantityUnitsRepo: Repository<QuantityUnits>,
    private readonly dataSource: DataSource,
    private readonly sessionsService: SessionService,
    private readonly usersService: UsersService,
  ) {}

  async findAll(): Promise<quantityTypesParams[] | []> {
    return (
      (await this.quantityUnitsRepo.find({
        where: {
          category: Not('utensil'),
        },
      })) || []
    );
  }

  async getHighest({ id }: { id?: number }): Promise<any> {
    let highestUnitByCategories = await this.dataSource
      .getRepository(QuantityUnits)
      .createQueryBuilder('quantity_units')
      .select()
      .where((q) => {
        const subQuery = q
          .subQuery()
          .select('MAX(q.id)')
          .from(QuantityUnits, 'q')
          .where('q.category = quantity_units.category')
          .getQuery();
        return `quantity_units.id = ${subQuery}`;
      })
      .groupBy('quantity_units.id, quantity_units.category')
      .orderBy('quantity_units.category', 'ASC')
      .addOrderBy('quantity_units.id', 'DESC')
      .getRawMany();

    if (id !== undefined) {
      highestUnitByCategories = await this.dataSource
        .getRepository(QuantityUnits)
        .createQueryBuilder('quantity_units')
        .select()
        .where((q) => {
          const subQuery = q
            .subQuery()
            .select('q.category')
            .from(QuantityUnits, 'q')
            .where('q.id = :id', { id: id })
            .getQuery();
          return `quantity_units.category = (${subQuery})`;
        })
        .andWhere((q) => {
          const subQuery = q
            .subQuery()
            .select('MAX(q.id)')
            .from(QuantityUnits, 'q')
            .where('q.category = quantity_units.category')
            .getQuery();
          return `quantity_units.id = ${subQuery}`;
        })
        .getRawOne();
    }
    console.log(highestUnitByCategories);
    return highestUnitByCategories;
  }

  async convertToHighest({
    request,
    productName,
  }: {
    request: Request;
    productName?: string;
  }): Promise<any> {
    /**
     * SELECT quantity_units.name
     * FROM quantity_units
     * WHERE quantity_units.id = (SELECT MAX(pantry.quantityUnitId)
     * FROM pantry
     * WHERE pantry.productId = (SELECT product.id FROM product WHERE product.product_name LIKE %name%)
     * AND pantry.userId = (SELECT user.id FROM user WHERE user.id = :userId))
     */
    console.log(request);
    const requestUser = await this.sessionsService.validateAccessToken(request);
    const user = await this.usersService.findUser(requestUser.email);

    if (user) {
      const userId = user.id;
      const highestUnitByUser = await this.dataSource
        .getRepository(QuantityUnits)
        .createQueryBuilder('quantity_units')
        .select()
        .where((query) => {
          const subQuery = query
            .subQuery()
            .select('MAX(pantry.quantityUnitId)')
            .from(Pantry, 'pantry')
            .where((query) => {
              const productSubQuery = query
                .subQuery()
                .select('pr.id')
                .from(Product, 'pr')
                .where('LOWER(pr.product_name) LIKE :name', {
                  name: `%${productName.toLowerCase()}%`,
                })
                .getQuery();
              return `pantry.productId = (${productSubQuery})`;
            })
            .andWhere('pantry.userId = :userId', { userId })
            .getQuery();
          return `quantity_units.id = (${subQuery})`;
        })
        .getRawMany();
      return highestUnitByUser;
    }

    return null;
  }
}

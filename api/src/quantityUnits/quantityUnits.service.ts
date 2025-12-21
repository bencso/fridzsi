import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';
import {
  quantityTypesParams,
  QuantityUnits,
} from './entities/quantityUnits.entity';
import { Request } from 'express';
import { SessionService } from 'src/sessions/sessions.service';
import { UsersService } from 'src/users/users.service';
import { ReturnDataDto } from 'src/dto/return.dto';

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

  async findToId({ id }: { id?: number }): Promise<any> {
    return await this.dataSource
      .getRepository(QuantityUnits)
      .createQueryBuilder('quantity_units')
      .select('quantity_units.divideToBigger')
      .where('quantity_units.id >= :id', { id: id })
      .andWhere((q) => {
        const subQuery = q
          .subQuery()
          .select('q.category')
          .from(QuantityUnits, 'q')
          .where('q.id = :id', { id: id })
          .getQuery();
        return `quantity_units.category = ${subQuery}`;
      })
      .getRawMany();
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

    return highestUnitByCategories;
  }

  // Itt a kódom kicsit skálázhatóság szempontjából javult, a batcheléssel
  // Batchelés: Egy nagyobb adathalmazt adott kis részekre bontva dolgozunk fel
  async convertToHighest({
    request,
    products,
  }: {
    request: Request;
    products?: any[];
  }): Promise<ReturnDataDto> {
    /**
     * SELECT quantity_units.name
     * FROM quantity_units
     * WHERE quantity_units.id = (SELECT MAX(pantry.quantityUnitId)
     * FROM pantry
     * WHERE pantry.productId = (SELECT product.id FROM product WHERE product.product_name LIKE %name%)
     * AND pantry.userId = (SELECT user.id FROM user WHERE user.id = :userId))
     */
    const requestUser = await this.sessionsService.validateAccessToken(request);
    const user = await this.usersService.findUser(requestUser.email);

    if (user) {
      const maxQuantityUnit = {};
      const codes = new Set();

      const units = await this.dataSource
        .getRepository(QuantityUnits)
        .createQueryBuilder('quantity_units')
        .select('quantity_units.id', 'id')
        .addSelect('quantity_units.divideToBigger', 'divideToBigger')
        .orderBy('quantity_units.id', 'ASC')
        .getRawMany();

      const productsBatch = products.reduce((acc, curr) => {
        if (
          !maxQuantityUnit[curr.code] ||
          maxQuantityUnit[curr.code] < curr.quantityunitid
        )
          maxQuantityUnit[curr.code] = curr.quantityunitid;

        if (!codes.has(curr.code)) codes.add(curr.code);

        acc[curr.code] = acc[curr.code] || [];
        acc[curr.code].push(curr);
        return acc;
      }, {});

      const convertedQuantityArray = [];

      for (const code of codes) {
        const batch = productsBatch[code as string];
        for (const batchItem of batch) {
          const differentUnit =
            maxQuantityUnit[batchItem.code] - batchItem.quantityunitid;
          const divide = units
            .filter((value) => {
              return value.id < maxQuantityUnit[batchItem.code];
            })
            .slice(0, differentUnit)
            .reduce((acc, curr) => {
              return (acc = acc * curr.divideToBigger);
            }, 1);

          if (batchItem.quantityunitid != maxQuantityUnit) {
            convertedQuantityArray.push({
              ...batchItem,
              converted_quantity: batchItem.quantity / divide,
            });
          } else {
            convertedQuantityArray.push({
              ...batchItem,
              converted_quantity: batchItem.quantity,
            });
          }
        }
      }

      return {
        message: ['Sikeres lekérdezés!'],
        statusCode: 200,
        data: [convertedQuantityArray],
      };
    }

    return {
      message: ['Sikertelen lekérdezés!'],
      statusCode: 404,
      data: [],
    };
  }
}

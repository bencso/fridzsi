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

  //! Itt a kódom kicsit skálázhatóság szempontjából javult, a batcheléssel
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
      let maxQuantityUnit = 0;
      const codes = new Set();

      const productsBatch = products.reduce((acc, curr) => {
        if (maxQuantityUnit < curr.quantityunitid)
          maxQuantityUnit = curr.quantityunitid;

        if (!codes.has(curr.code)) codes.add(curr.code);

        acc[curr.code] = acc[curr.code] || [];
        acc[curr.code].push(curr);
        return acc;
      }, {});

      const units = await this.dataSource
        .getRepository(QuantityUnits)
        .createQueryBuilder('quantity_units')
        .select('quantity_units.id', 'id')
        .addSelect('quantity_units.divideToBigger', 'divideToBigger')
        .orderBy('quantity_units.id', 'ASC')
        .getRawMany();

      const convertedQuantityArray = [];

      for (const code of codes) {
        const batch = productsBatch[code as string];
        for (const batchItem of batch) {
          const differentUnit = maxQuantityUnit - batchItem.quantityunitid;
          const divide = units
            .filter((value) => {
              return value.id < maxQuantityUnit;
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

      const returnData = convertedQuantityArray.reduce((acc, curr) => {
        acc[curr.code] = acc[curr.code] || [];
        acc[curr.code].push(curr);
        return acc;
      }, {});

      return {
        message: ['Sikeres lekérdezés!'],
        statusCode: 200,
        data: [returnData],
      };
    }

    return {
      message: ['Sikertelen lekérdezés!'],
      statusCode: 404,
      data: [],
    };
  }
}

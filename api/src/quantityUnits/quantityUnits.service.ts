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

  //TODO: és akkor ha megvan hogy mi a legmagassabb lekérni az ugyanilyen termékeket és akkor utána átalakítani őket :)
  async convertToHighest({
    request,
    productId,
  }: {
    request: Request;
    productId?: string;
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
            .where(`pantry.productId = :productId`, { productId })
            .andWhere('pantry.userId = :userId', { userId })
            .getQuery();
          return `quantity_units.id = (${subQuery})`;
        })
        .getRawMany();

      const products = await this.dataSource
        .getRepository(Pantry)
        .createQueryBuilder('pantry')
        .select()
        .where('pantry.productId = :productId', { productId })
        .andWhere('pantry.user_id = :userId', { userId })
        .getRawMany();

      products.map((product: Pantry) => {
        //TODO: IDE KELL MAJD SZÁMOLÁST, HOGY ADDIG ÖSSZEADNI a dolgokat, ami nem az Id és
        // utána azt az eredményt osztani és ennyi
        // megvan a product_units és akkor az alapján emg tudjuk az id-t és utána megvan a dolog
        // TODO: Hozzáaadni a pantry lekérdezéses függvényhez majd
        /**
         * Eredmény:
         * SELECT SUM(quantity_units.divideToBigger)
         * FROM quantity_units
         * WHERE quanity_units.id > (SELECT quantity_units.id FROM quantity_units WHERE quanitity_units.hu LIKE %name%)
         * */
        //TODO: Azt kell csinálni hogy elsősorban inner joinozzuk a quantity_units táblát illetve a pantry-t
        // lekérdezzük majd a quantity_units.id-vel csökkenő sorrendbe ugye ez mutatja a sorrendet
        // Ezen felül group byoljuk majd a quantity_units.id alapján és azokat összesumoljuk SUM(pantry.quantity) és akkor
        // ezekután lekérdezzük még a divide értékét, és végig megyünk ,majd ezen az eredményen egy reduce függvénnyel
        // itt az elöző értéket (acc) osztjuk a divide értékkel, és hozzáadjuk azt a return acc-hoz, illetve hozzáadjuk ezekhez a lekérdezett értéket
        //  és ezáltal meglesz majd a legnagyobb értékkel amivel fel van véve a dolog....
      });

      return {
        message: ['Sikeres lekérdezés!'],
        statusCode: 200,
        data: [highestUnitByUser],
      };
    }

    return {
      message: ['Sikertelen lekérdezés!'],
      statusCode: 404,
      data: [],
    };
  }
}

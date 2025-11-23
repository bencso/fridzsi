import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from 'nestjs-pino';
import { SessionsController } from './sessions/sessions.controller';
import { SessionService } from './sessions/sessions.service';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { PantryController } from './pantry/pantry.controller';
import { PantryService } from './pantry/pantry.service';
import { ShoppingListService } from './shoppinglist/shoppinglist.service';
import { ShoppingListController } from './shoppinglist/shoppinglist.controller';
import {
  quantityTypes,
  QuantityUnits,
} from './quantityUnits/entities/quantityUnits.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QuantityUnitsController } from './quantityUnits/quantityUnits.controller';
import { QuantityUnitsService } from './quantityUnits/quantityUnits.service';

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    }),
    // Regisztráljuk az entitást, hogy a Repository elérhető legyen injektáláshoz
    TypeOrmModule.forFeature([QuantityUnits]),
    AuthModule,
  ],
  controllers: [
    AppController,
    SessionsController,
    UsersController,
    ProductController,
    PantryController,
    ShoppingListController,
    QuantityUnitsController,
  ],
  providers: [
    AppService,
    SessionService,
    UsersService,
    ProductService,
    PantryService,
    ShoppingListService,
    QuantityUnitsService,
  ],
  exports: [TypeOrmModule],
})
export class AppModule implements OnModuleInit {
  constructor(
    @InjectRepository(QuantityUnits)
    private readonly repository: Repository<QuantityUnits>,
  ) {}

  async onModuleInit() {
    const existingCount = await this.repository.count();
    if (existingCount > 0) {
      return;
    }

    const entities = quantityTypes.map((type) => this.repository.create(type));
    await this.repository.save(entities);
  }
}

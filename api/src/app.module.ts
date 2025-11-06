import { Module } from '@nestjs/common';
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
    AuthModule,
  ],
  controllers: [
    AppController,
    SessionsController,
    UsersController,
    ProductController,
    PantryController,
    ShoppingListController,
  ],
  providers: [
    AppService,
    SessionService,
    UsersService,
    ProductService,
    PantryService,
    ShoppingListService,
  ],
  exports: [TypeOrmModule],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ShoppingListService } from './shoppinglist.service';
import { ShoppingListController } from './shoppinglist.controller';

@Module({
  controllers: [ShoppingListController],
  providers: [ShoppingListService],
})
export class ShoppingListModule {}

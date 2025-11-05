import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingListController } from './shoppinglist.controller';
import { ShoppingListService } from './shoppinglist.service';

describe('ShoppingListController', () => {
  let controller: ShoppingListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoppingListController],
      providers: [ShoppingListService],
    }).compile();

    controller = module.get<ShoppingListController>(ShoppingListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

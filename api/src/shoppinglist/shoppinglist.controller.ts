import { Controller } from '@nestjs/common';

@Controller('shoppinglist')
export class ShoppingListController {
  constructor(private readonly shoppinglistService: ShoppingListController) {}
}

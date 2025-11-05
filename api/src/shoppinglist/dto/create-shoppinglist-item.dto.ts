import { ApiProperty } from '@nestjs/swagger';

export class CreateShoppingListItemDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  product_name?: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  day?: Date;
}

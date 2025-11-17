import { ApiProperty } from '@nestjs/swagger';

export class CreatePantryItemDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  product_name?: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  expiredAt?: Date;
}

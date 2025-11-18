import { ApiProperty } from '@nestjs/swagger';

//TODO: Validáció majd
export class CreatePantryItemDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  product_name?: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  quanity_units?: number;

  @ApiProperty()
  expiredAt?: Date;
}

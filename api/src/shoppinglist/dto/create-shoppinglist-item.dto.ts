import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';

export class CreateShoppingListItemDto {
  @ApiProperty({ type: String })
  code?: string;

  @ApiProperty({ type: String })
  product_name?: string;

  @Min(1)
  @IsNumber()
  @ApiProperty({ type: Number, minimum: 1, default: 1 })
  quantity: number;

  @IsString()
  @ApiProperty({
    type: Date,
    format: 'date',
    required: false,
    default: new Date().toISOString().split('T')[0],
  })
  day?: Date;
}

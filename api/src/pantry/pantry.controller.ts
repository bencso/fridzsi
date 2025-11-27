import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PantryService } from './pantry.service';
import { CreatePantryItemDto } from './dto/create-pantry-item.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@Controller('pantry')
export class PantryController {
  constructor(private readonly pantryService: PantryService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  create(
    @Req() request: Request,
    @Body() createPantryItemDto: CreatePantryItemDto,
  ) {
    return this.pantryService.create(request, createPantryItemDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  getUserPantry(@Req() request: Request): any {
    return this.pantryService.getUserPantry(request);
  }

  @Get('/:code')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  getUserPantryItemByCode(
    @Req() request: Request,
    @Param('code') code: string,
  ): any {
    return this.pantryService.getUserPantryItemByCode(request, code);
  }

  @Post('/edit/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  edit(
    @Req() request: Request,
    @Param('id') id: number,
    @Body('quantity') quantity: number,
    @Body('quantityType') quantityType: number,
  ) {
    return this.pantryService.edit(request, id, quantity, quantityType);
  }

  //? Hogy ne Bodyba kelljen az id-kat küldeni arra ez is jó megoldás lehet:
  //? @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' })) ids: number[]
  @Post('/delete')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  remove(@Req() request: Request, @Body('id') id: number[]) {
    return this.pantryService.remove(request, id);
  }
}

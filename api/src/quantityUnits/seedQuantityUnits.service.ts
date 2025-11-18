import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { quantityTypes, QuantityUnits } from './entities/quantityUnits.entity';

@Injectable()
export class QuantityUnitsSeedService {
  constructor(
    @InjectRepository(QuantityUnits)
    private readonly repository: Repository<QuantityUnits>,
  ) {}

  async seedQuantityUnits(): Promise<void> {
    const existingCount = await this.repository.count();
    if (existingCount > 0) {
      return;
    }

    const entities = quantityTypes.map((type) => this.repository.create(type));
    await this.repository.save(entities);
  }
}

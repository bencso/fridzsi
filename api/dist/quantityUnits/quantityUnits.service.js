"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuantityUnitsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const quantityUnits_entity_1 = require("./entities/quantityUnits.entity");
let QuantityUnitsService = class QuantityUnitsService {
    constructor(quantityUnitsRepo, dataSource) {
        this.quantityUnitsRepo = quantityUnitsRepo;
        this.dataSource = dataSource;
    }
    async findAll() {
        return (await this.quantityUnitsRepo.find()) || [];
    }
    async convertToHighest() {
        const highestUnitByCategories = await this.dataSource
            .getRepository(quantityUnits_entity_1.QuantityUnits)
            .createQueryBuilder('quantity_units')
            .select()
            .where((q) => {
            const subQuery = q
                .subQuery()
                .select('MAX(q.id)')
                .from(quantityUnits_entity_1.QuantityUnits, 'q')
                .where('q.category = quantity_units.category')
                .getQuery();
            return `quantity_units.id = ${subQuery}`;
        })
            .groupBy('quantity_units.id, quantity_units.category')
            .orderBy('quantity_units.category', 'ASC')
            .addOrderBy('quantity_units.id', 'DESC')
            .getRawMany();
        console.log(highestUnitByCategories);
        return highestUnitByCategories;
    }
};
exports.QuantityUnitsService = QuantityUnitsService;
exports.QuantityUnitsService = QuantityUnitsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(quantityUnits_entity_1.QuantityUnits)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], QuantityUnitsService);
//# sourceMappingURL=quantityUnits.service.js.map
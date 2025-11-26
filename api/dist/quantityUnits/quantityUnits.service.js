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
const sessions_service_1 = require("../sessions/sessions.service");
const users_service_1 = require("../users/users.service");
const pantry_entity_1 = require("../pantry/entities/pantry.entity");
const product_entity_1 = require("../product/entities/product.entity");
let QuantityUnitsService = class QuantityUnitsService {
    constructor(quantityUnitsRepo, dataSource, sessionsService, usersService) {
        this.quantityUnitsRepo = quantityUnitsRepo;
        this.dataSource = dataSource;
        this.sessionsService = sessionsService;
        this.usersService = usersService;
    }
    async findAll() {
        return ((await this.quantityUnitsRepo.find({
            where: {
                category: (0, typeorm_2.Not)('utensil'),
            },
        })) || []);
    }
    async getHighest({ id }) {
        let highestUnitByCategories = await this.dataSource
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
        if (id !== undefined) {
            highestUnitByCategories = await this.dataSource
                .getRepository(quantityUnits_entity_1.QuantityUnits)
                .createQueryBuilder('quantity_units')
                .select()
                .where((q) => {
                const subQuery = q
                    .subQuery()
                    .select('q.category')
                    .from(quantityUnits_entity_1.QuantityUnits, 'q')
                    .where('q.id = :id', { id: id })
                    .getQuery();
                return `quantity_units.category = (${subQuery})`;
            })
                .andWhere((q) => {
                const subQuery = q
                    .subQuery()
                    .select('MAX(q.id)')
                    .from(quantityUnits_entity_1.QuantityUnits, 'q')
                    .where('q.category = quantity_units.category')
                    .getQuery();
                return `quantity_units.id = ${subQuery}`;
            })
                .getRawOne();
        }
        console.log(highestUnitByCategories);
        return highestUnitByCategories;
    }
    async convertToHighest({ request, products, }) {
        const requestUser = await this.sessionsService.validateAccessToken(request);
        const user = await this.usersService.findUser(requestUser.email);
        if (user) {
            const userId = user.id;
            const haveHighestUnit = new Set();
            const units = await this.dataSource
                .getRepository(quantityUnits_entity_1.QuantityUnits)
                .createQueryBuilder('quantity_units')
                .select()
                .getMany();
            const returnProducts = await products.reduce(async (acc, curr) => {
                const accumulated = await acc;
                const entry = accumulated[curr.code] ?? {
                    items: [],
                    highestUnit: null,
                };
                let highestUnit = entry.highestUnit;
                if (!haveHighestUnit.has(curr.code)) {
                    highestUnit = await this.dataSource
                        .getRepository(quantityUnits_entity_1.QuantityUnits)
                        .createQueryBuilder('quantity_units')
                        .select()
                        .where((query) => {
                        const subQuery = query
                            .subQuery()
                            .select('MAX(pantry.quantityUnitId)')
                            .from(pantry_entity_1.Pantry, 'pantry')
                            .innerJoin(product_entity_1.Product, 'product', 'pantry.productId = product.id')
                            .where('pantry.userId = :userId', { userId })
                            .andWhere('product.id = :productId', {
                            productId: curr.productid,
                        })
                            .getQuery();
                        return `quantity_units.id = (${subQuery})`;
                    })
                        .getOne();
                    entry.highestUnit = highestUnit ?? entry.highestUnit;
                    haveHighestUnit.add(curr.code);
                }
                if (highestUnit) {
                    const highestUnitId = highestUnit.id ? highestUnit.id : -1;
                    const different = Number(highestUnitId) - Number(curr.quantityunitid);
                    if (different === 0) {
                        entry.items.push(curr);
                    }
                    else {
                        const quantity = curr.quantity;
                        const lowerUnits = units.filter((unit) => {
                            return unit.id < highestUnit.id;
                        });
                        const convertedQuantity = lowerUnits.reduce((unitAcc, unitCurr) => {
                            return unitAcc / unitCurr.divideToBigger;
                        }, quantity);
                        entry.items.push({
                            ...curr,
                            converted_quantity: convertedQuantity.toFixed(4),
                        });
                    }
                }
                accumulated[curr.code] = entry;
                return accumulated;
            }, Promise.resolve({}));
            console.log(returnProducts);
            return {
                message: ['Sikeres lekérdezés!'],
                statusCode: 200,
                data: [user],
            };
        }
        return {
            message: ['Sikertelen lekérdezés!'],
            statusCode: 404,
            data: [],
        };
    }
};
exports.QuantityUnitsService = QuantityUnitsService;
exports.QuantityUnitsService = QuantityUnitsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(quantityUnits_entity_1.QuantityUnits)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource,
        sessions_service_1.SessionService,
        users_service_1.UsersService])
], QuantityUnitsService);
//# sourceMappingURL=quantityUnits.service.js.map
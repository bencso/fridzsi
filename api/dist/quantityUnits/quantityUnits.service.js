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
            const maxQuantityUnit = {};
            const codes = new Set();
            const units = await this.dataSource
                .getRepository(quantityUnits_entity_1.QuantityUnits)
                .createQueryBuilder('quantity_units')
                .select('quantity_units.id', 'id')
                .addSelect('quantity_units.divideToBigger', 'divideToBigger')
                .orderBy('quantity_units.id', 'ASC')
                .getRawMany();
            const productsBatch = products.reduce((acc, curr) => {
                if (!maxQuantityUnit[curr.code] ||
                    maxQuantityUnit[curr.code] < curr.quantityunitid)
                    maxQuantityUnit[curr.code] = curr.quantityunitid;
                if (!codes.has(curr.code))
                    codes.add(curr.code);
                acc[curr.code] = acc[curr.code] || [];
                acc[curr.code].push(curr);
                return acc;
            }, {});
            const convertedQuantityArray = [];
            for (const code of codes) {
                const batch = productsBatch[code];
                for (const batchItem of batch) {
                    const differentUnit = maxQuantityUnit[batchItem.code] - batchItem.quantityunitid;
                    const divide = units
                        .filter((value) => {
                        return value.id < maxQuantityUnit[batchItem.code];
                    })
                        .slice(0, differentUnit)
                        .reduce((acc, curr) => {
                        return (acc = acc * curr.divideToBigger);
                    }, 1);
                    if (batchItem.quantityunitid != maxQuantityUnit) {
                        convertedQuantityArray.push({
                            ...batchItem,
                            converted_quantity: batchItem.quantity / divide,
                        });
                    }
                    else {
                        convertedQuantityArray.push({
                            ...batchItem,
                            converted_quantity: batchItem.quantity,
                        });
                    }
                }
            }
            const returnData = convertedQuantityArray.reduce((acc, curr) => {
                acc[curr.code] = acc[curr.code] || [];
                acc[curr.code].push(curr);
                return acc;
            }, {});
            return {
                message: ['Sikeres lekérdezés!'],
                statusCode: 200,
                data: [returnData],
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
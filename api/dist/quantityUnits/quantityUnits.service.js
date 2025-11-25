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
const pantry_entity_1 = require("../pantry/entities/pantry.entity");
const product_entity_1 = require("../product/entities/product.entity");
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
    async convertToHighest({ request, productName, }) {
        console.log(request);
        const requestUser = await this.sessionsService.validateAccessToken(request);
        const user = await this.usersService.findUser(requestUser.email);
        if (user) {
            const userId = user.id;
            const highestUnitByUser = await this.dataSource
                .getRepository(quantityUnits_entity_1.QuantityUnits)
                .createQueryBuilder('quantity_units')
                .select()
                .where((query) => {
                const subQuery = query
                    .subQuery()
                    .select('MAX(pantry.quantityUnitId)')
                    .from(pantry_entity_1.Pantry, 'pantry')
                    .where((query) => {
                    const productSubQuery = query
                        .subQuery()
                        .select('pr.id')
                        .from(product_entity_1.Product, 'pr')
                        .where('LOWER(pr.product_name) LIKE :name', {
                        name: `%${productName.toLowerCase()}%`,
                    })
                        .getQuery();
                    return `pantry.productId = (${productSubQuery})`;
                })
                    .andWhere('pantry.userId = :userId', { userId })
                    .getQuery();
                return `quantity_units.id = (${subQuery})`;
            })
                .getRawMany();
            return highestUnitByUser;
        }
        return null;
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
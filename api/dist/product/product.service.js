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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
const sessions_service_1 = require("../sessions/sessions.service");
const users_service_1 = require("../users/users.service");
let ProductService = class ProductService {
    constructor(usersService, dataSource, sessionsService) {
        this.usersService = usersService;
        this.dataSource = dataSource;
        this.sessionsService = sessionsService;
    }
    async getItemById(code) {
        const product = await this.dataSource
            .getRepository(product_entity_1.Product)
            .createQueryBuilder()
            .select()
            .where({ code: code })
            .getOne();
        if (product)
            return product;
        else
            return null;
    }
    async getItemByKeyword(keyword) {
        const product = await this.dataSource
            .getRepository(product_entity_1.Product)
            .createQueryBuilder()
            .select()
            .where('LOWER(product_name) LIKE LOWER(:keyword)', {
            keyword: `%${keyword}%`,
        })
            .getMany();
        if (product)
            return product.map((product) => ({
                name: product.product_name,
                code: product.code,
            }));
        else
            return null;
    }
    async getItemId(code) {
        const product = await this.dataSource
            .getRepository(product_entity_1.Product)
            .createQueryBuilder()
            .select()
            .where({
            code: code,
        })
            .getOne();
        if (product)
            return product.id;
        else
            return null;
    }
    async create(request, createProductDto) {
        const requestUser = await this.sessionsService.validateAccessToken(request);
        const user = await this.usersService.findUser(requestUser.email);
        if (user) {
            try {
                const product = await this.dataSource
                    .getRepository(product_entity_1.Product)
                    .createQueryBuilder()
                    .insert()
                    .values({
                    ...createProductDto,
                })
                    .execute();
                return product.identifiers[0]['id'];
            }
            catch {
                throw new Error('Hiba történt az új termék felvitel közben');
            }
        }
        else
            throw new Error('Hiba történt az új termék felvitel közben');
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        typeorm_1.DataSource,
        sessions_service_1.SessionService])
], ProductService);
//# sourceMappingURL=product.service.js.map
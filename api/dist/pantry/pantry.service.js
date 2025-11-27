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
exports.PantryService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const typeorm_1 = require("typeorm");
const sessions_service_1 = require("../sessions/sessions.service");
const product_service_1 = require("../product/product.service");
const pantry_entity_1 = require("./entities/pantry.entity");
const quantityUnits_entity_1 = require("../quantityUnits/entities/quantityUnits.entity");
const quantityUnits_service_1 = require("../quantityUnits/quantityUnits.service");
let PantryService = class PantryService {
    constructor(usersService, dataSource, sessionsService, productService, quantityUnitsService) {
        this.usersService = usersService;
        this.dataSource = dataSource;
        this.sessionsService = sessionsService;
        this.productService = productService;
        this.quantityUnitsService = quantityUnitsService;
    }
    async create(request, createPantryItemDto) {
        const requestUser = await this.sessionsService.validateAccessToken(request);
        const user = await this.usersService.findUser(requestUser.email);
        let productId = null;
        try {
            if (user) {
                productId = await this.productService.getItemId(createPantryItemDto.code);
                if (!productId) {
                    const createdProduct = await this.productService.create(request, {
                        product_name: createPantryItemDto.product_name,
                        code: createPantryItemDto.code,
                    });
                    productId = createdProduct?.id ?? createdProduct;
                }
                const quantityUnit = await this.dataSource
                    .getRepository(quantityUnits_entity_1.QuantityUnits)
                    .createQueryBuilder('quantity_unit')
                    .select()
                    .whereInIds(createPantryItemDto.quanity_units || 1)
                    .getOne();
                await this.dataSource
                    .getRepository(pantry_entity_1.Pantry)
                    .createQueryBuilder()
                    .insert()
                    .values({
                    user: { id: user.id },
                    product: { id: productId },
                    quantity: createPantryItemDto.quantity,
                    quantity_unit: quantityUnit,
                    expiredAt: createPantryItemDto.expiredAt || new Date(),
                })
                    .execute();
                return { message: ['Sikeres létrehozás'], statusCode: 200 };
            }
        }
        catch {
            return { message: ['Sikertelen létrehozás'], statusCode: 403 };
        }
    }
    async getUserPantry(request) {
        const requestUser = await this.sessionsService.validateAccessToken(request);
        const user = await this.usersService.findUser(requestUser.email);
        if (user) {
            const products = await this.dataSource
                .getRepository(pantry_entity_1.Pantry)
                .createQueryBuilder('pantry')
                .innerJoin('pantry.product', 'product')
                .innerJoin('pantry.quantity_unit', 'quantity_unit')
                .select([
                'pantry.id AS index',
                'product.product_name AS name',
                'pantry.quantity AS quantity',
                'pantry.quantity_unit AS quantityUnit',
                'pantry.expiredAt AS expiredAt',
                'product.code AS code',
                'product.id AS productId',
                'quantity_unit.label as quantityUnit',
                'quantity_unit.id as quantityUnitId',
                'quantity_unit.en as quantityUnitEn',
                'quantity_unit.hu as quantityUnitHu',
            ])
                .where('pantry.user = :userId', { userId: user.id })
                .andWhere('pantry.expiredAt >= :now', { now: new Date() })
                .getRawMany();
            const returnData = await this.quantityUnitsService.convertToHighest({
                request,
                products: products,
            });
            const returnProducts = returnData.data;
            return products.length > 0
                ? {
                    message: ['Sikeres lekérdezés'],
                    statusCode: 200,
                    products: returnProducts,
                }
                : {
                    message: ['Nincs semmi a raktárjában a felhasználónak!'],
                    statusCode: 404,
                    products: products,
                };
        }
        else
            return { message: ['Sikertelen lekérdezés'], statusCode: 404 };
    }
    async getUserPantryItemByCode(request, code) {
        const requestUser = await this.sessionsService.validateAccessToken(request);
        const user = await this.usersService.findUser(requestUser.email);
        if (user) {
            const products = await this.dataSource
                .getRepository(pantry_entity_1.Pantry)
                .createQueryBuilder('pantry')
                .innerJoin('pantry.product', 'product')
                .innerJoin('pantry.quantity_unit', 'quantity_unit')
                .select([
                'pantry.id AS index',
                'product.product_name AS name',
                'pantry.quantity AS quantity',
                'pantry.quantity_unit AS quantityUnit',
                'pantry.expiredAt AS expiredAt',
                'product.code AS code',
                'quantity_unit.label as quantityUnit',
                'quantity_unit.en as quantityUnitEn',
                'quantity_unit.hu as quantityUnitHu',
            ])
                .where('pantry.user = :userId', { userId: user.id })
                .andWhere('product.code = :code', { code })
                .andWhere('pantry.expiredAt >= :now', { now: new Date() })
                .getRawMany();
            return products.length > 0
                ? {
                    message: ['Sikeres lekérdezés'],
                    statusCode: 200,
                    products,
                }
                : {
                    message: [
                        'Nincs semmi a raktárjában a felhasználónak az alábbi kóddal!',
                    ],
                    statusCode: 404,
                    products: [],
                };
        }
        else
            return { message: ['Sikertelen lekérdezés'], statusCode: 404 };
    }
    async remove(request, id) {
        const requestUser = await this.sessionsService.validateAccessToken(request);
        const user = await this.usersService.findUser(requestUser.email);
        if (user) {
            const product = await this.dataSource
                .getRepository(pantry_entity_1.Pantry)
                .createQueryBuilder()
                .where({
                id: (0, typeorm_1.In)(id),
                user: user,
            })
                .getCount();
            if (product > 0) {
                try {
                    this.dataSource.getRepository(pantry_entity_1.Pantry).delete({
                        id: (0, typeorm_1.In)(id),
                        user: user,
                    });
                    return { message: ['Sikeres törlés'], statusCode: 200 };
                }
                catch {
                    return { message: ['Sikertelen törlés'], statusCode: 404 };
                }
            }
            else
                return { message: ['Sikertelen törlés'], statusCode: 404 };
        }
    }
    async edit(request, id, quantity) {
        if (quantity <= 0) {
            return {
                message: ['A mennyiség nem lehet kisebb vagy egyenlő nullával'],
                statusCode: 400,
            };
        }
        const requestUser = await this.sessionsService.validateAccessToken(request);
        const user = await this.usersService.findUser(requestUser.email);
        if (user) {
            const product = await this.dataSource
                .getRepository(pantry_entity_1.Pantry)
                .createQueryBuilder()
                .where({
                id: id,
                user: user,
            })
                .getCount();
            if (product > 0) {
                try {
                    this.dataSource
                        .getRepository(pantry_entity_1.Pantry)
                        .createQueryBuilder()
                        .update({
                        quantity: quantity,
                    })
                        .where({
                        id: id,
                        user: user,
                    })
                        .execute();
                    return { message: ['Sikeres módosítás'], statusCode: 200 };
                }
                catch {
                    return { message: ['Sikertelen módosítás'], statusCode: 404 };
                }
            }
            else
                return { message: ['Sikertelen módosítás'], statusCode: 404 };
        }
    }
};
exports.PantryService = PantryService;
exports.PantryService = PantryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        typeorm_1.DataSource,
        sessions_service_1.SessionService,
        product_service_1.ProductService,
        quantityUnits_service_1.QuantityUnitsService])
], PantryService);
//# sourceMappingURL=pantry.service.js.map
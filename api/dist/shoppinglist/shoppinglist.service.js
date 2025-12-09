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
exports.ShoppingListService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const typeorm_1 = require("typeorm");
const sessions_service_1 = require("../sessions/sessions.service");
const product_service_1 = require("../product/product.service");
const shoppinglist_entity_1 = require("./entities/shoppinglist.entity");
const quantityUnits_entity_1 = require("../quantityUnits/entities/quantityUnits.entity");
const quantityUnits_service_1 = require("../quantityUnits/quantityUnits.service");
let ShoppingListService = class ShoppingListService {
    constructor(usersService, dataSource, sessionsService, productService, quantityService) {
        this.usersService = usersService;
        this.dataSource = dataSource;
        this.sessionsService = sessionsService;
        this.productService = productService;
        this.quantityService = quantityService;
    }
    async getItemByDate({ date, request, }) {
        try {
            const convertedDate = new Date(date);
            const requestUser = await this.sessionsService.validateAccessToken(request);
            const user = await this.usersService.findUser(requestUser.email);
            if (user) {
                const shoppingList = await this.dataSource
                    .getRepository(shoppinglist_entity_1.ShoppingList)
                    .createQueryBuilder('shoppinglist')
                    .leftJoinAndSelect('shoppinglist.product', 'product')
                    .leftJoinAndSelect('shoppinglist.quantity_unit', 'quantity_unit')
                    .select([
                    "COALESCE(shoppinglist.customProductName, 'Unknown/Ismeretlen') as customProductName",
                    'product.product_name',
                    'product.code as code',
                    'shoppinglist.id',
                    'shoppinglist.quantity as quantity',
                    'shoppinglist.day',
                    'quantity_unit.id as quantityunitid',
                    'quantity_unit.label as quantityUnit',
                    'quantity_unit.en as quantityUnitEn',
                    'quantity_unit.hu as quantityUnitHu',
                ])
                    .where('shoppinglist.day = :day', { day: convertedDate })
                    .andWhere('shoppinglist.user = :userId', { userId: user.id })
                    .getRawMany();
                const returnConvertationData = await this.quantityService.convertToHighest({
                    request,
                    products: shoppingList,
                });
                const convertedQuantityArray = returnConvertationData.data[0];
                const returnProducts = [
                    convertedQuantityArray.reduce((acc, curr) => {
                        acc[curr.code] = acc[curr.code] || [];
                        acc[curr.code].push(curr);
                        return acc;
                    }, {}),
                ];
                return shoppingList.length > 0
                    ? {
                        message: ['Sikeres lekérdezés'],
                        statusCode: 200,
                        data: returnProducts,
                    }
                    : {
                        message: ['Nincs semmi a raktárjában a felhasználónak!'],
                        statusCode: 404,
                        data: shoppingList,
                    };
            }
            else
                return { message: ['Sikertelen lekérdezés'], statusCode: 404 };
        }
        catch {
            return {
                message: ['Hiba történt a lekérdezés során!'],
                statusCode: 401,
            };
        }
    }
    async getItemById({ code, request, }) {
        try {
            const requestUser = await this.sessionsService.validateAccessToken(request);
            const user = await this.usersService.findUser(requestUser.email);
            if (user) {
                const shoppingList = await this.dataSource
                    .getRepository(shoppinglist_entity_1.ShoppingList)
                    .createQueryBuilder('shoppinglist')
                    .leftJoinAndSelect('shoppinglist.product', 'product')
                    .leftJoinAndSelect('shoppinglist.quantity_unit', 'quantity_unit')
                    .select([
                    "COALESCE(shoppinglist.customProductName, 'Unknown/Ismeretlen') as customProductName",
                    'product.product_name as name',
                    'product.code as code',
                    'shoppinglist.id as id',
                    'shoppinglist.quantity as quantity',
                    'shoppinglist.day as day',
                    'quantity_unit.id as quantityunitid',
                    'quantity_unit.label as quantityUnit',
                    'quantity_unit.en as quantityUnitEn',
                    'quantity_unit.hu as quantityUnitHu',
                ])
                    .where('product.code = :code', { code: code })
                    .andWhere('shoppinglist.user = :userId', { userId: user.id })
                    .orderBy('shoppinglist.day, quantity_unit.id, shoppinglist.quantity')
                    .getRawMany();
                console.log(shoppingList);
                return shoppingList.length > 0
                    ? {
                        message: ['Sikeres lekérdezés'],
                        statusCode: 200,
                        data: shoppingList,
                    }
                    : {
                        message: ['Nincs semmi a raktárjában a felhasználónak!'],
                        statusCode: 404,
                        data: shoppingList,
                    };
            }
            else
                return { message: ['Sikertelen lekérdezés'], statusCode: 404 };
        }
        catch {
            return {
                message: ['Hiba történt a lekérdezés során!'],
                statusCode: 401,
            };
        }
    }
    async getItemNow({ query, request, }) {
        try {
            const requestUser = await this.sessionsService.validateAccessToken(request);
            const user = await this.usersService.findUser(requestUser.email);
            const shoppingList = await this.dataSource
                .getRepository(shoppinglist_entity_1.ShoppingList)
                .createQueryBuilder('shoppinglist')
                .leftJoinAndSelect('shoppinglist.product', 'product')
                .leftJoinAndSelect('shoppinglist.quantity_unit', 'quantity_unit')
                .select([
                "COALESCE(shoppinglist.customProductName, 'Unknown/Ismeretlen') as customProductName",
                'product.product_name',
                'product.product_quantity_unit',
                'shoppinglist.id',
                'shoppinglist.quantity',
                'shoppinglist.quantity_unit',
                'shoppinglist.day',
                'quantity_unit.label as quantityUnit',
                'quantity_unit.en as quantityUnitEn',
                'quantity_unit.hu as quantityUnitHu',
            ])
                .where({
                day: (0, typeorm_1.Equal)(new Date()),
                user: user,
            });
            if (query.length > 0) {
                shoppingList.andWhere('LOWER(product.product_name) LIKE :query OR LOWER(shoppinglist.customProductName) LIKE :query', {
                    query: `%${query.toLowerCase()}%`,
                });
            }
            const result = await shoppingList.getRawMany();
            if (result.length > 0) {
                return result;
            }
            else {
                return {
                    message: ['Nincs felvitt item-e a felhasználónak!'],
                    statusCode: 401,
                };
            }
        }
        catch {
            return {
                message: ['Hiba történt a lekérdezés során!'],
                statusCode: 401,
            };
        }
    }
    async getItemDates({ request, }) {
        try {
            const requestUser = await this.sessionsService.validateAccessToken(request);
            const user = await this.usersService.findUser(requestUser.email);
            const dates = await this.dataSource
                .getRepository(shoppinglist_entity_1.ShoppingList)
                .createQueryBuilder('shoppinglist')
                .select('shoppinglist.day', 'day')
                .where('shoppinglist.user = :userId', { userId: user.id })
                .andWhere('shoppinglist.day >= :today', { today: new Date() })
                .groupBy('shoppinglist.day')
                .getRawMany();
            if (dates.length > 0) {
                return [
                    ...dates.map((date) => {
                        return new Date(date.day);
                    }),
                ];
            }
            else {
                return {
                    message: ['Nincs felvitt item-e a felhasználónak!'],
                    statusCode: 401,
                };
            }
        }
        catch {
            return {
                message: ['Hiba történt a lekérdezés során!'],
                statusCode: 401,
            };
        }
    }
    async createItem({ request, data, }) {
        try {
            const convertedDate = new Date(data.day);
            if (!data.code && !data.product_name)
                throw new Error('Kérem adja meg legalább a nevét vagy a kódját');
            if (data.quantity <= 0)
                throw new Error('A mennyiségnek legalább 1 kell lennie');
            const today = new Date();
            const convertedDateOnly = new Date(convertedDate.getFullYear(), convertedDate.getMonth(), convertedDate.getDate());
            const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            if (convertedDateOnly < todayOnly)
                throw new Error('A dátum nem lehet a múltba!');
            const requestUser = await this.sessionsService.validateAccessToken(request);
            const user = await this.usersService.findUser(requestUser.email);
            let product = null;
            if (data.code) {
                product = await this.productService.getItemById(data.code);
            }
            else {
                const productByName = await this.productService.getItemByKeyword(data.product_name);
                if (productByName.length > 0)
                    product = productByName[0];
            }
            const quantityUnit = await this.dataSource
                .getRepository(quantityUnits_entity_1.QuantityUnits)
                .createQueryBuilder('quantity_unit')
                .select()
                .whereInIds(data.quantity_unit || 1)
                .getOne();
            await this.dataSource
                .createQueryBuilder()
                .insert()
                .into(shoppinglist_entity_1.ShoppingList)
                .values({
                user: user,
                product: product ? product : null,
                customProductName: product ? null : data.product_name,
                quantity: data.quantity,
                quantity_unit: quantityUnit,
                day: convertedDate,
            })
                .execute();
            return {
                message: [
                    `Sikeresen létrehozva a/az ${product ? product.name : data.product_name}!`,
                ],
                statusCode: 200,
            };
        }
        catch (error) {
            return {
                message: ['Hiba történt a létrehozás során! ' + error],
                statusCode: 401,
            };
        }
    }
    async removeItem({ id, request, body, }) {
        try {
            const requestUser = await this.sessionsService.validateAccessToken(request);
            const user = await this.usersService.findUser(requestUser.email);
            const haveThisItem = await this.dataSource
                .getRepository(shoppinglist_entity_1.ShoppingList)
                .createQueryBuilder('shoppinglist')
                .select([
                'shoppinglist.id',
                'shoppinglist.quantity',
                'shoppinglist.user',
            ])
                .where('shoppinglist.id = :id', { id: id })
                .andWhere('shoppinglist.user = :userId', { userId: user.id })
                .getOne();
            if (haveThisItem) {
                if (haveThisItem.quantity <= body.quantity) {
                    await this.dataSource
                        .createQueryBuilder()
                        .delete()
                        .from(shoppinglist_entity_1.ShoppingList)
                        .where('id = :id', { id: id })
                        .andWhere('user = :userId', { userId: user.id })
                        .execute();
                }
                else {
                    await this.dataSource
                        .createQueryBuilder()
                        .update(shoppinglist_entity_1.ShoppingList)
                        .set({ quantity: haveThisItem.quantity - body.quantity })
                        .where('id = :id', { id: id })
                        .andWhere('user = :userId', { userId: user.id })
                        .execute();
                }
                return {
                    message: ['Sikeres törlés'],
                    statusCode: 200,
                };
            }
            else {
                return {
                    message: ['Nem található ilyen item'],
                    statusCode: 401,
                };
            }
        }
        catch (error) {
            return {
                message: ['Hiba történt a létrehozás során! ' + error],
                statusCode: 401,
            };
        }
    }
};
exports.ShoppingListService = ShoppingListService;
exports.ShoppingListService = ShoppingListService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        typeorm_1.DataSource,
        sessions_service_1.SessionService,
        product_service_1.ProductService,
        quantityUnits_service_1.QuantityUnitsService])
], ShoppingListService);
//# sourceMappingURL=shoppinglist.service.js.map
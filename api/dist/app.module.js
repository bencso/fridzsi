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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const nestjs_pino_1 = require("nestjs-pino");
const sessions_controller_1 = require("./sessions/sessions.controller");
const sessions_service_1 = require("./sessions/sessions.service");
const users_service_1 = require("./users/users.service");
const users_controller_1 = require("./users/users.controller");
const product_controller_1 = require("./product/product.controller");
const product_service_1 = require("./product/product.service");
const pantry_controller_1 = require("./pantry/pantry.controller");
const pantry_service_1 = require("./pantry/pantry.service");
const shoppinglist_service_1 = require("./shoppinglist/shoppinglist.service");
const shoppinglist_controller_1 = require("./shoppinglist/shoppinglist.controller");
const quantityUnits_entity_1 = require("./quantityUnits/entities/quantityUnits.entity");
const quantityUnits_controller_1 = require("./quantityUnits/quantityUnits.controller");
const seedQuantityUnits_service_1 = require("./quantityUnits/seedQuantityUnits.service");
let AppModule = class AppModule {
    constructor(quantityUnitsSeed) {
        this.quantityUnitsSeed = quantityUnitsSeed;
    }
    async onModuleInit() {
        await this.quantityUnitsSeed.seedQuantityUnits();
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_pino_1.LoggerModule.forRoot(),
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST,
                port: +process.env.DB_PORT,
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
                synchronize: true,
                logging: true,
            }),
            auth_module_1.AuthModule,
            typeorm_1.TypeOrmModule.forFeature([quantityUnits_entity_1.QuantityUnits]),
        ],
        controllers: [
            app_controller_1.AppController,
            sessions_controller_1.SessionsController,
            users_controller_1.UsersController,
            product_controller_1.ProductController,
            pantry_controller_1.PantryController,
            shoppinglist_controller_1.ShoppingListController,
            quantityUnits_controller_1.QuantityUnitsController,
        ],
        providers: [
            app_service_1.AppService,
            sessions_service_1.SessionService,
            users_service_1.UsersService,
            product_service_1.ProductService,
            pantry_service_1.PantryService,
            shoppinglist_service_1.ShoppingListService,
            seedQuantityUnits_service_1.QuantityUnitsSeedService,
        ],
        exports: [typeorm_1.TypeOrmModule],
    }),
    __metadata("design:paramtypes", [seedQuantityUnits_service_1.QuantityUnitsSeedService])
], AppModule);
//# sourceMappingURL=app.module.js.map
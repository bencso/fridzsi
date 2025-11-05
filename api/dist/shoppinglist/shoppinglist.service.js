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
let ShoppingListService = class ShoppingListService {
    constructor(usersService, dataSource, sessionsService, productService) {
        this.usersService = usersService;
        this.dataSource = dataSource;
        this.sessionsService = sessionsService;
        this.productService = productService;
    }
};
exports.ShoppingListService = ShoppingListService;
exports.ShoppingListService = ShoppingListService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        typeorm_1.DataSource,
        sessions_service_1.SessionService,
        product_service_1.ProductService])
], ShoppingListService);
//# sourceMappingURL=shoppinglist.service.js.map
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
exports.ShoppingListController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../auth/auth.guard");
const shoppinglist_service_1 = require("./shoppinglist.service");
const create_shoppinglist_item_dto_1 = require("./dto/create-shoppinglist-item.dto");
let ShoppingListController = class ShoppingListController {
    constructor(shoppinglistService) {
        this.shoppinglistService = shoppinglistService;
    }
    async getItemByDate(date, request) {
        return this.shoppinglistService.getItemByDate({
            date: date,
            request: request,
        });
    }
    async getItemById(code, request) {
        return this.shoppinglistService.getItemById({
            code: code,
            request: request,
        });
    }
    async getItemNow(request) {
        return this.shoppinglistService.getItemNow({
            query: '',
            request: request,
        });
    }
    async getItemNowWithQuery(query, request) {
        return this.shoppinglistService.getItemNow({
            query,
            request: request,
        });
    }
    async getItemDates(request) {
        return this.shoppinglistService.getItemDates({
            request: request,
        });
    }
    async createItem(data, request) {
        return this.shoppinglistService.createItem({ request, data });
    }
    async editItem(id, data, request) {
        return this.shoppinglistService.editItem({
            request,
            id,
            quantity: data.quantity,
            quantityUnitId: data.quantityunitId,
        });
    }
    async removeItem(ids, request) {
        return this.shoppinglistService.removeItem({
            request,
            ids,
        });
    }
};
exports.ShoppingListController = ShoppingListController;
__decorate([
    (0, common_1.Get)('/items/date/:date'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('date')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ShoppingListController.prototype, "getItemByDate", null);
__decorate([
    (0, common_1.Get)('/items/code/:code'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ShoppingListController.prototype, "getItemById", null);
__decorate([
    (0, common_1.Get)('/items/now'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShoppingListController.prototype, "getItemNow", null);
__decorate([
    (0, common_1.Get)('/items/now/:q'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('q')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ShoppingListController.prototype, "getItemNowWithQuery", null);
__decorate([
    (0, common_1.Get)('/items/dates'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShoppingListController.prototype, "getItemDates", null);
__decorate([
    (0, common_1.Post)('/items/create'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_shoppinglist_item_dto_1.CreateShoppingListItemDto, Object]),
    __metadata("design:returntype", Promise)
], ShoppingListController.prototype, "createItem", null);
__decorate([
    (0, common_1.Post)('/items/edit/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ShoppingListController.prototype, "editItem", null);
__decorate([
    (0, common_1.Post)('/items/remove/:ids'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('ids', new common_1.ParseArrayPipe({ items: Number, separator: ',' }))),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], ShoppingListController.prototype, "removeItem", null);
exports.ShoppingListController = ShoppingListController = __decorate([
    (0, common_1.Controller)('shoppinglist'),
    __metadata("design:paramtypes", [shoppinglist_service_1.ShoppingListService])
], ShoppingListController);
//# sourceMappingURL=shoppinglist.controller.js.map
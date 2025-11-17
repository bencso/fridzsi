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
exports.PantryController = void 0;
const common_1 = require("@nestjs/common");
const pantry_service_1 = require("./pantry.service");
const create_pantry_item_dto_1 = require("./dto/create-pantry-item.dto");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../auth/auth.guard");
let PantryController = class PantryController {
    constructor(pantryService) {
        this.pantryService = pantryService;
    }
    create(request, createPantryItemDto) {
        return this.pantryService.create(request, createPantryItemDto);
    }
    getUserPantry(request) {
        return this.pantryService.getUserPantry(request);
    }
    getUserPantryItemByCode(request, code) {
        return this.pantryService.getUserPantryItemByCode(request, code);
    }
    edit(request, id, quantity) {
        return this.pantryService.edit(request, id, quantity);
    }
    remove(request, id) {
        return this.pantryService.remove(request, id);
    }
};
exports.PantryController = PantryController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_pantry_item_dto_1.CreatePantryItemDto]),
    __metadata("design:returntype", void 0)
], PantryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], PantryController.prototype, "getUserPantry", null);
__decorate([
    (0, common_1.Get)('/:code'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Object)
], PantryController.prototype, "getUserPantryItemByCode", null);
__decorate([
    (0, common_1.Post)('/edit/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('quantity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", void 0)
], PantryController.prototype, "edit", null);
__decorate([
    (0, common_1.Post)('/delete'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", void 0)
], PantryController.prototype, "remove", null);
exports.PantryController = PantryController = __decorate([
    (0, common_1.Controller)('pantry'),
    __metadata("design:paramtypes", [pantry_service_1.PantryService])
], PantryController);
//# sourceMappingURL=pantry.controller.js.map
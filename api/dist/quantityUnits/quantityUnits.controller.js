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
exports.QuantityUnitsController = void 0;
const common_1 = require("@nestjs/common");
const quantityUnits_service_1 = require("./quantityUnits.service");
let QuantityUnitsController = class QuantityUnitsController {
    constructor(quantityUnitsService) {
        this.quantityUnitsService = quantityUnitsService;
    }
    async getUnits() {
        return await this.quantityUnitsService.findAll();
    }
    async getTest() {
        return await this.quantityUnitsService.convertToHighest();
    }
};
exports.QuantityUnitsController = QuantityUnitsController;
__decorate([
    (0, common_1.Get)('/quantityTypes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QuantityUnitsController.prototype, "getUnits", null);
__decorate([
    (0, common_1.Get)('/quantityTypesTest'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QuantityUnitsController.prototype, "getTest", null);
exports.QuantityUnitsController = QuantityUnitsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [quantityUnits_service_1.QuantityUnitsService])
], QuantityUnitsController);
//# sourceMappingURL=quantityUnits.controller.js.map
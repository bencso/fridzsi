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
const quantityUnits_entity_1 = require("./entities/quantityUnits.entity");
const typeorm_1 = require("typeorm");
let QuantityUnitsController = class QuantityUnitsController {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async getUnits() {
        return (await this.dataSource.getRepository(quantityUnits_entity_1.QuantityUnits).find()) || [];
    }
};
exports.QuantityUnitsController = QuantityUnitsController;
__decorate([
    (0, common_1.Get)('/quantityTypes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QuantityUnitsController.prototype, "getUnits", null);
exports.QuantityUnitsController = QuantityUnitsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], QuantityUnitsController);
//# sourceMappingURL=quantityUnits.controller.js.map
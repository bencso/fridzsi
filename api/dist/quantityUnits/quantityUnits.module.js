"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuantityUnitsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const quantityUnits_entity_1 = require("./entities/quantityUnits.entity");
const quantityUnits_service_1 = require("./quantityUnits.service");
const quantityUnits_controller_1 = require("./quantityUnits.controller");
let QuantityUnitsModule = class QuantityUnitsModule {
};
exports.QuantityUnitsModule = QuantityUnitsModule;
exports.QuantityUnitsModule = QuantityUnitsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([quantityUnits_entity_1.QuantityUnits])],
        controllers: [quantityUnits_controller_1.QuantityUnitsController],
        providers: [quantityUnits_service_1.QuantityUnitsService],
        exports: [quantityUnits_service_1.QuantityUnitsService],
    })
], QuantityUnitsModule);
//# sourceMappingURL=quantityUnits.module.js.map
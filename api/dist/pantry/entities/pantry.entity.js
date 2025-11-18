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
exports.Pantry = void 0;
const class_validator_1 = require("class-validator");
const product_entity_1 = require("../../product/entities/product.entity");
const quantityUnits_entity_1 = require("../../quantityUnits/entities/quantityUnits.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const typeorm_1 = require("typeorm");
let Pantry = class Pantry {
};
exports.Pantry = Pantry;
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, {
        cascade: true,
    }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", user_entity_1.User)
], Pantry.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Pantry.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, {
        cascade: true,
    }),
    __metadata("design:type", product_entity_1.Product)
], Pantry.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        default: 1,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], Pantry.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => quantityUnits_entity_1.QuantityUnits, {
        cascade: true,
    }),
    __metadata("design:type", quantityUnits_entity_1.QuantityUnits)
], Pantry.prototype, "quantity_unit", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'date',
        default: () => "CURRENT_DATE + INTERVAL '1 week'",
    }),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.MinDate)(new Date()),
    __metadata("design:type", Date)
], Pantry.prototype, "expiredAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Pantry.prototype, "createdAt", void 0);
exports.Pantry = Pantry = __decorate([
    (0, typeorm_1.Entity)({ name: 'pantry' })
], Pantry);
//# sourceMappingURL=pantry.entity.js.map
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
exports.quantityTypes = exports.QuantityUnits = void 0;
const typeorm_1 = require("typeorm");
let QuantityUnits = class QuantityUnits {
};
exports.QuantityUnits = QuantityUnits;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    (0, typeorm_1.JoinColumn)({ name: 'quantityUnitId' }),
    __metadata("design:type", String)
], QuantityUnits.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        nullable: true,
    }),
    __metadata("design:type", String)
], QuantityUnits.prototype, "label", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], QuantityUnits.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], QuantityUnits.prototype, "en", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], QuantityUnits.prototype, "hu", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], QuantityUnits.prototype, "baseUnit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], QuantityUnits.prototype, "multiplyToBase", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], QuantityUnits.prototype, "biggerUnit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], QuantityUnits.prototype, "divideToBigger", void 0);
exports.QuantityUnits = QuantityUnits = __decorate([
    (0, typeorm_1.Entity)({ name: 'quantity_units' })
], QuantityUnits);
exports.quantityTypes = [
    {
        category: 'mass',
        label: 'g',
        en: 'gram',
        hu: 'gramm',
        baseUnit: null,
        multiplyToBase: 1,
        biggerUnit: 'dkg',
        divideToBigger: 10,
    },
    {
        category: 'mass',
        label: 'dkg',
        en: 'decagram',
        hu: 'dekagramm',
        baseUnit: 'g',
        multiplyToBase: 10,
        biggerUnit: 'kg',
        divideToBigger: 100,
    },
    {
        category: 'mass',
        label: 'kg',
        en: 'kilogram',
        hu: 'kilogramm',
        baseUnit: 'g',
        multiplyToBase: 1000,
        biggerUnit: null,
        divideToBigger: null,
    },
    {
        category: 'volume',
        label: 'ml',
        en: 'milliliter',
        hu: 'milliliter',
        baseUnit: null,
        multiplyToBase: 1,
        biggerUnit: 'cl',
        divideToBigger: 10,
    },
    {
        category: 'volume',
        label: 'cl',
        en: 'centiliter',
        hu: 'centiliter',
        baseUnit: 'ml',
        multiplyToBase: 10,
        biggerUnit: 'dl',
        divideToBigger: 10,
    },
    {
        category: 'volume',
        label: 'dl',
        en: 'deciliter',
        hu: 'deciliter',
        baseUnit: 'ml',
        multiplyToBase: 100,
        biggerUnit: 'l',
        divideToBigger: 10,
    },
    {
        category: 'volume',
        label: 'l',
        en: 'liter',
        hu: 'liter',
        baseUnit: 'ml',
        multiplyToBase: 1000,
        biggerUnit: null,
        divideToBigger: null,
    },
    {
        category: 'utensil',
        label: 'kávéskanál',
        en: 'coffee spoon',
        hu: 'kávéskanál',
        baseUnit: 'ml',
        multiplyToBase: 2.5,
        biggerUnit: 'tk',
        divideToBigger: 2,
    },
    {
        category: 'utensil',
        label: 'tk',
        en: 'teaspoon',
        hu: 'teáskanál',
        baseUnit: 'ml',
        multiplyToBase: 5,
        biggerUnit: 'ek',
        divideToBigger: 3,
    },
    {
        category: 'utensil',
        label: 'ek',
        en: 'tablespoon',
        hu: 'evőkanál',
        baseUnit: 'ml',
        multiplyToBase: 15,
        biggerUnit: 'csésze',
        divideToBigger: 16,
    },
    {
        category: 'utensil',
        label: 'csipet',
        en: 'pinch',
        hu: 'csipet',
        baseUnit: 'ml',
        multiplyToBase: 0.5,
        biggerUnit: 'kávéskanál',
        divideToBigger: 5,
    },
    {
        category: 'utensil',
        label: 'csésze',
        en: 'cup',
        hu: 'csésze',
        baseUnit: 'ml',
        multiplyToBase: 240,
        biggerUnit: null,
        divideToBigger: null,
    },
];
//# sourceMappingURL=quantityUnits.entity.js.map
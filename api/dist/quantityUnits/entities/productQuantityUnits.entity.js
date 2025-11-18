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
exports.seedQuantityUnits = seedQuantityUnits;
const typeorm_1 = require("typeorm");
let QuantityUnits = class QuantityUnits {
};
exports.QuantityUnits = QuantityUnits;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
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
], QuantityUnits.prototype, "en", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], QuantityUnits.prototype, "hu", void 0);
exports.QuantityUnits = QuantityUnits = __decorate([
    (0, typeorm_1.Entity)({ name: 'quantity_units' })
], QuantityUnits);
exports.quantityTypes = [
    { label: 'db', en: 'piece', hu: 'darab' },
    { label: 'g', en: 'gram', hu: 'gramm' },
    { label: 'kg', en: 'kilogram', hu: 'kilogramm' },
    { label: 'dl', en: 'deciliter', hu: 'deciliter' },
    { label: 'ml', en: 'milliliter', hu: 'milliliter' },
    { label: 'l', en: 'liter', hu: 'liter' },
    { label: 'csomag', en: 'package', hu: 'csomag' },
    { label: 'üveg', en: 'bottle', hu: 'üveg' },
    { label: 'doboz', en: 'can', hu: 'doboz' },
    { label: 'zacskó', en: 'bag', hu: 'zacskó' },
    { label: 'karton', en: 'box', hu: 'karton' },
    { label: 'csokor', en: 'bunch', hu: 'csokor' },
    { label: 'szelet', en: 'slice', hu: 'szelet' },
];
async function seedQuantityUnits(dataSource) {
    const repository = dataSource.getRepository(QuantityUnits);
    const existingCount = await repository.count();
    if (existingCount > 0) {
        return;
    }
    const entities = exports.quantityTypes.map((type) => repository.create(type));
    await repository.save(entities);
}
//# sourceMappingURL=productQuantityUnits.entity.js.map
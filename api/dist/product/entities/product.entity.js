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
exports.Product = void 0;
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
let Product = class Product {
};
exports.Product = Product;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", String)
], Product.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, unique: true }),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], Product.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, class_validator_1.MinLength)(5),
    __metadata("design:type", String)
], Product.prototype, "product_name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        nullable: true,
    }),
    __metadata("design:type", String)
], Product.prototype, "brands", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'integer',
        nullable: true,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], Product.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        nullable: true,
        default: 'kg',
    }),
    __metadata("design:type", String)
], Product.prototype, "quantity_metric", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        nullable: true,
    }),
    __metadata("design:type", String)
], Product.prototype, "categories", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        nullable: true,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", String)
], Product.prototype, "serving_size", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Product.prototype, "energy_kcal_100g", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Product.prototype, "fat_100g", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Product.prototype, "saturated_fat_100g", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Product.prototype, "carbohydrates_100g", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Product.prototype, "sugars_100g", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Product.prototype, "fiber_100g", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Product.prototype, "proteins_100g", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Product.prototype, "salt_100g", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], Product.prototype, "image_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "ingredients_text", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)({ name: 'prorduct' })
], Product);
//# sourceMappingURL=product.entity.js.map
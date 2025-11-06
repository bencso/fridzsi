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
exports.CreateShoppingListItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateShoppingListItemDto {
}
exports.CreateShoppingListItemDto = CreateShoppingListItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], CreateShoppingListItemDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], CreateShoppingListItemDto.prototype, "product_name", void 0);
__decorate([
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({ type: Number, minimum: 1, default: 1 }),
    __metadata("design:type", Number)
], CreateShoppingListItemDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: Date,
        format: 'date',
        required: false,
        default: new Date().toISOString().split('T')[0],
    }),
    __metadata("design:type", Date)
], CreateShoppingListItemDto.prototype, "day", void 0);
//# sourceMappingURL=create-shoppinglist-item.dto.js.map
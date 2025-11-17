export class ProductDto {
  code: string;
  product_name: string;
  brands?: string;
  quantity?: number;
  product_quantity_unit?: string;
  categories?: string;
  serving_size?: string;
  energy_kcal_100g?: number;
  fat_100g?: number;
  saturated_fat_100g?: number;
  carbohydrates_100g?: number;
  sugars_100g?: number;
  fiber_100g?: number;
  proteins_100g?: number;
  salt_100g?: number;
  image_url?: string;
  ingredients_text?: string;
}

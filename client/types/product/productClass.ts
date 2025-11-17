import api from "@/interceptor/api";

export interface quantityTypesParams {
  label: string;
  en: string;
  hu: string;
}

export interface ProductParams {
  code?: string;
  id?: string;
  product_name?: string;
  quantity?: number;
  product_quantity_unit?: string;
}

export class Product {
  private id: string;
  private code: string;
  private product_name: string;
  private quantity: number;
  private product_quantity_unit: string;

  constructor(params: ProductParams) {
    this.code = params.code || "";
    this.id = params.id || "";
    this.product_name = params.product_name || "";
    this.quantity = params.quantity || 1;
    this.product_quantity_unit = params.product_quantity_unit || "";
  }

  getProductMainInfo() {
    return {
      id: this.id,
      code: this.code,
      name: this.product_name,
      quantity: this.quantity,
      product_quantity_unit: this.product_quantity_unit,
    };
  }
}

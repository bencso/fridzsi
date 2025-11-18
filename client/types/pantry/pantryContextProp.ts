import { Product } from "@/constants/product.interface";
import { PantryType } from "./pantryType";
import { quantityTypeProp } from "../shoppinglist/quantityTypeProp";

export type PantryContextProp = {
  pantry: PantryType[];
  loadPantry: any;
  addPantryItem: any;
  deletePantryItem: any;
  editPantryItem: any;
  isLoading: boolean;
  product: Product | null;
  setProductItemByCode: any;
  searchProductByKeyword: any;
  scanned: boolean;
  setScanned: any;
  setProduct: any;
  getItemsById: (code: number) => Promise<any | null>;
  quantityTypes: quantityTypeProp[];
  loadQuantityTypes: () => Promise<any | null>;
};

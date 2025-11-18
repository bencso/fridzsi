import { ShoppingListItem } from "./noteClass";

export type ShoppingListContextProp = {
  shoppingList: ShoppingListItem[];
  getFirstDate: Promise<void> | any;
  getItemByDate: Promise<void> | any;
  selectedDay:
    | {
        date: Date;
      }
    | undefined;
  setSelectedDay: React.Dispatch<
    React.SetStateAction<
      | {
          date: Date;
        }
      | undefined
    >
  >;
  getItemDates: Promise<void> | any;
  shoppingListDays:
    | {
        date: Date;
      }[]
    | undefined;
  setShoppingListDays: React.Dispatch<
    React.SetStateAction<
      | {
          date: Date;
        }[]
    >
  >;
  changeDateItem: Promise<void> | any;
  deleteItem: Promise<void> | any;
addNewShoppingItem: (params: {
  day: Date;
  product_name?: string | null;
  quantity: number;
  quantity_unit: number;
  code?: string | null;
}) => Promise<void | string>;
getNowList: (params: {q?:string| null}) => Promise<any>
};

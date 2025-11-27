import { Dispatch, SetStateAction } from "react";

export type ModalProp = {
  id?: number;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  type: "pantry" | "shoppinglist";
};

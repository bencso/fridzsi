import { Dispatch, SetStateAction } from "react";

export type ModalProp = {
  id: string|number;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>> ;
  type: "pantry" | "shoppinglist";
};

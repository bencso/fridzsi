import { Dispatch, SetStateAction } from "react";

export type ModalProp = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}
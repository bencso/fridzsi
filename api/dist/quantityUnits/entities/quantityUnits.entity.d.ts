export interface quantityTypesParams {
    label: string;
    en: string;
    hu: string;
    baseUnit: string | null;
    multiplyToBase: number;
    biggerUnit: string | null;
    divideToBigger: number;
    category?: string | null;
}
export declare class QuantityUnits {
    id: string;
    label: string;
    category: string;
    en: string;
    hu: string;
    baseUnit: string | null;
    multiplyToBase: number;
    biggerUnit: string | null;
    divideToBigger: number;
}
export declare const quantityTypes: quantityTypesParams[];

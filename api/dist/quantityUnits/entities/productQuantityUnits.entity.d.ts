import { DataSource } from 'typeorm';
export interface quantityTypesParams {
    label: string;
    en: string;
    hu: string;
}
export declare class QuantityUnits {
    id: string;
    label: string;
    en: string;
    hu: string;
}
export declare const quantityTypes: quantityTypesParams[];
export declare function seedQuantityUnits(dataSource: DataSource): Promise<void>;

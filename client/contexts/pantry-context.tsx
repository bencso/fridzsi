import api from "@/interceptor/api";
import { addItem, deleteItem, editItem, getItems } from "@/libs/inventory";
import React, {
    createContext,
    ReactNode,
    useContext,
    useState,
} from "react";
import { Product } from "@/constants/product.interface"
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { PantryContextProp } from "@/types/pantry/pantryContextProp";
import { PantryType } from "@/types/pantry/pantryType";
import { quantityTypeProp } from "@/types/shoppinglist/quantityTypeProp";

const PantryContext = createContext<PantryContextProp | undefined>(undefined);

export function PantryProvider({ children }: { children: ReactNode }) {
    const [pantry, setPantry] = useState<PantryType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [scanned, setScanned] = useState<boolean>(false);
    const [product, setProduct] = useState<Product | null>(null);
    const [quantityTypes, setQuantityTypes] = useState<quantityTypeProp[]>([]);
    const { t } = useTranslation();

    const loadQuantityTypes = async (): Promise<any | null> => {
        try {
            const response = await api.get("/quantityTypes");
            const data = response.data;
            if (!data.statusCode && Array.isArray(data)) {
                console.log(data);
                let quantitytypes = [] as quantityTypeProp[];
                data.map((item) => {
                    quantitytypes.push({
                        ...item
                    } as quantityTypeProp);
                });
                setQuantityTypes(quantitytypes);
                return quantityTypes;
            }
        } catch {
            return null;
        }
    }

    //TODO: Késöbb átültetni backendre, illetve mértékegységekkel való játszadozás
    const loadPantry = async (): Promise<any | null> => {
        try {
            let returnItems = [] as PantryType[];
            const pantryItems = await getItems();

            pantryItems.map((item: any) => {
                console.log(item);
                Object.keys(item).forEach((key) => {
                    const dateMap: Record<string, { converted_quantity: number; quantityUnit: string; }> = {};
                    item[key].forEach((product: Product) => {
                        const date = product.expiredat ? new Date(product.expiredat).toLocaleDateString() : new Date().toLocaleDateString();
                        dateMap[date] = { converted_quantity: (dateMap[date]?.converted_quantity || 0) + Number(product.converted_quantity), quantityUnit: product.quantityunit ?? "" };
                    });


                    returnItems.push({
                        code: key,
                        products: item[key].map((product: Product) => ({
                            index: product.index,
                            quantity: product.quantity,
                            expiredAt: product.expiredat,
                            quantityUnit: product.quantityunit
                        })),
                        name: item[key][0].name,
                        expiredAt: Object.keys(dateMap),
                        quantity: Object.values(dateMap).flatMap((test) => { return test.converted_quantity }),
                        quantityUnit: Object.values(dateMap).flatMap((test) => { return test.quantityUnit }),
                    });
                });
            });
            setPantry(returnItems || []);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const getItemsById = async (code: number): Promise<any | null> => {
        try {
            const response = await api.get("/pantry/" + code);
            const item = response.data;
            return item;
        } catch {
            return null
        }
        finally {
            setIsLoading(false);
        }
    }

    const setProductItemByCode = async (code: string) => {
        try {
            const response = await api.get("/product/items/code/" + code);
            const item = response.data;
            if (!item.code && !item.product_name) throw new Error("Nincs ilyen termék");
            setProduct({
                code: item.code,
                name: item.product_name ? item.product_name : null,
            });
        } catch {
            if (code) setProduct({
                code: code,
                name: null
            })
            else setProduct(null)
        }
        finally {
            setIsLoading(false);
        }
    }

    const searchProductByKeyword = async (keyword: string) => {
        try {
            const response = await api.get("/product/items/keyword/" + keyword);
            const item = response.data;
            return item;
        } catch {
            return null;
        }
        finally {
            setIsLoading(false);
        }
    }

    const addPantryItem = async ({
        code,
        product_name,
        quantity,
        expiredAt,
        quantityUnit
    }: {
        code: string;
        product_name: string;
        quantity: number;
        expiredAt: Date;
        quantityUnit: number;
    }) => {
        try {
            await addItem({
                code,
                product_name,
                quantity,
                expiredAt,
                quanity_units: quantityUnit
            });
        } catch {
            Alert.alert(t("inventory.addPantryItem.error"), t("inventory.addPantryItemitItem.errorTitle"));
        } finally {
            setScanned(false);
            loadPantry();
            setIsLoading(false);
        }
    }

    const deletePantryItem = async ({
        id
    }: {
        id: number[]
    }) => {
        try {
            await deleteItem({
                id
            });
        } catch {
            Alert.alert(t("inventory.deleteItem.error"), t("inventory.deleteItem.errorTitle"));
        } finally {
            setIsLoading(false);
        }
    }

    const editPantryItem = async ({
        id,
        quantity
    }: {
        id: number;
        quantity: number;
    }) => {
        try {
            await editItem({
                id,
                quantity
            });
        } catch {
            Alert.alert(t("inventory.editItem.quantityInput.error"), t("inventory.editItem.quantityInput.errorTitle"));
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <PantryContext.Provider value={{ pantry, loadPantry, isLoading, addPantryItem, deletePantryItem, product, getItemsById, setProductItemByCode, searchProductByKeyword, scanned, setScanned, setProduct, editPantryItem, loadQuantityTypes, quantityTypes }}>
            {children}
        </PantryContext.Provider>
    );
}

export function usePantry() {
    const context = useContext(PantryContext);
    if (!context) {
        throw new Error("usePantry must be used within a PantryProvider");
    }
    return context;
}

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
import { PantryContextProp } from "@/types/pantryContextProp";
import { PantryType } from "@/types/pantryType";

const PantryContext = createContext<PantryContextProp | undefined>(undefined);

export function PantryProvider({ children }: { children: ReactNode }) {
    const [pantry, setPantry] = useState<PantryType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [scanned, setScanned] = useState<boolean>(false);
    const [product, setProduct] = useState<Product | null>(null);
    const { t } = useTranslation();

    const loadPantry = async () => {
        try {
            let returnItems = [] as PantryType[];
            const pantryItems = await getItems();

            pantryItems.map((item: any) => {
                Object.keys(item).forEach((key) => {
                    const dateMap: Record<string, number> = {};
                    item[key].forEach((product: Product) => {
                        const date = product.expiredat ? new Date(product.expiredat).toLocaleDateString() : new Date().toLocaleDateString();
                        dateMap[date] = (dateMap[date] || 0) + Number(product.amount);
                    });

                    returnItems.push({
                        code: key,
                        products: item[key].map((product: Product) => ({
                            index: product.index,
                            amount: product.amount,
                            expiredAt: product.expiredat
                        })),
                        name: item[key][0].name,
                        expiredAt: Object.keys(dateMap),
                        amount: Object.values(dateMap),
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
        amount,
        expiredAt,
    }: {
        code: string;
        product_name: string;
        amount: number;
        expiredAt: Date;
    }) => {
        try {
            await addItem({
                code,
                product_name,
                amount,
                expiredAt,
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
        amount
    }: {
        id: number;
        amount: number;
    }) => {
        try {
            await editItem({
                id,
                amount
            });
        } catch {
            Alert.alert(t("inventory.editItem.amountInput.error"), t("inventory.editItem.amountInput.errorTitle"));
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <PantryContext.Provider value={{ pantry, loadPantry, isLoading, addPantryItem, deletePantryItem, product, getItemsById, setProductItemByCode, searchProductByKeyword, scanned, setScanned, setProduct, editPantryItem }}>
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

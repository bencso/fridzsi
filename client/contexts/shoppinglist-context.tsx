import api from "@/interceptor/api";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { ShoppingListItem } from "@/types/shoppinglist/noteClass";
import { ShoppingListContextProp } from "@/types/shoppinglist/shoppingListContextProp";
import { Product } from "@/constants/product.interface"

const ShoppingListContext = createContext<ShoppingListContextProp | undefined>(undefined);

export function ShoppingListProvider({ children }: { children: ReactNode }) {
    const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
    const [selectedDay, setSelectedDay] = useState<{
        date: Date
    } | undefined>();
    const [shoppingListDays, setShoppingListDays] = useState<{ date: Date; }[]>([]);

    async function getFirstDate(): Promise<void> {
        const response = await api.get("/shoppinglist/items/dates", { withCredentials: true });
        if (response.data && !response.data.message) {
            const date = new Date(response.data[0]);
            changeDateItem({ date });
        }
    }
    async function getItemByDate(): Promise<void> {
        try {
            const response = await api.get(`/shoppinglist/items/date/${selectedDay?.date}`, { withCredentials: true });
            const responseData = response.data.data;

            let returnItems = [] as any[];

            if (responseData) {
                responseData.map((item: any) => {
                    Object.keys(item).forEach((key) => {
                        const dateMap: Record<string, { converted_quantity: number; quantityUnit: string; quantityuniten: string; quantityunithu: string }> = {};
                        item[key].forEach((product: Product) => {
                            const date = product.expiredat ? new Date(product.expiredat).toLocaleDateString() : new Date().toLocaleDateString();
                            dateMap[date] = { converted_quantity: (dateMap[date]?.converted_quantity || 0) + Number(product.converted_quantity), quantityUnit: product.quantityunit ?? "", quantityuniten: product.quantityuniten ?? "", quantityunithu: product.quantityunithu ?? "" };
                        });

                        const data = {
                            code: key,
                            name: item[key][0].product_product_name ? item[key][0].product_product_name : item[key][0].customproductname,
                            expiredAt: Object.keys(dateMap),
                            quantityUnit: Object.values(dateMap).flatMap((test) => { return test.quantityUnit }),
                            quantityUnitHu: Object.values(dateMap).flatMap((test) => { return test.quantityunithu }),
                            quantityUnitEn: Object.values(dateMap).flatMap((test) => { return test.quantityuniten })
                        };

                        Object.values(dateMap).map((test) => {
                            const name = data.name ?? "";
                            const quantityUnit = Array.isArray(data.quantityUnit) ? data.quantityUnit[0] : "";
                            const day = data.expiredAt?.[0] ? new Date(data.expiredAt[0]) : new Date();
                            returnItems.push(new ShoppingListItem(
                                data.code,
                                name,
                                Number(test.converted_quantity).toFixed(3),
                                day,
                                test.quantityuniten,
                                test.quantityunithu,
                                quantityUnit,
                            ));
                        });

                        if (returnItems.length > 0) {
                            setShoppingList(returnItems);
                        } else {
                            setShoppingList([]);
                        }
                    });
                });
            }

        } catch (error) {
            console.error(error);
        }
    }

    async function deleteItem({ ids }: { ids: number[]; }): Promise<void> {
        await api.post(`/shoppinglist/items/remove/${ids.join(",")}`, {}, { withCredentials: true });
        getItemDates();
        getFirstDate();
    }

    async function changeDateItem({ date }: { date: Date }): Promise<void> {
        setSelectedDay((prev) => {
            if (prev?.date !== date)
                return {
                    date: date
                }
            else return prev;
        });
    }

    useEffect(() => {
        getItemByDate()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDay])

    async function getItemDates(): Promise<void> {
        const dateGeneratedItem: { date: Date }[] = [];
        const response = await api.get("/shoppinglist/items/dates", { withCredentials: true });
        if (response.data && !response.data.message) {
            response.data.map((value: string) => {
                const date = new Date(value);
                dateGeneratedItem.push({
                    date: date
                });
                setShoppingListDays(dateGeneratedItem);
            })
        } else {
            setShoppingListDays([]);
            setShoppingList([]);
        }
    }

    async function addNewShoppingItem({
        product_name,
        day,
        quantity,
        code,
        quantity_unit
    }: {
        day: Date;
        product_name?: string | null;
        quantity: number;
        code?: string | null;
        quantity_unit?: number | null;
    }): Promise<void | string> {
        try {
            await api.post("/shoppinglist/items/create", {
                product_name, day, quantity, code, quantity_unit
            }, { withCredentials: true });
            getItemDates();
            getFirstDate();
            getItemByDate();
        }
        catch (error: any) {
            return "Hiba történt létrehozás közben: " + error;
        }
    }

    async function getNowList({ q }: { q?: string | null }) {
        try {
            const response = await api.get("/shoppinglist/items/now/" + (q ?? q), { withCredentials: true });
            return response.data;
        }
        catch (error: any) {
            return "Hiba történt létrehozás közben: " + error;
        }
    }

    async function getItemByCode(code?: string | null) {
        try {
            const response = await api.get("/shoppinglist/items/code/" + code, { withCredentials: true });
            return response.data;
        }
        catch (error: any) {
            return "Hiba történt létrehozás közben: " + error;
        }
    }

    async function getItemById(id?: number | null) {
        try {
            const response = await api.get("/shoppinglist/item/id/" + id, { withCredentials: true });
            return response.data;
        }
        catch (error: any) {
            return "Hiba történt létrehozás közben: " + error;
        }
    }

    async function editItem({ id, quantity, quantityUnitId }: { id?: number | null; quantity?: number; quantityUnitId?: number }) {
        try {
            const response = await api.post("/shoppinglist/items/edit/" + id, {
                quantity,
                quantityUnitId
            }, { withCredentials: true });
            return response.data;
        }
        catch (error: any) {
            return "Hiba történt létrehozás közben: " + error;
        }
    }


    return (
        <ShoppingListContext.Provider value={{ shoppingList, getFirstDate, getItemByDate, selectedDay, setSelectedDay, getItemDates, shoppingListDays, setShoppingListDays, changeDateItem, deleteItem, addNewShoppingItem, getNowList, getItemByCode, getItemById, editItem }}>
            {children}
        </ShoppingListContext.Provider>
    );
}

export function useShoppingList() {
    const context = useContext(ShoppingListContext);
    if (!context) {
        throw new Error("useShoppingList must be used within a ShoppingListProvider");
    }
    return context;
}

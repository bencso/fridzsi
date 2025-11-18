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
        const response = await api.get(`/shoppinglist/items/date/${selectedDay?.date}`, { withCredentials: true });
        const responseData = response.data;
        if (responseData && !responseData.message && Array.isArray(responseData)) {
            const newItems = responseData.map((data: { customproductname: string; product_product_quantity_unit: string | null; product_product_name: string | null; shoppinglist_quantity: number; shoppinglist_day: Date; shoppinglist_id: number }) => {
                const name = data.product_product_name !== null ? data.product_product_name : data.customproductname;
                return new ShoppingListItem(data.shoppinglist_id, name, data.shoppinglist_quantity, data.product_product_quantity_unit || "", data.shoppinglist_day);
            });
            setShoppingList(newItems);
        } else {
            setShoppingList([]);
        }
    }

    async function deleteItem({ id, quantity }: { id: number; quantity: number }): Promise<void> {
        await api.post(`/shoppinglist/items/remove/${id}`, { quantity }, { withCredentials: true });
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

    return (
        <ShoppingListContext.Provider value={{ shoppingList, getFirstDate, getItemByDate, selectedDay, setSelectedDay, getItemDates, shoppingListDays, setShoppingListDays, changeDateItem, deleteItem, addNewShoppingItem, getNowList }}>
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

import api from "@/interceptor/api";
import React, {
    createContext,
    ReactNode,
    useContext,
    useState,
} from "react";
import { ShoppingListItem } from "@/types/noteClass";
import { ShoppingListContextProp } from "@/types/shoppingListContextProp";

const ShoppingListContext = createContext<ShoppingListContextProp | undefined>(undefined);

export function ShoppingListProvider({ children }: { children: ReactNode }) {
    const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
    const [selectedDay, setSelectedDay] = useState<{
        date: Date
    } | undefined>();
    const [shoppingListDays, setShoppingListDays] = useState<{ date: Date; }[]>([]);

    async function getFirstDate(): Promise<void> {
        const response = await api.get("/shoppinglist/items/dates", { withCredentials: true });
        const date = new Date(response.data[0]);
        changeDateItem({ date });
    }

    async function getItemByDate(): Promise<void> {
        const formattedDate = selectedDay?.date;
        const response = await api.get(`/shoppinglist/items/date/${formattedDate}`, { withCredentials: true });
        const responseData = response.data;
        console.log(responseData);
        if (Array.isArray(responseData)) {
            const newItems = responseData.map((data: { customproductname: string; product_quantity_metric: string | null; product_product_name: string | null; shoppinglist_amount: number; shoppinglist_day: Date; shoppinglist_id: number }) => {
                const name = data.product_product_name !== null ? data.product_product_name : data.customproductname;
                return new ShoppingListItem(data.shoppinglist_id, name, data.shoppinglist_amount, data.product_quantity_metric || "", data.shoppinglist_day);
            });
            setShoppingList(newItems);
        }
    }

    async function deleteItem({ id, amount }: { id: number; amount: number }): Promise<void> {
        await api.post(`/shoppinglist/items/remove/${id}`, { amount }, { withCredentials: true });
        getItemDates();
        getItemByDate();
    }

    async function changeDateItem({ date }: { date: Date }): Promise<void> {
        setSelectedDay((prev) => {
            if (prev?.date !== date)
                return {
                    date: date
                }
            else return prev;
        });
        getItemByDate();
    }

    async function getItemDates(): Promise<void> {
        const dateGeneratedItem: { date: Date }[] = [];
        const response = await api.get("/shoppinglist/items/dates", { withCredentials: true });
        console.log(response.data);
        if (response.data) {
            response.data.map((value: string) => {
                const date = new Date(value);
                dateGeneratedItem.push({
                    date: date
                });
                setShoppingListDays(dateGeneratedItem);
            })
        } else {
            setShoppingListDays([]);
        }
    }

    async function addNewShoppingItem({
        product_name,
        day,
        amount,
        code
    }: {
        day: Date;
        product_name?: string | null;
        amount: number;
        code?: string | null;
    }): Promise<void | string> {
        try {
            await api.post("/shoppinglist/items/create", {
                product_name, day, amount, code
            }, { withCredentials: true });
            getItemDates();
            getItemByDate();
        }
        catch (error: any) {
            return "Hiba történt létrehozás közben: " + error;
        }
    }

    return (
        <ShoppingListContext.Provider value={{ shoppingList, getFirstDate, getItemByDate, selectedDay, setSelectedDay, getItemDates, shoppingListDays, setShoppingListDays, changeDateItem, deleteItem, addNewShoppingItem }}>
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

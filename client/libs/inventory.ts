import { Product } from "@/constants/product.interface";
import api from "@/interceptor/api";

export const getItems = async (): Promise<[] | Product[]> => {
  const items = await api.get("/pantry", { withCredentials: true });
  return items.data.products ? (items.data.products as Product[]) : [];
};

export async function addItem({
  code,
  product_name,
  amount,
  expiredAt,
}: {
  code: string;
  product_name: string;
  amount: number;
  expiredAt: Date;
}) {
  try {
    if (!code || !product_name || !amount || !expiredAt) throw new Error();
    const response = await api.post(
      "/pantry",
      {
        code: code,
        product_name: product_name,
        amount: amount,
        expiredAt: expiredAt,
      },
      { withCredentials: true }
    );

    console.log(response.data);

    if (response.data.statusCode !== 200) throw Error();

    return true;
  } catch {
    throw Error("Hiba történt a hozzáadás közben");
  }
}

export async function deleteItem({ id }: { id: number[] }) {
  try {
    const response = await api.post(
      "/pantry/delete",
      {
        id,
      },
      { withCredentials: true }
    );

    if (response.data.statusCode !== 200) throw Error();
    return true;
  } catch {
    throw Error("Hiba történt törlés közben");
  }
}

export async function editItem({ id, amount }: { id: number; amount: number }) {
  try {
    const response = await api.post(
      "/pantry/edit/" + id,
      {
        amount,
      },
      { withCredentials: true }
    );

    if (response.data.statusCode !== 200) throw Error();
    return true;
  } catch {
    throw Error("Hiba történt módosítás közben");
  }
}

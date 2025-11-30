import { ShoppingListItem } from "@/types/shoppinglist/noteClass";
import { TFunction } from "i18next";
import { Alert } from "react-native";

export const deleteAlert = ({
  t,
  note,
  deleteItem,
}: {
  t: TFunction<"translation", undefined>;
  note: ShoppingListItem;
  deleteItem: (params: { id: number; quantity: number }) => Promise<void>;
}) => {
  //TODO: Delete modalt kicserélni, egy customre mert kell bele a quantityUnits selector meg ilyenek
  //TODO: és ezek után meg majd rá kell építeni a backenden egy olyanra hogy legyen quantityunit kezelés :) 
  // ha töröl mondjuk a 2kg-ból 5 dekát akkor is jó legyen és ezt külön functionnél
  // , mert ezt majd lehet ujrahasználni a scanneléses törlésnél :)
  Alert.prompt(
    t('shoppinglist.deleteItem.title'),
    `${t('shoppinglist.deleteItem.message')}${note.name}?`,
    [
      {
        text: t('shoppinglist.deleteItem.cancel'),
        style: "cancel"
      },
      {
        text: t('shoppinglist.deleteItem.submit'),
        style: "default",
        onPress: async (text: any) => {
          try {
            await deleteItem({ id: Number(note.id), quantity: Number(text) });
          } catch (error: any) {
            console.error(error);
          }
        }
      }
    ],
    "plain-text"
  );
}
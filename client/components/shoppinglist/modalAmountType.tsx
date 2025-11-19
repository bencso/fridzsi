import { quantityTypeProp } from "@/types/shoppinglist/quantityTypeProp";
import { Picker } from "@react-native-picker/picker";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { Modal, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Button from "../button";
import { usePantry } from "@/contexts/pantry-context";
import { useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";

export function ModalQuantityType({
    quantityType,
    setQuantityType
}: {
    quantityType: quantityTypeProp | null,
    setQuantityType: Dispatch<SetStateAction<quantityTypeProp | null>>
}) {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const { quantityTypes, loadQuantityTypes } = usePantry();
    const { t } = useTranslation();

    useFocusEffect(
        useCallback(() => {
            (async () => {
                const types = await loadQuantityTypes();
                if (types && types.length > 0) setQuantityType(types[0]);
            })();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []));


    const selectItem = (value: number): quantityTypeProp => {
        return quantityTypes.find((selectedQantity) => selectedQantity.id === value) || quantityTypes[0];
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: "white",
                        padding: 16,
                        paddingTop: 16,
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30
                    }}>
                        <Picker
                            selectedValue={quantityType?.id}
                            onValueChange={(value: number) => {
                                setQuantityType(selectItem(value));
                            }}
                            mode="dropdown"
                        >
                            {
                                quantityTypes.map((quantityType: quantityTypeProp, idx: number) => {
                                    return (
                                        <Picker.Item label={quantityType?.label} key={idx} value={quantityType?.id} />
                                    )
                                })
                            }
                        </Picker>
                        <Button label={t("shoppinglist.done")} icon="check-circle" action={() => {
                            setModalVisible(!modalVisible);
                        }} />
                    </View>
                </Modal>
                {
                    //TODO: A styleon állítani majd!
                    quantityTypes && <Button action={() => setModalVisible(!modalVisible)} chevron={false} label={quantityType ? quantityType?.label : quantityTypes.length > 0 ? quantityTypes[0].label : t("shoppinglist.quantity")} />
                }
            </SafeAreaView>
        </SafeAreaProvider>
    )
}
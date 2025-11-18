import { quantityTypeProp } from "@/types/shoppinglist/quantityTypeProp";
import { Picker } from "@react-native-picker/picker";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { Modal, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Button from "../button";
import { usePantry } from "@/contexts/pantry-context";
import { useFocusEffect } from "expo-router";

export function ModalQuantityType({
    quantityType,
    setQuantityType
}: {
    quantityType: quantityTypeProp | null,
    setQuantityType: Dispatch<SetStateAction<quantityTypeProp | null>>
}) {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const { quantityTypes, loadQuantityTypes } = usePantry();
    //TODO: Késöbb DB-ből jön ugyis ez az adat is, csak még ott is fel kéne vinni ezeket :DDD
    useFocusEffect(useCallback(() => {
        loadQuantityTypes();
        setQuantityType(quantityTypes[0]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []));

    const selectItem = (value: string): quantityTypeProp => {
        return quantityTypes.find((selectedQantity) => {
            if (value === selectedQantity.label) return selectedQantity;
        }) || quantityTypes[0];
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
                            selectedValue={quantityType ? quantityType.label : quantityTypes[0].label}
                            onValueChange={(value: string) => {
                                setQuantityType(selectItem(value));
                            }}
                            mode="dropdown"
                        >
                            {
                                quantityTypes.map((quantityType: quantityTypeProp, idx: number) => {
                                    return (
                                        <Picker.Item label={quantityType.label} key={idx} value={quantityType.label} />
                                    )
                                })
                            }
                        </Picker>
                        <Button label="Kész" icon="check-circle" action={() => {
                            setModalVisible(!modalVisible);
                        }} />
                    </View>
                </Modal>
                <Button action={() => setModalVisible(!modalVisible)} chevron={false} label={quantityType ? quantityType.label : quantityTypes[0].label} />
            </SafeAreaView>
        </SafeAreaProvider>
    )
}
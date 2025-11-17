import { quantityTypeProp } from "@/types/shoppinglist/quantityTypeProp";
import { Picker } from "@react-native-picker/picker";
import { Dispatch, SetStateAction, useState } from "react";
import { Modal, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Button from "../button";

export function ModalQuantityType({
    quantityType,
    setQuantityType
}: {
    quantityType: quantityTypeProp,
    setQuantityType: Dispatch<SetStateAction<quantityTypeProp>>
}) {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    //TODO: Késöbb DB-ből jön ugyis ez az adat is, csak még ott is fel kéne vinni ezeket :DDD
    const quantityTypes = [
        { label: "kg", en: "kilogram", hu: "kilogramm" },
        { label: "g", en: "gram", hu: "gramm" },
        { label: "db", en: "piece", hu: "darab" },
        { label: "l", en: "liter", hu: "liter" },
        { label: "dl", en: "deciliter", hu: "deciliter" },
        { label: "ml", en: "milliliter", hu: "milliliter" },
        { label: "csomag", en: "package", hu: "csomag" },
        { label: "üveg", en: "bottle", hu: "üveg" },
        { label: "doboz", en: "can", hu: "doboz" },
        { label: "zacskó", en: "bag", hu: "zacskó" },
        { label: "karton", en: "box", hu: "karton" },
        { label: "csokor", en: "bunch", hu: "csokor" },
        { label: "szelet", en: "slice", hu: "szelet" },
    ];

    const selectItem = (value: string): quantityTypeProp => {
        return quantityTypes.find((selectedquantity) => {
            if (value === selectedquantity.label) return selectedquantity;
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
                            selectedValue={quantityType.label}
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
                <Button action={() => setModalVisible(!modalVisible)} chevron={false} label={quantityType.label} />
            </SafeAreaView>
        </SafeAreaProvider>
    )
}
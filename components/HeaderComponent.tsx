import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Modal, Text, TouchableOpacity, View } from "react-native";
import PopupModal from "./PopupModal";

export default function HeaderComponent({ title }: any) {
    const router = useRouter();
    const [showPopupModal, setShowPopupModal] = useState(false);

    return (
        <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-2xl font-bold mb-4">
                {title}
            </Text>

            <TouchableOpacity
                onPress={() => setShowPopupModal(true)}
                className="bg-red-500 px-4 py-2 rounded-xl"
            >
                <Text className="text-white font-semibold">Logout</Text>
            </TouchableOpacity>

            <PopupModal 
                visible={showPopupModal}
                title="Logout"
                message="Are you sure you want to Logout"
                confirmText="Logout"
                onConfirm={() => {
                    setShowPopupModal(false);
                    router.replace('/');
                }}
                onCancel={() => setShowPopupModal(false)}
            />
        </View>
    );
}
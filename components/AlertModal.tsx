import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

interface AlertModalProps {
    visible: boolean;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
    confirmColor?: string;
}

export default function AlertModal ({
    visible,
    title,
    message,
    confirmText = "Okay",
    onConfirm,
    confirmColor = "bg-red-500"
}: AlertModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onConfirm}
        >
            <Pressable
                className="flex-1 bg-black/70 justify-center items-center px-6"
                onPress={onConfirm}
            >
                <Pressable className="bg-gray-800 w-full max-w-sm p-6 rounded-2xl border border-gray-700">
                    <Text className="text-white text-xl font-bold mb-2 text-center">
                        {title}
                    </Text>
                    <Text className="text-gray-400 text-base mb-8 text-center">
                        {message}
                    </Text>

                    <View className="flex-row gap-3">
                        <TouchableOpacity 
                            onPress={onConfirm}
                            className={`flex-1 py-3 rounded-xl ${confirmColor}`}
                        >
                            <Text className="text-white text-center font-bold">{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );

}
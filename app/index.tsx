import AlertModal from '@/components/AlertModal';
import SafeScreenComponent from '@/components/SafeScreenComponent';
import { login } from '@/services/authService';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

export default function Index() {
    const router = useRouter();
    const { sessionExpired } = useLocalSearchParams<{ sessionExpired?: string }>();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!username || !password) {
            setError('Please enter username and password');
            return;
        }

        setError('')
        setLoading(true)

        try {
            await login(username, password);
            router.replace('/dashboard');
        } catch (e: any) {
            setError(e?.response?.data?.message || e?.message || 'Login failed. Please try again');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeScreenComponent>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={120}
                className="flex-1" 
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center'}}
                    >
                        <View className="justify-center">
                            {/* Title */}
                            <Text className="text-white text-3xl font-bold mb-2">
                                🏧 Monitoring
                            </Text>
                            <Text className="text-gray-400 mb-8">
                                Please login to continue
                            </Text>

                            {/* Username */}
                            <View className="mb-4">
                                <Text className="text-gray-400 mb-2">
                                    Username
                                </Text>
                                <TextInput 
                                    placeholder="Enter username"
                                    placeholderTextColor="#9ca3af"
                                    className="bg-gray-800 text-white px-4 py-3 rounded-xl"
                                    value={username}
                                    onChangeText={setUsername}
                                />
                            </View>

                            {/* Password */}
                            <View className="mb-6">
                                <Text className="text-gray-400 mb-2">
                                        Password
                                    </Text>
                                <View className="flex-row items-center bg-gray-800 rounded-xl px-4">
                                    <TextInput 
                                        placeholder="Enter password"
                                        placeholderTextColor="#9ca3af"
                                        secureTextEntry={!showPassword}
                                        className="flex-1 text-white py-3"
                                        value={password}
                                        onChangeText={setPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        <Ionicons 
                                            name={showPassword ? 'eye-off' : 'eye'}
                                            size={20}
                                            color="#9ca3af"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Login Button */}
                            <TouchableOpacity
                                onPress={handleLogin}
                                disabled={loading}
                                className="bg-blue-500 py-3 rounded-xl items-center"
                            >
                                {loading ? (
                                    <ActivityIndicator color="#ffffff" />
                                ) : (
                                    <Text className="text-white text-center font-semibold text-lg">
                                        Login
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            <AlertModal
                visible={!!sessionExpired}
                title="Session Expired"
                message="Your session has expired. Please log in again."
                onConfirm={() => router.setParams({ sessionExpired: undefined })}
            />
            <AlertModal
                visible={!!error}
                title="Login Failed"
                message={error}
                onConfirm={() => setError('')}
            />
        </SafeScreenComponent>
    );
}
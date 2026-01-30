import { MaterialIcons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import container from '../../../../container';
import { useI18n } from '../../../../hooks/useI18n';
import { useTheme } from '../../../../hooks/useTheme';
import { EditProfileViewModelToken } from '../../profile.di';
import { EditProfileViewModel } from '../viewmodels/EditProfileViewModel';

const EditProfileScreen: React.FC = () => {
    const router = useRouter();
    const { colors, isDarkMode } = useTheme();
    const { t } = useI18n();
    const [viewModel] = useState(() => container.resolve<EditProfileViewModel>(EditProfileViewModelToken));
    const [_, setUpdate] = useState(0);

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['25%'], []);

    useEffect(() => {
        const unsubscribe = viewModel.subscribe(() => setUpdate(prev => prev + 1));
        viewModel.loadProfile();
        return unsubscribe;
    }, [viewModel]);

    const handlePickImage = async (useCamera: boolean) => {
        bottomSheetRef.current?.close();

        const permissionResult = useCamera
            ? await ImagePicker.requestCameraPermissionsAsync()
            : await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert(t('common.error'), t('profile.edit.permissionDenied'));
            return;
        }

        const result = useCamera
            ? await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.3,
            })
            : await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.3,
            });

        if (!result.canceled && result.assets && result.assets[0].uri) {
            console.log('[EditProfileScreen] Image picked, starting upload...', result.assets[0].uri);
            await viewModel.uploadImage(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        const success = await viewModel.updateProfile();
        if (success) {
            Alert.alert(t('common.success'), t('profile.edit.success'), [
                { text: t('common.ok'), onPress: () => router.back() }
            ]);
        } else if (viewModel.error) {
            Alert.alert(t('common.error'), viewModel.error);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: isDarkMode ? '#2c2c2c' : '#f0f0f0',
        },
        headerTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text,
            marginLeft: 16,
        },
        content: {
            padding: 24,
        },
        avatarContainer: {
            alignItems: 'center',
            marginBottom: 32,
        },
        avatarWrapper: {
            position: 'relative',
            width: 120,
            height: 120,
        },
        avatar: {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: isDarkMode ? '#2c2c2c' : '#f0f0f0',
        },
        editIconContainer: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: colors.primary,
            width: 36,
            height: 36,
            borderRadius: 18,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 3,
            borderColor: colors.background,
        },
        fieldContainer: {
            marginBottom: 24,
        },
        label: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.secondary,
            marginBottom: 8,
            marginLeft: 4,
        },
        input: {
            backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f8f8',
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            color: colors.text,
            borderWidth: 1,
            borderColor: isDarkMode ? '#333' : '#e0e0e0',
        },
        disabledInput: {
            opacity: 0.6,
        },
        saveButton: {
            backgroundColor: colors.primary,
            borderRadius: 12,
            padding: 18,
            alignItems: 'center',
            marginTop: 32,
        },
        saveButtonDisabled: {
            opacity: 0.7,
        },
        saveButtonText: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
        },
        bottomSheetContainer: {
            padding: 24,
            alignItems: 'center',
        },
        bottomSheetOption: {
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            paddingVertical: 16,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: isDarkMode ? '#333' : '#e0e0e0',
        },
        bottomSheetOptionText: {
            fontSize: 18,
            color: colors.text,
            marginLeft: 16,
        }
    });

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{t('profile.edit.title')}</Text>
                    </View>

                    <ScrollView style={{ flex: 1 }}>
                        <View style={styles.content}>
                            <View style={styles.avatarContainer}>
                                <TouchableOpacity
                                    style={styles.avatarWrapper}
                                    onPress={() => bottomSheetRef.current?.snapToIndex(0)}
                                    disabled={viewModel.isUpdating}
                                >
                                    <Image
                                        source={viewModel.photoURL ? { uri: viewModel.photoURL } : { uri: 'https://randomuser.me/api/portraits/men/81.jpg' }}
                                        style={styles.avatar}
                                    />
                                    <View style={styles.editIconContainer}>
                                        <MaterialIcons name="camera-alt" size={20} color="#fff" />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.fieldContainer}>
                                <Text style={styles.label}>{t('profile.edit.name')}</Text>
                                <TextInput
                                    style={styles.input}
                                    value={viewModel.name}
                                    onChangeText={(text) => viewModel.setName(text)}
                                    placeholder={t('profile.edit.namePlaceholder')}
                                    placeholderTextColor={colors.secondary}
                                />
                            </View>

                            <View style={styles.fieldContainer}>
                                <Text style={styles.label}>{t('profile.edit.email')}</Text>
                                <TextInput
                                    style={[styles.input, styles.disabledInput]}
                                    value={viewModel.email}
                                    editable={false}
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.saveButton, viewModel.isUpdating && styles.saveButtonDisabled]}
                                onPress={handleSave}
                                disabled={viewModel.isUpdating}
                            >
                                {viewModel.isUpdating ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.saveButtonText}>{t('profile.edit.save')}</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    <BottomSheet
                        ref={bottomSheetRef}
                        index={-1}
                        snapPoints={snapPoints}
                        enablePanDownToClose
                        backgroundStyle={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }}
                        handleIndicatorStyle={{ backgroundColor: isDarkMode ? '#555' : '#ccc' }}
                    >
                        <BottomSheetView style={styles.bottomSheetContainer}>
                            <TouchableOpacity style={styles.bottomSheetOption} onPress={() => handlePickImage(true)}>
                                <MaterialIcons name="photo-camera" size={24} color={colors.primary} />
                                <Text style={styles.bottomSheetOptionText}>{t('profile.edit.camera')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.bottomSheetOption, { borderBottomWidth: 0 }]} onPress={() => handlePickImage(false)}>
                                <MaterialIcons name="photo-library" size={24} color={colors.primary} />
                                <Text style={styles.bottomSheetOptionText}>{t('profile.edit.gallery')}</Text>
                            </TouchableOpacity>
                        </BottomSheetView>
                    </BottomSheet>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

export default EditProfileScreen;

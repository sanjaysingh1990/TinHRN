import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useI18n } from '../../../../hooks/useI18n';
import { useTheme } from '../../../../hooks/useTheme';
import { useViewModel } from '../../../../hooks/useViewModel';
import { AddPostViewModelToken } from '../../data/di/tokens';
import { AddPostViewModel } from '../viewmodels/AddPostViewModel';

const AddPostScreen: React.FC = () => {
    const router = useRouter();
    const { colors, isDarkMode } = useTheme();
    const { t } = useI18n();
    const viewModel = useViewModel<AddPostViewModel>(AddPostViewModelToken);

    useEffect(() => {
        viewModel.resetForm();
        viewModel.loadCategories();
    }, []);

    const handleBack = () => {
        Haptics.selectionAsync();
        router.back();
    };

    const pickImage = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            viewModel.setImageUrl(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!viewModel.canSubmit || viewModel.isSubmitting) return;

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const success = await viewModel.createPost();
        if (success) {
            router.back();
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <StatusBar style={isDarkMode ? 'light' : 'dark'} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={handleBack}
                    >
                        <MaterialIcons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Share Your Story</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Image Selection */}
                    <TouchableOpacity
                        style={[styles.imageContainer, { backgroundColor: colors.inputBackground, borderColor: colors.borderColor }]}
                        onPress={pickImage}
                    >
                        {viewModel.imageUrl ? (
                            <Image source={{ uri: viewModel.imageUrl }} style={styles.selectedImage} />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <MaterialIcons name="add-a-photo" size={40} color={colors.secondary} />
                                <Text style={[styles.imagePlaceholderText, { color: colors.secondary }]}>Add Photo or Video</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Title Input */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Title</Text>
                        <TextInput
                            style={[styles.input, { color: colors.text, backgroundColor: colors.inputBackground, borderColor: colors.borderColor }]}
                            placeholder="Give your memory a name"
                            placeholderTextColor={colors.secondary}
                            value={viewModel.title}
                            onChangeText={(text) => viewModel.setTitle(text)}
                        />
                    </View>

                    {/* Category Selection */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Category</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryList}>
                            {viewModel.categories.map((category) => (
                                <TouchableOpacity
                                    key={category.id}
                                    style={[
                                        styles.categoryItem,
                                        {
                                            backgroundColor: viewModel.selectedCategoryId === category.id ? colors.primary : colors.inputBackground,
                                            borderColor: colors.borderColor
                                        }
                                    ]}
                                    onPress={() => {
                                        Haptics.selectionAsync();
                                        viewModel.setSelectedCategoryId(category.id);
                                        viewModel.notifyUpdate();
                                    }}
                                >
                                    <Text style={[
                                        styles.categoryText,
                                        { color: viewModel.selectedCategoryId === category.id ? '#FFF' : colors.text }
                                    ]}>
                                        {category.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Description Input */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Description</Text>
                        <TextInput
                            style={[
                                styles.input,
                                styles.textArea,
                                { color: colors.text, backgroundColor: colors.inputBackground, borderColor: colors.borderColor }
                            ]}
                            placeholder="Tell the community about this experience..."
                            placeholderTextColor={colors.secondary}
                            multiline
                            numberOfLines={4}
                            value={viewModel.description}
                            onChangeText={(text) => viewModel.setDescription(text)}
                        />
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            { backgroundColor: colors.primary },
                            (!viewModel.canSubmit || viewModel.isSubmitting) && styles.submitButtonDisabled
                        ]}
                        onPress={handleSubmit}
                        disabled={!viewModel.canSubmit || viewModel.isSubmitting}
                    >
                        {viewModel.isSubmitting ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.submitButtonText}>Create Post</Text>
                        )}
                    </TouchableOpacity>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
    },
    backButton: {
        padding: 4,
        width: 40,
    },
    scrollContent: {
        padding: 20,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 1.5,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        overflow: 'hidden',
        marginBottom: 24,
    },
    selectedImage: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePlaceholderText: {
        marginTop: 8,
        fontSize: 14,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        fontSize: 16,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    categoryList: {
        flexDirection: 'row',
    },
    categoryItem: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 10,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
    },
    submitButton: {
        height: 54,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AddPostScreen;

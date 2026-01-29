import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    FlatList,
    Image,
    StatusBar,
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
import { SearchViewModelToken } from '../../data/di/tokens';
import { SearchResult } from '../../domain/entities/SearchResult';
import SearchShimmer from '../components/SearchShimmer';
import { SearchViewModel } from '../viewmodels/SearchViewModel';

const SearchScreen: React.FC = () => {
    const router = useRouter();
    const { colors, isDarkMode } = useTheme();
    const { t } = useI18n();
    const viewModel = useViewModel<SearchViewModel>(SearchViewModelToken);
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        // Focus search input on mount
        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 500);
        return () => {
            clearTimeout(timer);
            viewModel.onUnmount();
        };
    }, []);

    const { query, results, isLoading } = viewModel;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        headerContainer: {
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColor,
            paddingBottom: 8,
        },
        headerTitleRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 44,
            width: '100%',
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            fontFamily: 'SplineSans',
        },
        backButton: {
            position: 'absolute',
            left: 8,
            padding: 8,
            zIndex: 10,
        },
        searchRow: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            marginTop: 4,
        },
        searchContainer: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.inputBackground,
            borderRadius: 12,
            paddingHorizontal: 12,
            height: 44,
        },
        searchInput: {
            flex: 1,
            fontSize: 16,
            color: colors.text,
            marginLeft: 8,
            paddingVertical: 0,
        },
        clearButton: {
            padding: 4,
        },
        listContent: {
            paddingBottom: 20,
        },
        resultItem: {
            flexDirection: 'row',
            padding: 15,
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColor,
            borderStyle: 'dashed',
        },
        resultImage: {
            width: 80,
            height: 80,
            borderRadius: 12,
            backgroundColor: colors.inputBackground,
        },
        resultInfo: {
            flex: 1,
            marginLeft: 15,
        },
        resultTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 4,
        },
        resultSubtitle: {
            fontSize: 14,
            color: colors.secondary,
            marginBottom: 4,
        },
        resultMeta: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        badge: {
            backgroundColor: colors.primary + '20',
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 4,
            marginRight: 8,
        },
        badgeText: {
            fontSize: 10,
            color: colors.primary,
            fontWeight: 'bold',
            textTransform: 'uppercase',
        },
        priceText: {
            fontSize: 14,
            fontWeight: 'bold',
            color: colors.primary,
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 100,
        },
        emptyText: {
            fontSize: 16,
            color: colors.secondary,
            marginTop: 12,
        },
    });

    const handleResultPress = (item: SearchResult) => {
        if (item.type === 'tour') {
            router.push({
                pathname: `/tour/${item.id}`,
                params: {
                    name: item.title,
                    image: item.imageUrl
                }
            });
        } else {
            // For now, destinations also open a generic detail or we can add a specific one
            // Let's assume they open tour details for now as mock
            router.push({
                pathname: `/tour/${item.id}`,
                params: {
                    name: item.title,
                    image: item.imageUrl
                }
            });
        }
    };

    const renderResult = ({ item }: { item: SearchResult }) => (
        <TouchableOpacity
            style={styles.resultItem}
            onPress={() => handleResultPress(item)}
            activeOpacity={0.7}
        >
            <Image source={{ uri: item.imageUrl }} style={styles.resultImage} />
            <View style={styles.resultInfo}>
                <View style={styles.resultMeta}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.type}</Text>
                    </View>
                    {item.rating && (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons name="star" size={14} color="#F59E0B" />
                            <Text style={{ fontSize: 12, color: colors.secondary, marginLeft: 2 }}>{item.rating}</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.resultTitle}>{item.title}</Text>
                <Text style={styles.resultSubtitle} numberOfLines={1}>{item.subtitle}</Text>
                {item.price && (
                    <Text style={styles.priceText}>{item.price} <Text style={{ fontSize: 12, color: colors.secondary, fontWeight: 'normal' }}>/ person</Text></Text>
                )}
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.borderColor} />
        </TouchableOpacity>
    );

    const renderEmpty = () => {
        if (isLoading) {
            return (
                <View>
                    {[1, 2, 3, 4, 5].map(i => <SearchShimmer key={i} />)}
                </View>
            );
        }

        if (query.trim() === '') {
            return (
                <View style={styles.emptyContainer}>
                    <MaterialIcons name="search" size={64} color={colors.borderColor} />
                    <Text style={styles.emptyText}>{t('search.emptyTitle')}</Text>
                </View>
            );
        }

        return (
            <View style={styles.emptyContainer}>
                <MaterialIcons name="search-off" size={64} color={colors.borderColor} />
                <Text style={styles.emptyText}>{t('search.emptySubtitle')} "{query}"</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={styles.headerContainer}>
                <View style={styles.headerTitleRow}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <MaterialIcons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{t('search.title')}</Text>
                </View>

                {/* Search Bar Row */}
                <View style={styles.searchRow}>
                    <View style={styles.searchContainer}>
                        <MaterialIcons name="search" size={20} color={colors.secondary} />
                        <TextInput
                            ref={inputRef}
                            style={styles.searchInput}
                            placeholder={t('search.placeholder')}
                            placeholderTextColor={colors.secondary}
                            value={query}
                            onChangeText={(text) => viewModel.setQuery(text)}
                            autoCorrect={false}
                            autoCapitalize="none"
                        />
                        {query.length > 0 && (
                            <TouchableOpacity
                                onPress={() => viewModel.clearSearch()}
                                style={styles.clearButton}
                            >
                                <MaterialIcons name="close" size={20} color={colors.secondary} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>

            {/* Results List */}
            <FlatList
                data={results}
                renderItem={renderResult}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={() => results.length > 0 && (
                    <Text style={{ padding: 15, fontSize: 14, fontWeight: 'bold', color: colors.secondary }}>
                        {results.length} {t('search.resultsHeader')}
                    </Text>
                )}
                ListEmptyComponent={renderEmpty}
                keyboardShouldPersistTaps="handled"
            />
        </SafeAreaView>
    );
};

export default SearchScreen;

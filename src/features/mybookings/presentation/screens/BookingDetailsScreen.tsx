import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import container from '../../../../container';
import { useI18n } from '../../../../hooks/useI18n';
import { useTheme } from '../../../../hooks/useTheme';
import { Booking } from '../../domain/models/Booking';
import { MyBookingsViewModelToken } from '../../mybookings.di';
import ShimmerBookingDetails from '../components/ShimmerBookingDetails';
import { MyBookingsViewModel } from '../viewmodels/MyBookingsViewModel';

const BookingDetailsScreen = () => {
    const { colors, isDarkMode } = useTheme();
    const { t } = useI18n();
    const router = useRouter();
    const { bookingId } = useLocalSearchParams();

    // Direct resolution since we need a fresh instance or specific method? 
    // Actually useViewModel is better, but local state management is simpler for single item view without complex reactivity.
    const [viewModel] = useState(() => container.resolve<MyBookingsViewModel>(MyBookingsViewModelToken));

    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBooking = async () => {
            if (!bookingId) {
                Alert.alert(t('bookingDetails.error'), t('bookingDetails.noId'));
                router.back();
                return;
            }

            setLoading(true);
            const data = await viewModel.getBooking(bookingId as string);
            setBooking(data);
            setLoading(false);
        };

        loadBooking();
    }, [bookingId]);

    const handleManage = () => {
        if (!booking) return;
        router.push({
            pathname: `/tour/${booking.tourId}` as any,
            params: {
                bookingId: booking.id,
                mode: 'manage'
            }
        });
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) {
        return <ShimmerBookingDetails />;
    }

    if (!booking) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: colors.text }}>{t('bookingDetails.notFound')}</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={{ color: colors.primary }}>{t('bookingDetails.goBack')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const isUpcoming = new Date(booking.endDate) >= new Date();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.background} />

            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButtonIcon}>
                    <MaterialIcons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>{t('bookingDetails.title')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Tour Info Section */}
                <View style={styles.section}>
                    <Image source={{ uri: booking.tourImage }} style={styles.tourImage} />
                    <View style={styles.tourInfo}>
                        <Text style={[styles.tourName, { color: colors.text }]}>{booking.tourName}</Text>
                        <Text style={[styles.vendor, { color: colors.secondary }]}>{t('bookingDetails.by')} {booking.vendor}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={[styles.statusBadge, { backgroundColor: booking.status === 'confirmed' ? 'rgba(0, 128, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)' }]}>
                                <Text style={[styles.statusText, { color: booking.status === 'confirmed' ? 'green' : 'red' }]}>
                                    {booking.status.toUpperCase()}
                                </Text>
                            </View>
                            {booking.status === 'cancelled' && (
                                <TouchableOpacity
                                    style={styles.bookAgainButton}
                                    onPress={() => router.push(`/tour/${booking.tourId}` as any)}
                                >
                                    <MaterialIcons name="refresh" size={16} color={colors.primary} />
                                    <Text style={[styles.bookAgainText, { color: colors.primary }]}>{t('bookingDetails.bookAgain')}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>

                {/* Booking Info */}
                <View style={[styles.card, { backgroundColor: colors.cardBackgroundColor, borderColor: colors.borderColor }]}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>{t('bookingDetails.bookingInfo')}</Text>

                    <View style={styles.row}>
                        <Text style={[styles.label, { color: colors.secondary }]}>{t('bookingDetails.reference')}</Text>
                        <Text style={[styles.value, { color: colors.text }]}>{booking.bookingReference}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <Text style={[styles.label, { color: colors.secondary }]}>{t('bookingDetails.checkIn')}</Text>
                        <Text style={[styles.value, { color: colors.text }]}>{formatDate(booking.startDate)}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={[styles.label, { color: colors.secondary }]}>{t('bookingDetails.checkOut')}</Text>
                        <Text style={[styles.value, { color: colors.text }]}>{formatDate(booking.endDate)}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={[styles.label, { color: colors.secondary }]}>{t('bookingDetails.duration')}</Text>
                        <Text style={[styles.value, { color: colors.text }]}>
                            {Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24))} {t('bookingDetails.nights')}
                        </Text>
                    </View>
                </View>

                {/* Customization Details */}
                <View style={[styles.card, { backgroundColor: colors.cardBackgroundColor, borderColor: colors.borderColor }]}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>{t('bookingDetails.yourSelection')}</Text>

                    {booking.customization?.tentType && (
                        <View style={styles.itemRow}>
                            <MaterialIcons name="home" size={20} color={colors.primary} />
                            <View style={{ marginLeft: 10, flex: 1 }}>
                                <Text style={[styles.itemText, { color: colors.text }]}>{booking.customization.tentType.type}</Text>
                                <Text style={[styles.itemPrice, { color: colors.secondary }]}>${booking.customization.tentType.price} {t('bookingDetails.perNight')}</Text>
                            </View>
                        </View>
                    )}

                    {booking.customization?.addons && booking.customization.addons.length > 0 && (
                        <>
                            <View style={[styles.divider, { marginVertical: 10 }]} />
                            <Text style={[styles.subTitle, { color: colors.text }]}>{t('bookingDetails.addons')}</Text>
                            {booking.customization.addons.map((addon, index) => (
                                <View key={index} style={styles.itemRow}>
                                    <MaterialIcons name="add-circle-outline" size={20} color={colors.primary} />
                                    <View style={{ marginLeft: 10, flex: 1 }}>
                                        <Text style={[styles.itemText, { color: colors.text }]}>{addon.addonName}</Text>
                                        <Text style={[styles.itemPrice, { color: colors.secondary }]}>${addon.addOnPrice}</Text>
                                    </View>
                                </View>
                            ))}
                        </>
                    )}
                </View>

                {/* Payment Summary */}
                <View style={[styles.card, { backgroundColor: colors.cardBackgroundColor, borderColor: colors.borderColor }]}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>{t('bookingDetails.paymentSummary')}</Text>
                    <View style={styles.row}>
                        <Text style={[styles.label, { color: colors.secondary }]}>{t('bookingDetails.totalAmount')}</Text>
                        <Text style={[styles.totalAmount, { color: colors.primary }]}>${booking.totalPrice}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={[styles.label, { color: colors.secondary }]}>{t('bookingDetails.paymentStatus')}</Text>
                        <Text style={[styles.value, { color: 'green', fontWeight: 'bold' }]}>{t('bookingDetails.paid')}</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Footer Action */}
            {isUpcoming && booking.status !== 'cancelled' ? (
                <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.borderColor }]}>
                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]} onPress={handleManage}>
                        <Text style={styles.actionButtonText}>{t('bookingDetails.manageBooking')}</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                !isUpcoming && booking.status === 'confirmed' && (
                    <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.borderColor }]}>
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: colors.primary }]}
                            onPress={() => router.push({
                                pathname: '/add-review',
                                params: {
                                    tourId: booking.tourId,
                                    bookingId: booking.id,
                                    tourName: booking.tourName,
                                    tourImage: booking.tourImage
                                }
                            } as any)}
                        >
                            <Text style={styles.actionButtonText}>{t('bookingDetails.writeReview')}</Text>
                        </TouchableOpacity>
                    </View>
                )
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButtonIcon: {
        padding: 5,
    },
    backButton: {
        marginTop: 20,
        padding: 10,
    },
    content: {
        padding: 20,
        paddingBottom: 100,
    },
    section: {
        marginBottom: 24,
    },
    tourImage: {
        width: '100%',
        height: 200,
        borderRadius: 16,
        marginBottom: 16,
    },
    tourInfo: {
        alignItems: 'flex-start',
    },
    tourName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    vendor: {
        fontSize: 16,
        marginBottom: 8,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    statusText: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    bookAgainButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
        paddingVertical: 6,
    },
    bookAgainText: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
        textDecorationLine: 'underline',
    },
    card: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
    },
    value: {
        fontSize: 14,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 10,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    itemText: {
        fontSize: 15,
        fontWeight: '500',
    },
    itemPrice: {
        fontSize: 13,
    },
    subTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
    },
    actionButton: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    actionButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default BookingDetailsScreen;

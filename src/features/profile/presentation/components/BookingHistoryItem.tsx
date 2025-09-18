import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import { Booking } from '../../../mybookings/domain/models/Booking';

interface BookingHistoryItemProps {
  booking: Booking;
}

const BookingHistoryItem: React.FC<BookingHistoryItemProps> = ({ booking }) => {
  const { colors } = useTheme();
  const isUpcoming = booking.type === 'upcoming';

  // Format date range like "2 jun 25 - 5 jun 25"
  const formatDateRange = (start: Date, end: Date) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: '2-digit' };
    const startDate = start.toLocaleDateString('en-GB', options).replace(/ /g, ' ').toLowerCase();
    const endDate = end.toLocaleDateString('en-GB', options).replace(/ /g, ' ').toLowerCase();
    return `${startDate} - ${endDate}`;
  };

  return (
    <View style={[styles.card, !isUpcoming && styles.pastCard, { backgroundColor: colors.cardBackgroundColor, borderColor: colors.borderColor }]}>
      <Image source={{ uri: booking.tourImage }} style={styles.image} />
      <View style={styles.info}>
        <Text style={[styles.vendor, { color: colors.secondary }]}>{booking.vendor}</Text>
        <Text style={[styles.title, { color: colors.text }]}>{booking.tourName}</Text>
        <Text style={[styles.date, { color: colors.secondary }]}>{formatDateRange(booking.startDate, booking.endDate)}</Text>
        <Text style={[styles.status, { color: booking.status === 'confirmed' ? 'green' : colors.secondary }]}>{booking.status.toUpperCase()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: 15,
    marginBottom: 15,
  },
  pastCard: {
    opacity: 0.6,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  info: {
    flex: 1,
    marginLeft: 15,
  },
  vendor: {
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  date: {
    fontSize: 14,
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 3,
    textTransform: 'uppercase',
  },
});

export default BookingHistoryItem;
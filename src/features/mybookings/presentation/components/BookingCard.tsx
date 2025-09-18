import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import { Booking } from '../../domain/models/Booking';

interface BookingCardProps {
  booking: Booking;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const { colors, isDarkMode } = useTheme();
  const isUpcoming = booking.type === 'upcoming';

  // Format date range like "2 jun 25 - 5 jun 25"
  const formatDateRange = (start: Date, end: Date) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: '2-digit' };
    const startDate = start.toLocaleDateString('en-GB', options).replace(/ /g, ' ').toLowerCase();
    const endDate = end.toLocaleDateString('en-GB', options).replace(/ /g, ' ').toLowerCase();
    return `${startDate} - ${endDate}`;
  };

  const styles = StyleSheet.create({
    card: {
      flexDirection: 'row',
      backgroundColor: colors.cardBackgroundColor,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.borderColor,
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
      color: colors.secondary,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginVertical: 5,
    },
    date: {
      fontSize: 14,
      color: colors.secondary,
    },
    status: {
      fontSize: 12,
      fontWeight: 'bold',
      color: booking.status === 'confirmed' ? 'green' : colors.secondary,
      marginTop: 3,
      textTransform: 'uppercase', // Display status in ALL CAPS
      // Removed rounded borders styling
    },
    actions: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginTop: 10,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 4, // Keep little rounded corners
      marginBottom: 10,
    },
    buttonText: {
      color: isDarkMode ? '#111714' : '#fff',
      fontWeight: 'bold',
      marginLeft: 5,
    },
  });

  return (
    <View style={[styles.card, !isUpcoming && styles.pastCard]}>
      <Image source={{ uri: booking.tourImage }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.vendor}>{booking.vendor}</Text>
        <Text style={styles.title}>{booking.tourName}</Text>
        <Text style={styles.date}>{formatDateRange(booking.startDate, booking.endDate)}</Text>
        <Text style={styles.status}>{booking.status}</Text>
        <View style={styles.actions}>
          {isUpcoming ? (
            <>
              <TouchableOpacity style={styles.button}>
                <MaterialIcons name="edit" size={16} color={isDarkMode ? '#111714' : '#fff'} />
                <Text style={styles.buttonText}>Manage</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <MaterialIcons name="calendar-today" size={16} color={isDarkMode ? '#111714' : '#fff'} />
                <Text style={styles.buttonText}>Add to Calendar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.button}>
              <MaterialIcons name="visibility" size={16} color={isDarkMode ? '#111714' : '#fff'} />
              <Text style={styles.buttonText}>View Details</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default BookingCard;
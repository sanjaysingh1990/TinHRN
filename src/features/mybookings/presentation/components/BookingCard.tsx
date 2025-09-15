
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
      borderRadius: 20,
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
      <Image source={{ uri: booking.imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.vendor}>{booking.vendor}</Text>
        <Text style={styles.title}>{booking.title}</Text>
        <Text style={styles.date}>{booking.dateRange}</Text>
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

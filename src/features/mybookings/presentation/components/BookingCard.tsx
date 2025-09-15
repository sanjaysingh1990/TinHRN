
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Booking } from '../../domain/models/Booking';

interface BookingCardProps {
  booking: Booking;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const isUpcoming = booking.type === 'upcoming';

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
                <MaterialIcons name="edit" size={16} color="#fff" />
                <Text style={styles.buttonText}>Manage</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <MaterialIcons name="calendar-today" size={16} color="#fff" />
                <Text style={styles.buttonText}>Add to Calendar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.button}>
              <MaterialIcons name="visibility" size={16} color="#fff" />
              <Text style={styles.buttonText}>View Details</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#1C2620',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3d5245',
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
    color: '#9eb7a8',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 5,
  },
  date: {
    fontSize: 14,
    color: '#9eb7a8',
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#38e07b',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: '#111714',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default BookingCard;

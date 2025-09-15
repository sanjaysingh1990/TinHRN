
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Booking } from '../../domain/models/Booking';
import BookingCard from './BookingCard';

interface BookingsSectionProps {
  title: string;
  bookings: Booking[];
}

const BookingsSection: React.FC<BookingsSectionProps> = ({ title, bookings }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={bookings}
        renderItem={({ item }) => <BookingCard booking={item} />}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
});

export default BookingsSection;

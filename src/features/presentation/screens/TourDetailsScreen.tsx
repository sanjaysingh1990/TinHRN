
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const TourDetailsScreen = () => {
  const onBackPress = () => console.log('Back button pressed');
  const onBookPress = () => console.log('Book This Tour button pressed');

  const itineraryData = [
    { day: '01', title: 'Arrival in Kathmandu', icon: 'terrain' },
    { day: '02', title: 'Drive to Pokhara', icon: 'terrain' },
    { day: '03', title: 'Trek to Ghandruk', icon: 'terrain' },
    { day: '04', title: 'Trek to Chhomrong', icon: 'terrain' },
  ];

  const reviewsData = [
    {
      id: '1',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      name: 'Jane Doe',
      date: '2 weeks ago',
      rating: 5,
      review:
        'An absolutely breathtaking experience! The views were surreal and the guide was fantastic. Highly recommend this to anyone looking for an adventure.',
    },
    {
      id: '2',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      name: 'John Smith',
      date: '1 month ago',
      rating: 4,
      review:
        'A well-organized trek. The itinerary was perfectly paced. The only downside was the weather on one of the days, but that’s beyond anyone’s control.',
    },
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <MaterialIcons
          key={i}
          name={i <= rating ? 'star' : 'star-border'}
          size={16}
          color="#f5b331"
        />
      );
    }
    return stars;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
          style={styles.heroImage}
        />

        <View style={styles.content}>
          {/* Overview Section */}
          <View style={styles.card}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>OVERVIEW</Text>
            </View>
            <Text style={styles.cardTitle}>Annapurna Base Camp</Text>
            <Text style={styles.cardSubtitle}>14 Days • Max Altitude: 4,130m</Text>
            <Text style={styles.cardBody}>
              The Annapurna Base Camp trek is one of the most popular treks in the Annapurna region. The trail goes alongside terraced rice paddies, lush rhododendron forests, and high altitude landscapes with the Annapurna Range in view most of the time.
            </Text>
          </View>

          {/* Itinerary Section */}
          <View style={styles.card}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>ITINERARY</Text>
            </View>
            {itineraryData.map((item, index) => (
              <View key={index} style={styles.itineraryItem}>
                <View style={styles.itineraryMarker}>
                  <View style={styles.itineraryIconContainer}>
                    <MaterialIcons name={item.icon as any} size={16} color="#111714" />
                  </View>
                  {index < itineraryData.length - 1 && <View style={styles.itineraryLine} />}
                </View>
                <View style={styles.itineraryContent}>
                  <Text style={styles.itineraryDay}>Day {item.day}</Text>
                  <Text style={styles.itineraryTitle}>{item.title}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Pricing Section */}
          <View style={styles.card}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>PRICING</Text>
            </View>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Standard Package</Text>
              <Text style={styles.pricingValue}>$1,200 / person</Text>
            </View>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Premium Package</Text>
              <Text style={styles.pricingValue}>$1,800 / person</Text>
            </View>
          </View>

          {/* Reviews Section */}
          <View style={styles.card}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>REVIEWS</Text>
            </View>
            {reviewsData.map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <Image source={{ uri: review.avatar }} style={styles.reviewAvatar} />
                <View style={styles.reviewContent}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewName}>{review.name}</Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                  <View style={styles.reviewStars}>{renderStars(review.rating)}</View>
                  <Text style={styles.reviewText}>{review.review}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Header */}
      <View style={styles.headerContainer}>
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
        <TouchableOpacity onPress={onBackPress} style={styles.headerButton}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tour Details</Text>
        <View style={styles.headerButton} />
      </View>

      {/* Sticky Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={onBookPress} style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book This Tour</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111714',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for the sticky footer
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 16,
    height: 60 + (StatusBar.currentHeight || 0),
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  heroImage: {
    width: '100%',
    height: 360,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#1C2620',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3d5245',
    borderStyle: 'dashed',
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -14,
    backgroundColor: '#38e07b',
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  badgeText: {
    color: '#111714',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  cardSubtitle: {
    color: '#9eb7a8',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 16,
  },
  cardBody: {
    color: '#9eb7a8',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  itineraryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 16,
  },
  itineraryMarker: {
    alignItems: 'center',
    marginRight: 16,
  },
  itineraryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#38e07b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itineraryLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#3d5245',
    marginTop: 4,
  },
  itineraryContent: {
    flex: 1,
  },
  itineraryDay: {
    color: '#9eb7a8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  itineraryTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3d5245',
  },
  pricingLabel: {
    color: '#fff',
    fontSize: 16,
  },
  pricingValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewItem: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
  },
  reviewAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  reviewDate: {
    color: '#9eb7a8',
    fontSize: 12,
  },
  reviewStars: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewText: {
    color: '#9eb7a8',
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(17, 23, 20, 0.8)',
  },
  bookButton: {
    backgroundColor: '#38e07b',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#111714',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TourDetailsScreen;

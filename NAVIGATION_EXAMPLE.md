// Example navigation hookup from Profile screen to About Us screen
// This shows how the navigation was implemented

// In ProfileScreen.tsx, the About Us navigation is connected like this:

import { useRouter } from 'expo-router';

const ProfileScreen = () => {
  const router = useRouter();
  
  // ... other code ...
  
  return (
    // ... other JSX ...
    <View style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>OTHERS</Text>
      </View>
      {/* About Us navigation - when pressed, navigates to about-us screen */}
      <AccountItem 
        icon="info-outline" 
        title="About Us" 
        onPress={() => router.push('/about-us')} 
      />
      <AccountItem icon="help-outline" title="FAQ" onPress={() => {}} />
      <AccountItem icon="description" title="Terms and Conditions" onPress={() => {}} />
    </View>
    // ... other JSX ...
  );
};

// The route file app/about-us.tsx exports the AboutUsScreen component
// This enables navigation to /about-us path which renders the AboutUsScreen

// Key Navigation Points:
// 1. Added useRouter import to ProfileScreen
// 2. Added router.push('/about-us') to About Us AccountItem onPress
// 3. Created app/about-us.tsx route file
// 4. Added about-us screen configuration to app/_layout.tsx Stack
// 5. Used modal presentation with slide_from_right animation
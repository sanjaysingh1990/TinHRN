# About Us Screen - Team Section Implementation

## Summary of Changes

The About Us screen has been enhanced with a comprehensive team section that includes:

### 1. **New Domain Models**
- `TeamMember.ts` - Interface defining team member properties (id, name, designation, tagline, phone, email, image)

### 2. **Repository Updates**
- Updated `IProfileRepository` interface to include `getTeamMembers()` method
- Enhanced `ProfileRepository` with dummy team data (5 members) and 2-second loading delay as requested

### 3. **View Model Architecture**
- Created `AboutUsViewModel` following clean architecture pattern
- Registered view model in dependency injection container
- Uses ProfileRepository to fetch team data

### 4. **UI Components**
- **`TeamMemberCard`** - Displays team member in horizontal scrollable list
- **`TeamMemberShimmer`** - Loading placeholder with animated shimmer effect
- **`TeamMemberBottomSheet`** - Detailed view with contact options (phone & email)

### 5. **Screen Enhancements**
- Added "Our Team" section to About Us screen
- Horizontal FlatList showing team members
- 2-second loading delay with shimmer placeholders
- Tap functionality to open detailed bottom sheet
- Full dark/light mode support

### 6. **Localization Support**
- Updated English and Hindi locale files with team section strings
- Integrated with existing i18n system

### 7. **Features Implemented**
✅ **Team Section**: Added below mission and values sections
✅ **Dummy Data**: 5 team members with realistic Indian names and roles
✅ **2-Second Delay**: Shimmer loading for exactly 2 seconds
✅ **Horizontal Scroll**: Team members displayed in horizontal list
✅ **Bottom Sheet**: Detailed view with circular image, contact info
✅ **Contact Actions**: Phone and email links that open native apps
✅ **Dark/Light Mode**: Full theme support using Redux-based theme system
✅ **Clean Architecture**: Separate view model using profile repository
✅ **Type Safety**: Full TypeScript implementation

### 8. **Navigation Integration**
- Team member details accessible via bottom sheet
- Contact information with direct phone/email actions
- Gesture handling for smooth interactions

### 9. **Technical Implementation**
- Uses existing theme system (`useTheme` hook)
- Follows project's clean architecture pattern
- Integrates with dependency injection container
- Supports internationalization
- Responsive design for different screen sizes

## Usage
1. Navigate to Profile → About Us
2. Scroll to "Our Team" section
3. Wait 2 seconds for team data to load (with shimmer effect)
4. Tap any team member to view details
5. Use phone/email buttons to contact team members

All components support both light and dark modes and will automatically switch based on the theme setting in the profile screen.
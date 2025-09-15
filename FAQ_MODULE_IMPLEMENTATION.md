# FAQ Module Implementation - Complete Clean Architecture

## 📂 Architecture Overview

This implementation follows the **Clean Architecture** pattern with clear separation of concerns:

```
src/features/profile/
├── domain/
│   ├── models/Faq.ts                    # FAQ domain model
│   └── usecases/GetFaqListUseCase.ts    # Business logic use case
├── data/
│   └── repositories/ProfileRepository.ts # Updated with FAQ data access
├── presentation/
│   ├── screens/FaqScreen.tsx            # Main FAQ screen
│   ├── components/
│   │   ├── FaqItem.tsx                  # Expandable FAQ item component
│   │   └── FaqShimmer.tsx               # Loading shimmer placeholder
│   ├── viewmodels/FaqViewModel.ts       # Presentation logic
│   └── locales/                         # Internationalization
│       ├── en.ts                        # English strings
│       └── hi.ts                        # Hindi strings
```

## ✅ Features Implemented

### 1. **Domain Layer**
- **`Faq` Model**: Interface with id, question, answer, and category
- **`GetFaqListUseCase`**: Business logic for fetching FAQ data
- **Repository Interface**: Updated `IProfileRepository` with `getFaqList()` method

### 2. **Data Layer**
- **ProfileRepository**: Enhanced with 8 comprehensive FAQ entries
- **2.5-second loading delay**: Simulates API call as requested
- **Realistic dummy data**: Covers trekking, safety, booking, and preparation topics

### 3. **Presentation Layer**
- **FaqScreen**: Main screen with header, title, and expandable list
- **FaqItem**: Expandable/collapsible FAQ component with smooth animations
- **FaqShimmer**: Loading placeholder with animated shimmer effect
- **FaqViewModel**: Clean presentation logic following MVVM pattern

### 4. **UI/UX Features**
- **Expandable Items**: Touch to expand/collapse with `LayoutAnimation`
- **Dashed Borders**: Consistent with app design using borderStyle: 'dashed'
- **Category Labels**: Color-coded category tags for better organization
- **Dark/Light Mode**: Full theme support using Redux-based theme system
- **Typography**: Uses Spline Sans and Noto Sans fonts as specified

### 5. **Navigation Integration**
- **Route Configuration**: Added `/faq` route with modal presentation
- **Profile Integration**: Connected FAQ option in Profile → Others section
- **Header Navigation**: Back button with proper navigation flow

### 6. **Localization Support**
- **English & Hindi**: Complete translation support
- **Dynamic Language**: Integrates with existing i18n system
- **Contextual Strings**: Localized titles, subtitles, and navigation

## 🎨 Design Implementation

### **Color Scheme (Theme-Aware)**
```typescript
// Light Mode
background: '#FFFFFF'
cardBackground: '#f8f8f8'
text: '#171511'
secondary: '#b7af9e'
primary: '#df9c20'
border: '#e0e0e0'

// Dark Mode  
background: '#171511'
cardBackground: '#231f1c'
text: '#FFFFFF'
secondary: '#b7af9e'
primary: '#df9c20'
border: '#444444'
```

### **Typography**
- **Headers**: Spline Sans, bold, 20-28px
- **Questions**: Spline Sans, semibold, 16px
- **Answers**: Noto Sans, regular, 14px
- **Categories**: Primary color, 12px, medium weight

### **Animations**
- **Expand/Collapse**: `LayoutAnimation.Presets.easeInEaseOut`
- **Shimmer Effect**: Continuous linear gradient animation
- **Icon Rotation**: Smooth arrow direction change

## 🔧 Technical Implementation

### **Clean Architecture Layers**

1. **Domain**: Pure business logic, no dependencies
2. **Data**: Repository implementation with dummy data
3. **Presentation**: React components and ViewModels
4. **Infrastructure**: Dependency injection via tsyringe

### **State Management**
- **Loading States**: Shimmer during 2.5s delay
- **Expansion States**: Individual FAQ item expansion tracking
- **Theme Integration**: Redux-based theme system
- **Error Handling**: Graceful fallbacks in ViewModel

### **Performance Optimizations**
- **FlatList**: Efficient rendering for large FAQ lists
- **Conditional Rendering**: Separate loading and content states
- **Layout Animation**: Native animation performance
- **Theme Caching**: Efficient color scheme switching

## 📱 User Experience Flow

1. **Navigation**: Profile → Others → FAQ
2. **Loading**: 2.5-second shimmer placeholder (6 items)
3. **Content**: Scrollable list of categorized FAQs
4. **Interaction**: Tap to expand/collapse answers
5. **Theme**: Automatic light/dark mode support
6. **Localization**: English/Hindi language switching

## 🚀 Usage

### **Navigation Path**
```
Profile Screen → Others Section → FAQ → FaqScreen
```

### **Key Interactions**
- **Tap FAQ Item**: Expands/collapses with smooth animation
- **Scroll**: Vertical scrolling through FAQ list
- **Back Navigation**: Returns to Profile screen
- **Theme Toggle**: Automatic theme updates from Profile

### **Data Categories**
- Preparation, Difficulty, Packages, Safety
- Insurance, Experience, Health, Booking

## 🛠️ Dependencies & Integrations

### **Existing Integrations**
- **Redux Theme System**: `useTheme` hook integration
- **i18n System**: `useI18n` hook for localization
- **Container DI**: tsyringe dependency injection
- **Navigation**: expo-router with modal presentation

### **New Dependencies Added**
- `GetFaqListUseCase` → Container registration
- `FaqViewModel` → Container registration  
- FAQ route → App layout configuration
- Locale strings → Existing i18n structure

## 📊 Technical Specifications

- **Loading Delay**: 2.5 seconds (configurable)
- **Shimmer Items**: 6 placeholder items
- **FAQ Count**: 8 comprehensive entries
- **Animation Duration**: ~300ms for smooth UX
- **Font Support**: Spline Sans, Noto Sans fallbacks
- **Theme Support**: Light/Dark mode complete
- **Language Support**: English/Hindi with i18n
- **Architecture**: Clean Architecture with MVVM

The implementation provides a production-ready FAQ module that seamlessly integrates with the existing codebase while maintaining consistency in design, architecture, and user experience patterns.
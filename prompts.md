You are generating a new module for an Expo React Native app that follows Clean Architecture.  
We already have a `feature/tourdetails` module which includes repository, domain, and data layers.  
Now, create a new **feature/bookingConfirmation** module that only includes the **UI (screens/components)** and **ViewModel**.  
For data, pull dummy booking info from the existing repository (tourdetails repository).  
make sure ui should be dark and light mode friendly
in styling of each screen same colors keep repeating better create a color class for dark and light mode to avoid same color repeation for each screeen.

### Requirements:
1. **Architecture**
   - Follow the same Clean Architecture pattern as `feature/tourdetails`.
   - Place the new screen in `features/presentation/screens/bookingConfirmation`.
   - Create a ViewModel in `features/presentation/viewmodels/BookingConfirmationViewModel.ts`.
   - Fetch dummy booking confirmation data (tour name, booking reference, date, duration, amount) from repository with a 2s delay to simulate API loading.
   - Show shimmer/skeleton UI while loading.

2. **UI**
   - The design must match exactly the provided HTML design:
     - Header: Back button + Title "Order Confirmation".
     - Success icon with green check inside dashed circle.
     - Title: "Booking Confirmed!"
     - Subtitle: "Your adventure with Tent’in Himalayas is set. We're thrilled to have you join us!"
     - Booking info card (Tour Name, Reference, Date, Duration, Total Amount).
     - Footer with 3 buttons:
       - **Primary (orange)**: "View Booking Details"
       - **Secondary (dark bg)**: "Share Booking" with share icon
       - **Tertiary (transparent)**: "Back to Home"

   - Fonts: Use `Manrope` and `Noto Sans` from Google Fonts.
   - Colors: Use variables from design
     - `--primary-color: #c9731d;`
     - `--background-color: #171411;`
     - `--text-color: #ffffff;`
     - `--secondary-text-color: #b7ab9e;`
     - `--card-background-color: #231f1c;`
     - `--button-secondary-bg: #383029;`

3. **State Flow**
   - On screen mount, call ViewModel to load booking confirmation data (simulate with repository + delay).
   - While loading, show shimmer placeholders for booking card and buttons.
   - After success, display confirmation screen.

4. **Navigation Flow**
   - Connect this new Booking Confirmation screen with the "Book this Tour" button in `TourDetailsScreen`.
   - After booking is done, navigate user to `BookingConfirmationScreen`.
   - "View Booking Details" → navigates to existing BookingDetails screen.
   - "Back to Home" → navigates to Home screen.
   - "Share Booking" → opens share sheet with booking info.

5. **Implementation Notes**
   - Use TypeScript.
   - Use React Native functional components with hooks.
   - Use shimmer loading placeholder (e.g., `react-native-shimmer-placeholder`).
   - Ensure styles match **100%** the provided HTML design.

### Deliverables:
- `BookingConfirmationScreen.tsx`
- `BookingConfirmationViewModel.ts`
- Dummy repository method in `tourdetailsRepository` to provide booking confirmation info.
- Navigation wiring to connect "Book this Tour" → `BookingConfirmationScreen`.

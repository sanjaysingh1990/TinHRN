import { container } from 'tsyringe';
import { BookingConfirmationViewModel } from './presentation/viewmodels/BookingConfirmationViewModel';

export const BookingConfirmationViewModelToken = Symbol('BookingConfirmationViewModel');

export function registerBookingConfirmationDependencies() {
  container.register(BookingConfirmationViewModelToken, {
    useClass: BookingConfirmationViewModel,
  });
}

// Auto-register dependencies
registerBookingConfirmationDependencies();
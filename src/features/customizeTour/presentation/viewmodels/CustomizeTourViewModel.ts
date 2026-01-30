import { inject, injectable } from 'tsyringe';
import { IMyBookingsRepository } from '../../../mybookings/domain/repositories/IMyBookingsRepository';
import { MyBookingsRepositoryToken } from '../../../mybookings/mybookings.di';
import { CustomizeTourRepositoryToken } from '../../customizeTour.di';
import {
  CustomizationSelection,
  CustomizeTourData,
  TentOption
} from '../../domain/entities/CustomizeTour';
import { ICustomizeTourRepository } from '../../domain/repositories/ICustomizeTourRepository';

@injectable()
export class CustomizeTourViewModel {
  private _customizationData: CustomizeTourData | null = null;
  private _isLoading: boolean = false;
  private _selection: CustomizationSelection = {
    startDate: null,
    endDate: null,
    selectedTent: null,
    selectedAddOns: [],
    totalPrice: 0
  };
  private _bookingLoading: boolean = false;
  private _paymentProcessing: boolean = false;
  private _updateCallback: (() => void) | null = null;
  private _tourId: string = '';
  private _tourName: string = '';
  private _tourImage: string = '';

  private _originalTotalPrice: number = 0;
  private _originalSelection: CustomizationSelection | null = null;
  private _bookingId: string | null = null;
  private _isEditMode: boolean = false;

  constructor(
    @inject(CustomizeTourRepositoryToken)
    private repository: ICustomizeTourRepository,
    @inject(MyBookingsRepositoryToken)
    private myBookingsRepository: IMyBookingsRepository
  ) { }

  setUpdateCallback(callback: () => void): void {
    this._updateCallback = callback;
  }

  setTourId(tourId: string): void {
    this._tourId = tourId;
  }

  setTourName(tourName: string): void {
    this._tourName = tourName;
  }

  setTourImage(tourImage: string): void {
    this._tourImage = tourImage;
  }

  private notifyUpdate(): void {
    if (this._updateCallback) {
      this._updateCallback();
    }
  }

  get customizationData(): CustomizeTourData | null {
    return this._customizationData;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get selection(): CustomizationSelection {
    return this._selection;
  }

  get totalPrice(): number {
    return this._selection.totalPrice;
  }

  get isBookingLoading(): boolean {
    return this._bookingLoading;
  }

  get isPaymentProcessing(): boolean {
    return this._paymentProcessing;
  }

  get isEditMode(): boolean {
    return this._isEditMode;
  }

  get priceDifference(): number {
    return Math.max(0, this._selection.totalPrice - this._originalTotalPrice);
  }

  get originalTotalPrice(): number {
    return this._originalTotalPrice;
  }

  get hasChanges(): boolean {
    if (!this._isEditMode || !this._originalSelection) return true;

    // Check dates
    const startChanged = this._selection.startDate?.getTime() !== this._originalSelection.startDate?.getTime();
    const endChanged = this._selection.endDate?.getTime() !== this._originalSelection.endDate?.getTime();
    if (startChanged || endChanged) return true;

    // Check tent
    if (this._selection.selectedTent?.id !== this._originalSelection.selectedTent?.id) return true;

    // Check add-ons
    if (this._selection.selectedAddOns.length !== this._originalSelection.selectedAddOns.length) return true;

    const currentAddOnIds = this._selection.selectedAddOns.map(a => a.id).sort();
    const originalAddOnIds = this._originalSelection.selectedAddOns.map(a => a.id).sort();

    return JSON.stringify(currentAddOnIds) !== JSON.stringify(originalAddOnIds);
  }

  async loadCustomizationData(): Promise<void> {
    this._isLoading = true;
    this.notifyUpdate();
    try {
      this._customizationData = await this.repository.getCustomizationData();
    } catch (error) {
      console.error('Error loading customization data:', error);
      throw error;
    } finally {
      this._isLoading = false;
      this.notifyUpdate();
    }
  }

  selectStartDate(date: Date | null): void {
    this._selection.startDate = date;
    // If end date is before start date, reset end date
    if (this._selection.endDate && date && this._selection.endDate < date) {
      this._selection.endDate = null;
    }
    this.calculateTotalPrice();
    this.notifyUpdate();
  }

  selectEndDate(date: Date | null): void {
    // Only allow end date to be set if start date is already selected
    if (date === null) {
      this._selection.endDate = null;
      this.calculateTotalPrice();
      this.notifyUpdate();
      return;
    }

    if (this._selection.startDate && date >= this._selection.startDate) {
      this._selection.endDate = date;
      this.calculateTotalPrice();
      this.notifyUpdate();
    }
  }

  selectTent(tent: TentOption): void {
    // Reset tent selection state for all tents
    if (this._customizationData) {
      this._customizationData.tentOptions.forEach(t => {
        t.isSelected = false;
      });
    }

    // Set selected tent
    tent.isSelected = true;
    this._selection.selectedTent = tent;
    this.calculateTotalPrice();
    this.notifyUpdate();
  }

  toggleAddOn(addOnId: string): void {
    if (!this._customizationData) return;

    const addOn = this._customizationData.addOns.find(a => a.id === addOnId);
    if (!addOn) return;

    const existingIndex = this._selection.selectedAddOns.findIndex(a => a.id === addOnId);

    if (existingIndex >= 0) {
      // Remove add-on
      this._selection.selectedAddOns.splice(existingIndex, 1);
      addOn.isSelected = false;
    } else {
      // Add add-on
      const selectedAddOn = { ...addOn, isSelected: true };
      this._selection.selectedAddOns.push(selectedAddOn);
      addOn.isSelected = true;
    }

    this.calculateTotalPrice();
    this.notifyUpdate();
  }

  private calculateTotalPrice(): void {
    let total = 0;

    // Calculate number of nights
    let nights = 1;
    if (this._selection.startDate && this._selection.endDate) {
      const timeDiff = this._selection.endDate.getTime() - this._selection.startDate.getTime();
      nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
      // Ensure at least 1 night
      nights = Math.max(1, nights);
    }

    // Add tent price for number of nights
    if (this._selection.selectedTent) {
      total += this._selection.selectedTent.pricePerNight * nights;
    }

    // Add selected add-ons
    this._selection.selectedAddOns.forEach(addOn => {
      total += addOn.price;
    });

    this._selection.totalPrice = total;
  }

  async saveCustomization(): Promise<{ success: boolean; customizationId: string }> {
    if (!this._selection.startDate || !this._selection.selectedTent) {
      throw new Error('Please select a date and tent before saving');
    }

    try {
      const result = await this.repository.saveCustomization(this._selection);
      return result;
    } catch (error) {
      console.error('Error saving customization:', error);
      throw error;
    }
  }

  async processPayment(customerEmail: string): Promise<{ success: boolean; error?: string }> {
    if (!this._selection.startDate || !this._selection.selectedTent) {
      const errorMsg = 'Please select a date and tent before processing payment';
      console.error(errorMsg);
      return { success: false, error: errorMsg };
    }

    this._paymentProcessing = true;
    this.notifyUpdate();
    try {
      console.log('Processing payment with amount:', this._selection.totalPrice);
      const result = await this.repository.processPayment(
        this._selection.totalPrice,
        'USD',
        customerEmail
      );
      console.log('Payment processing result:', result);
      return result;
    } catch (error: any) {
      console.error('Error processing payment:', error);
      return { success: false, error: error.message || 'Failed to process payment' };
    } finally {
      this._paymentProcessing = false;
      this.notifyUpdate();
    }
  }

  async bookTour(): Promise<{ success: boolean; bookingId: string }> {
    if (!this._selection.startDate || !this._selection.selectedTent) {
      throw new Error('Please select a date and tent before booking');
    }

    if (!this._tourId) {
      throw new Error('Tour ID is required for booking');
    }

    if (!this._tourName) {
      throw new Error('Tour name is required for booking');
    }

    if (!this._tourImage) {
      throw new Error('Tour image is required for booking');
    }

    this._bookingLoading = true;
    this.notifyUpdate();
    try {
      const result = await this.repository.bookTour(this._tourId, this._tourName, this._tourImage, this._selection);
      return result;
    } catch (error) {
      console.error('Error booking tour:', error);
      throw error;
    } finally {
      this._bookingLoading = false;
      this.notifyUpdate();
    }
  }

  isSelectionComplete(): boolean {
    return this._selection.startDate !== null && this._selection.selectedTent !== null;
  }

  async loadBookingForEdit(bookingId: string): Promise<void> {
    this._isLoading = true;
    this._isEditMode = true;
    this._bookingId = bookingId;
    this.notifyUpdate();

    try {
      // Load available options first
      await this.loadCustomizationData();

      // Load booking data
      const booking = await this.myBookingsRepository.getBookingById(bookingId);
      if (!booking) throw new Error('Booking not found');

      // Map booking data to selection
      this._tourId = booking.tourId;
      this._tourName = booking.tourName;
      this._tourImage = booking.tourImage;
      this._originalTotalPrice = booking.totalPrice || 0;

      // Set dates
      this._selection.startDate = booking.startDate;
      this._selection.endDate = booking.endDate;

      // Match tent option
      if (booking.customization?.tentType && this._customizationData) {
        const tentName = booking.customization.tentType.type;
        const matchingTent = this._customizationData.tentOptions.find(t => t.name === tentName);
        if (matchingTent) {
          this.selectTent(matchingTent);
        }
      }

      // Match add-ons
      if (booking.customization?.addons && this._customizationData) {
        this._selection.selectedAddOns = []; // Clear current
        this._customizationData.addOns.forEach(addOn => {
          // Check if this addOn exists in booking customization
          const isSelected = booking.customization!.addons.some(a => a.addonName === addOn.name);
          addOn.isSelected = isSelected;
          if (isSelected) {
            this._selection.selectedAddOns.push({ ...addOn, isSelected: true });
          } else {
            addOn.isSelected = false;
          }
        });
      }

      this.calculateTotalPrice();
      // Store original selection for change detection
      this._originalSelection = JSON.parse(JSON.stringify(this._selection));
      // Restore dates as Date objects after deep copy
      if (this._originalSelection) {
        this._originalSelection.startDate = this._selection.startDate ? new Date(this._selection.startDate) : null;
        this._originalSelection.endDate = this._selection.endDate ? new Date(this._selection.endDate) : null;
      }
    } catch (error) {
      console.error('Error loading booking for edit:', error);
      throw error;
    } finally {
      this._isLoading = false;
      this.notifyUpdate();
    }
  }

  async updateBooking(): Promise<{ success: boolean }> {
    if (!this._bookingId) throw new Error('No booking ID for update');

    this._bookingLoading = true;
    this.notifyUpdate();

    try {
      const difference = this.priceDifference;

      // If there's a price increase, we assume payment was handled in processPayment
      // In a real app, we'd verify the payment transaction here

      const result = await this.repository.updateBooking(this._bookingId, this._selection, difference);
      return result;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    } finally {
      this._bookingLoading = false;
      this.notifyUpdate();
    }
  }

  resetSelection(): void {
    this._selection = {
      startDate: null,
      endDate: null,
      selectedTent: null,
      selectedAddOns: [],
      totalPrice: 0
    };
    this._isEditMode = false;
    this._bookingId = null;
    this._originalTotalPrice = 0;

    // Reset add-on and tent selection state
    if (this._customizationData) {
      this._customizationData.addOns.forEach(addOn => {
        addOn.isSelected = false;
      });
      this._customizationData.tentOptions.forEach(tent => {
        tent.isSelected = false;
      });
    }

    this.notifyUpdate();
  }
}
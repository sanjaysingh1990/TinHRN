import { inject, injectable } from 'tsyringe';
import { 
  CustomizeTourData, 
  CustomizationSelection, 
  TentOption, 
  AddOn 
} from '../../domain/entities/CustomizeTour';
import { ICustomizeTourRepository } from '../../domain/repositories/ICustomizeTourRepository';
import { CustomizeTourRepositoryToken } from '../../data/di/tokens';

@injectable()
export class CustomizeTourViewModel {
  private _customizationData: CustomizeTourData | null = null;
  private _isLoading: boolean = false;
  private _selection: CustomizationSelection = {
    selectedDate: null,
    selectedTent: null,
    selectedAddOns: [],
    totalPrice: 0
  };
  private _bookingLoading: boolean = false;
  private _updateCallback: (() => void) | null = null;

  constructor(
    @inject(CustomizeTourRepositoryToken) 
    private repository: ICustomizeTourRepository
  ) {}

  setUpdateCallback(callback: () => void): void {
    this._updateCallback = callback;
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

  selectDate(date: Date): void {
    this._selection.selectedDate = date;
    this.calculateTotalPrice();
    this.notifyUpdate();
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

    // Add tent price (assuming 1 night for now)
    if (this._selection.selectedTent) {
      total += this._selection.selectedTent.pricePerNight;
    }

    // Add selected add-ons
    this._selection.selectedAddOns.forEach(addOn => {
      total += addOn.price;
    });

    this._selection.totalPrice = total;
  }

  async saveCustomization(): Promise<{ success: boolean; customizationId: string }> {
    if (!this._selection.selectedDate || !this._selection.selectedTent) {
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

  async bookTour(): Promise<{ success: boolean; bookingId: string }> {
    if (!this._selection.selectedDate || !this._selection.selectedTent) {
      throw new Error('Please select a date and tent before booking');
    }

    this._bookingLoading = true;
    this.notifyUpdate();
    try {
      const result = await this.repository.bookTour(this._selection);
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
    return this._selection.selectedDate !== null && this._selection.selectedTent !== null;
  }

  resetSelection(): void {
    this._selection = {
      selectedDate: null,
      selectedTent: null,
      selectedAddOns: [],
      totalPrice: 0
    };

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
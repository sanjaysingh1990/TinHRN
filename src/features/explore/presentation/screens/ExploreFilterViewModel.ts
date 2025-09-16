import { injectable } from 'tsyringe';

export interface FilterState {
  difficulty?: string;
  terrains: string[];
  amenities: string[];
  durationRange: [number, number];
}

@injectable()
export class ExploreFilterViewModel {
  private _selectedDifficulty: string | null = null;
  private _selectedTerrains: string[] = [];
  private _selectedAmenities: string[] = [];
  private _durationRange: [number, number] = [1, 7];
  private updateCallback: (() => void) | null = null;

  constructor() {}

  get selectedDifficulty(): string | null {
    return this._selectedDifficulty;
  }

  get selectedTerrains(): string[] {
    return [...this._selectedTerrains];
  }

  get selectedAmenities(): string[] {
    return [...this._selectedAmenities];
  }

  get durationRange(): [number, number] {
    return [...this._durationRange] as [number, number];
  }

  setUpdateCallback(callback: () => void): void {
    this.updateCallback = callback;
  }

  private notifyUpdate(): void {
    if (this.updateCallback) {
      this.updateCallback();
    }
  }

  setDifficulty(difficulty: string): void {
    this._selectedDifficulty = this._selectedDifficulty === difficulty ? null : difficulty;
    this.notifyUpdate();
  }

  toggleTerrain(terrain: string): void {
    const index = this._selectedTerrains.indexOf(terrain);
    if (index > -1) {
      this._selectedTerrains.splice(index, 1);
    } else {
      this._selectedTerrains.push(terrain);
    }
    this.notifyUpdate();
  }

  toggleAmenity(amenity: string): void {
    const index = this._selectedAmenities.indexOf(amenity);
    if (index > -1) {
      this._selectedAmenities.splice(index, 1);
    } else {
      this._selectedAmenities.push(amenity);
    }
    this.notifyUpdate();
  }

  setDurationRange(range: [number, number]): void {
    this._durationRange = range;
    this.notifyUpdate();
  }

  clearFilters(): void {
    this._selectedDifficulty = null;
    this._selectedTerrains = [];
    this._selectedAmenities = [];
    this._durationRange = [1, 7];
    this.notifyUpdate();
  }

  applyFilters(): FilterState {
    return this.getFilters();
  }

  getFilters(): FilterState {
    return {
      difficulty: this._selectedDifficulty || undefined,
      terrains: [...this._selectedTerrains],
      amenities: [...this._selectedAmenities],
      durationRange: [...this._durationRange] as [number, number],
    };
  }

  hasActiveFilters(): boolean {
    return !!(
      this._selectedDifficulty ||
      this._selectedTerrains.length > 0 ||
      this._selectedAmenities.length > 0 ||
      this._durationRange[0] !== 1 ||
      this._durationRange[1] !== 7
    );
  }
}
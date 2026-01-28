import { inject, injectable } from 'tsyringe';
import { BaseViewModel } from '../../../../core/presentation/BaseViewModel';
import { Faq } from '../../domain/models/Faq';
import { GetFaqListUseCase } from '../../domain/usecases/GetFaqListUseCase';
import { GetFaqListUseCaseToken } from '../../profile.di';

@injectable()
export class FaqViewModel extends BaseViewModel {
  private _faqList: Faq[] = [];
  private _isLoading = false;

  constructor(
    @inject(GetFaqListUseCaseToken) private getFaqListUseCase: GetFaqListUseCase
  ) {
    super();
  }

  get faqList(): Faq[] {
    return this._faqList;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  async loadFaqList(): Promise<void> {
    this._isLoading = true;
    this.notifyUpdate();

    try {
      this._faqList = await this.getFaqListUseCase.execute();
    } catch (error) {
      console.error('FaqViewModel: Error loading FAQ list:', error);
    } finally {
      this._isLoading = false;
      this.notifyUpdate();
    }
  }

  // Deprecated compatibility methods
  async getFaqList(): Promise<Faq[]> {
    return this.getFaqListUseCase.execute();
  }
}
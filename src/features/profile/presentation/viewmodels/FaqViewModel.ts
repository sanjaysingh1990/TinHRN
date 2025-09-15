import { inject, injectable } from 'tsyringe';
import { GetFaqListUseCase } from '../../domain/usecases/GetFaqListUseCase';
import { GetFaqListUseCaseToken } from '../../profile.di';
import { Faq } from '../../domain/models/Faq';

@injectable()
export class FaqViewModel {
  constructor(
    @inject(GetFaqListUseCaseToken) private getFaqListUseCase: GetFaqListUseCase
  ) {}

  async getFaqList(): Promise<Faq[]> {
    try {
      return await this.getFaqListUseCase.execute();
    } catch (error) {
      console.error('Error fetching FAQ list:', error);
      return [];
    }
  }
}
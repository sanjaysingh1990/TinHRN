import { inject, injectable } from 'tsyringe';
import { MyBookingsRepositoryToken } from '../../mybookings.di';
import { Booking } from '../models/Booking';
import { IMyBookingsRepository } from '../repositories/IMyBookingsRepository';

@injectable()
export class GetAllBookingsOrderedByCreatedAtUseCase {
  constructor(
    @inject(MyBookingsRepositoryToken) private myBookingsRepository: IMyBookingsRepository
  ) {}

  async execute(): Promise<Booking[]> {
    return await this.myBookingsRepository.getAllBookingsOrderedByCreatedAt();
  }
}
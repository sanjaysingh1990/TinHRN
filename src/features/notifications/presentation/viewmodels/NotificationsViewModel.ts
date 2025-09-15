import { inject, injectable } from 'tsyringe';
import { Notification } from '../../domain/models/Notification';
import { GetNotificationsUseCase } from '../../domain/usecases/GetNotificationsUseCase';
import { GetNotificationsUseCaseToken } from '../../notifications.di';

@injectable()
export class NotificationsViewModel {
  constructor(
    @inject(GetNotificationsUseCaseToken) private getNotificationsUseCase: GetNotificationsUseCase
  ) {}

  async getNotifications(): Promise<Notification[]> {
    return this.getNotificationsUseCase.execute();
  }
}
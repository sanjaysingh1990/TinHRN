import { injectable, inject } from 'tsyringe';
import { Notification } from '../models/Notification';
import { INotificationsRepository } from '../repositories/INotificationsRepository';
import { NotificationsRepositoryToken } from '../../notifications.di';

@injectable()
export class GetNotificationsUseCase {
  constructor(
    @inject(NotificationsRepositoryToken) private notificationsRepository: INotificationsRepository
  ) {}

  async execute(): Promise<Notification[]> {
    return this.notificationsRepository.getNotifications();
  }
}
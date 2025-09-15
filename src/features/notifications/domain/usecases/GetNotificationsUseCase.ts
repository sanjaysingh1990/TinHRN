import { inject, injectable } from 'tsyringe';
import { NotificationsRepositoryToken } from '../../notifications.di';
import { Notification } from '../models/Notification';
import { INotificationsRepository } from '../repositories/INotificationsRepository';

@injectable()
export class GetNotificationsUseCase {
  constructor(
    @inject(NotificationsRepositoryToken) private notificationsRepository: INotificationsRepository
  ) {}

  async execute(): Promise<Notification[]> {
    return this.notificationsRepository.getNotifications();
  }
}
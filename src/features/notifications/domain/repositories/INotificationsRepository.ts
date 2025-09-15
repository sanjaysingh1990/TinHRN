import { Notification } from '../models/Notification';

export interface INotificationsRepository {
  getNotifications(): Promise<Notification[]>;
}
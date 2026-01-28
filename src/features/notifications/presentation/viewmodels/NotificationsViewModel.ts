import { inject, injectable } from 'tsyringe';
import { BaseViewModel } from '../../../../core/presentation/BaseViewModel';
import { Notification } from '../../domain/models/Notification';
import { GetNotificationsUseCase } from '../../domain/usecases/GetNotificationsUseCase';
import { GetNotificationsUseCaseToken } from '../../notifications.di';

@injectable()
export class NotificationsViewModel extends BaseViewModel {
  private _notifications: Notification[] = [];
  private _isLoading = false;

  constructor(
    @inject(GetNotificationsUseCaseToken) private getNotificationsUseCase: GetNotificationsUseCase
  ) {
    super();
  }

  get notifications(): Notification[] {
    return this._notifications;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  async loadNotifications(): Promise<void> {
    this._isLoading = true;
    this.notifyUpdate();

    try {
      this._notifications = await this.getNotificationsUseCase.execute();
    } catch (error) {
      console.error('NotificationsViewModel: Error loading notifications:', error);
    } finally {
      this._isLoading = false;
      this.notifyUpdate();
    }
  }

  // Deprecated compatibility methods
  async getNotifications(): Promise<Notification[]> {
    return this.getNotificationsUseCase.execute();
  }
}
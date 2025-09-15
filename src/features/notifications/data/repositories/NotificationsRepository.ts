import { injectable } from 'tsyringe';
import { Notification } from '../../domain/models/Notification';
import { INotificationsRepository } from '../../domain/repositories/INotificationsRepository';

const dummyNotifications: Notification[] = [
  {
    id: "1",
    title: "Booking Confirmed",
    message: "Your booking for the Himalayan Trek has been confirmed. Get ready for an adventure!",
    time: "2 hours ago",
    type: "booking",
    read: false
  },
  {
    id: "2",
    title: "Tour Guide Assigned",
    message: "The guide for your upcoming tour is Alex Sharma, an experienced mountaineer.",
    time: "Yesterday",
    type: "guide",
    read: false
  },
  {
    id: "3",
    title: "Special Offer",
    message: "Enjoy a 15% discount on your next booking with us. Use code: NATURE15",
    time: "3 days ago",
    type: "offer",
    read: true
  },
  {
    id: "4",
    title: "Weather Alert",
    message: "Clear skies expected for your trek next week. Perfect conditions for mountain views!",
    time: "5 days ago",
    type: "weather",
    read: true
  },
  {
    id: "5",
    title: "Trail Update",
    message: "The Annapurna Base Camp trail has reopened after recent maintenance work.",
    time: "1 week ago",
    type: "trail",
    read: true
  }
];

@injectable()
export class NotificationsRepository implements INotificationsRepository {
  async getNotifications(): Promise<Notification[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(dummyNotifications);
      }, 3000);
    });
  }
}
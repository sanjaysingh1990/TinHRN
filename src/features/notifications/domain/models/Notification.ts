export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "booking" | "guide" | "offer" | "weather" | "trail";
  read: boolean;
}

import "reflect-metadata";
import { container } from "tsyringe";
import { LoginUseCase } from "./auth/application/usecases/LoginUseCase";
import { SignupUseCase } from "./auth/application/usecases/SignupUseCase";
import { AuthRepository } from "./auth/infrastructure/repositories/AuthRepository";
import { AuthRepositoryToken, LoginUseCaseToken, SignupUseCaseToken } from "./auth/tokens";
import { GetSampleDataUseCase } from "./sample/application/usecases/GetSampleDataUseCase";
import { SampleRepository } from "./sample/infrastructure/repositories/SampleRepository";
import { GetSampleDataUseCaseToken, SampleRepositoryToken } from "./sample/tokens";

import { TourRepository } from "./features/home/data/repositories/TourRepository";
import { HomeViewModelToken, TourRepositoryToken } from "./features/home/home.di";
import { HomeViewModel } from "./features/home/presentation/viewmodels/HomeViewModel";

import { TourDetailsRepository } from "./features/tour-details/data/repositories/TourDetailsRepository";
import { TourDetailsViewModel } from "./features/tour-details/presentation/viewmodels/TourDetailsViewModel";
import { TourDetailsRepositoryToken, TourDetailsViewModelToken } from "./features/tour-details/tour-details.di";

import { ProfileRepository } from "./features/profile/data/repositories/ProfileRepository";
import { GetAchievementsUseCase } from "./features/profile/domain/usecases/GetAchievementsUseCase";
import { GetFavoritesUseCase } from "./features/profile/domain/usecases/GetFavoritesUseCase";
import { ProfileViewModel } from "./features/profile/presentation/viewmodels/ProfileViewModel";
import { GetAchievementsUseCaseToken, GetFavoritesUseCaseToken, ProfileRepositoryToken, ProfileViewModelToken } from "./features/profile/profile.di";

import { MyBookingsRepository } from "./features/mybookings/data/repositories/MyBookingsRepository";
import { GetPastBookingsUseCase } from "./features/mybookings/domain/usecases/GetPastBookingsUseCase";
import { GetUpcomingBookingsUseCase } from "./features/mybookings/domain/usecases/GetUpcomingBookingsUseCase";
import { GetPastBookingsUseCaseToken, GetUpcomingBookingsUseCaseToken, MyBookingsRepositoryToken, MyBookingsViewModelToken } from "./features/mybookings/mybookings.di";
import { MyBookingsViewModel } from "./features/mybookings/presentation/viewmodels/MyBookingsViewModel";

import { NotificationsRepository } from "./features/notifications/data/repositories/NotificationsRepository";
import { GetNotificationsUseCase } from "./features/notifications/domain/usecases/GetNotificationsUseCase";
import { GetNotificationsUseCaseToken, NotificationsRepositoryToken, NotificationsViewModelToken } from "./features/notifications/notifications.di";
import { NotificationsViewModel } from "./features/notifications/presentation/viewmodels/NotificationsViewModel";

import { BookingConfirmationViewModel } from "./features/bookingConfirmation/presentation/viewmodels/BookingConfirmationViewModel";
import { BookingConfirmationViewModelToken } from "./features/bookingConfirmation/bookingConfirmation.di";

container.register(SampleRepositoryToken, {
  useClass: SampleRepository,
});
container.register(GetSampleDataUseCaseToken, {
  useClass: GetSampleDataUseCase,
});

container.register(AuthRepositoryToken, { useClass: AuthRepository });
container.register(LoginUseCaseToken, { useClass: LoginUseCase });
container.register(SignupUseCaseToken, { useClass: SignupUseCase });

container.register(TourRepositoryToken, { useClass: TourRepository });
container.register(HomeViewModelToken, { useClass: HomeViewModel });

container.register(TourDetailsRepositoryToken, { useClass: TourDetailsRepository });
container.register(TourDetailsViewModelToken, { useClass: TourDetailsViewModel });

container.register(ProfileRepositoryToken, { useClass: ProfileRepository });
container.register(GetAchievementsUseCaseToken, { useClass: GetAchievementsUseCase });
container.register(GetFavoritesUseCaseToken, { useClass: GetFavoritesUseCase });
container.register(ProfileViewModelToken, { useClass: ProfileViewModel });

container.register(MyBookingsRepositoryToken, { useClass: MyBookingsRepository });
container.register(GetUpcomingBookingsUseCaseToken, { useClass: GetUpcomingBookingsUseCase });
container.register(GetPastBookingsUseCaseToken, { useClass: GetPastBookingsUseCase });
container.register(MyBookingsViewModelToken, { useClass: MyBookingsViewModel });

container.register(NotificationsRepositoryToken, { useClass: NotificationsRepository });
container.register(GetNotificationsUseCaseToken, { useClass: GetNotificationsUseCase });
container.register(NotificationsViewModelToken, { useClass: NotificationsViewModel });

container.register(BookingConfirmationViewModelToken, { useClass: BookingConfirmationViewModel });

export default container;

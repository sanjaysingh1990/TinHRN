
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

import { ExploreRepository } from "./features/explore/data/repositories/ExploreRepository";
import { ExploreRepositoryToken, ExploreViewModelToken } from "./features/explore/explore.di";
import { ExploreViewModel } from "./features/explore/presentation/viewmodels/ExploreViewModel";

import { TourDetailsRepository } from "./features/tour-details/data/repositories/TourDetailsRepository";
import { TourDetailsViewModel } from "./features/tour-details/presentation/viewmodels/TourDetailsViewModel";
import { TourDetailsRepositoryToken, TourDetailsViewModelToken } from "./features/tour-details/tour-details.di";

import { ProfileRepository } from "./features/profile/data/repositories/ProfileRepository";
import { GetAchievementsUseCase } from "./features/profile/domain/usecases/GetAchievementsUseCase";
import { GetFaqListUseCase } from "./features/profile/domain/usecases/GetFaqListUseCase";
import { GetFavoritesUseCase } from "./features/profile/domain/usecases/GetFavoritesUseCase";
import { AboutUsViewModel } from "./features/profile/presentation/viewmodels/AboutUsViewModel";
import { FaqViewModel } from "./features/profile/presentation/viewmodels/FaqViewModel";
import { ProfileViewModel } from "./features/profile/presentation/viewmodels/ProfileViewModel";
import { AboutUsViewModelToken, FaqViewModelToken, GetAchievementsUseCaseToken, GetFaqListUseCaseToken, GetFavoritesUseCaseToken, ProfileRepositoryToken, ProfileViewModelToken } from "./features/profile/profile.di";

import { MyBookingsRepository } from "./features/mybookings/data/repositories/MyBookingsRepository";
import { GetPastBookingsUseCase } from "./features/mybookings/domain/usecases/GetPastBookingsUseCase";
import { GetUpcomingBookingsUseCase } from "./features/mybookings/domain/usecases/GetUpcomingBookingsUseCase";
import { GetPastBookingsUseCaseToken, GetUpcomingBookingsUseCaseToken, MyBookingsRepositoryToken, MyBookingsViewModelToken } from "./features/mybookings/mybookings.di";
import { MyBookingsViewModel } from "./features/mybookings/presentation/viewmodels/MyBookingsViewModel";

import { NotificationsRepository } from "./features/notifications/data/repositories/NotificationsRepository";
import { GetNotificationsUseCase } from "./features/notifications/domain/usecases/GetNotificationsUseCase";
import { GetNotificationsUseCaseToken, NotificationsRepositoryToken, NotificationsViewModelToken } from "./features/notifications/notifications.di";
import { NotificationsViewModel } from "./features/notifications/presentation/viewmodels/NotificationsViewModel";

import { BookingConfirmationViewModelToken } from "./features/bookingConfirmation/bookingConfirmation.di";
import { BookingConfirmationViewModel } from "./features/bookingConfirmation/presentation/viewmodels/BookingConfirmationViewModel";

import { GalleryRepositoryToken, GalleryViewModelToken, GetGalleryDataUseCaseToken, GetPostByIdUseCaseToken } from "./features/gallery/data/di/tokens";
import { GalleryRepository } from "./features/gallery/data/repositories/GalleryRepository";
import { GetGalleryDataUseCase, GetPostByIdUseCase } from "./features/gallery/domain/usecases/GalleryUseCases";
import { GalleryViewModel } from "./features/gallery/presentation/viewmodels/GalleryViewModel";

import { CustomizeTourRepositoryToken, CustomizeTourViewModelToken } from "./features/customizeTour/data/di/tokens";
import { CustomizeTourRepository } from "./features/customizeTour/data/repositories/CustomizeTourRepository";
import { CustomizeTourViewModel } from "./features/customizeTour/presentation/viewmodels/CustomizeTourViewModel";

// MapView Explore
import { MapViewExploreScreenViewModel } from "./features/explore/presentation/viewmodels/MapViewExploreScreenViewModel";

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

container.register(ExploreRepositoryToken, { useClass: ExploreRepository });
container.register(ExploreViewModelToken, { useClass: ExploreViewModel });

container.register(TourDetailsRepositoryToken, { useClass: TourDetailsRepository });
container.register(TourDetailsViewModelToken, { useClass: TourDetailsViewModel });

container.register(ProfileRepositoryToken, { useClass: ProfileRepository });
container.register(GetAchievementsUseCaseToken, { useClass: GetAchievementsUseCase });
container.register(GetFavoritesUseCaseToken, { useClass: GetFavoritesUseCase });
container.register(GetFaqListUseCaseToken, { useClass: GetFaqListUseCase });
container.register(ProfileViewModelToken, { useClass: ProfileViewModel });
container.register(AboutUsViewModelToken, { useClass: AboutUsViewModel });
container.register(FaqViewModelToken, { useClass: FaqViewModel });

container.register(MyBookingsRepositoryToken, { useClass: MyBookingsRepository });
container.register(GetUpcomingBookingsUseCaseToken, { useClass: GetUpcomingBookingsUseCase });
container.register(GetPastBookingsUseCaseToken, { useClass: GetPastBookingsUseCase });
container.register(MyBookingsViewModelToken, { useClass: MyBookingsViewModel });

container.register(NotificationsRepositoryToken, { useClass: NotificationsRepository });
container.register(GetNotificationsUseCaseToken, { useClass: GetNotificationsUseCase });
container.register(NotificationsViewModelToken, { useClass: NotificationsViewModel });

container.register(BookingConfirmationViewModelToken, { useClass: BookingConfirmationViewModel });

container.register(GalleryRepositoryToken, { useClass: GalleryRepository });
container.register(GetGalleryDataUseCaseToken, { useClass: GetGalleryDataUseCase });
container.register(GetPostByIdUseCaseToken, { useClass: GetPostByIdUseCase });
container.register(GalleryViewModelToken, { useClass: GalleryViewModel });

container.register(CustomizeTourRepositoryToken, { useClass: CustomizeTourRepository });
container.register(CustomizeTourViewModelToken, { useClass: CustomizeTourViewModel });

// MapView Explore
container.register(MapViewExploreScreenViewModel, { useClass: MapViewExploreScreenViewModel });

export default container;

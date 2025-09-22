import "reflect-metadata";
import { container } from "tsyringe";
import { AuthRepositoryToken, GetCurrentUserUseCaseToken, LoginUseCaseToken, LoginViewModelToken, LogoutUseCaseToken, SendPasswordResetEmailUseCaseToken, SignupUseCaseToken, SignupViewModelToken } from "./features/auth/auth.di";
import { AuthRepository } from "./features/auth/data/repositories/AuthRepository";
import { GetCurrentUserUseCase } from "./features/auth/domain/usecases/GetCurrentUserUseCase";
import { LoginUseCase } from "./features/auth/domain/usecases/LoginUseCase";
import { LogoutUseCase } from "./features/auth/domain/usecases/LogoutUseCase";
import { SendPasswordResetEmailUseCase } from "./features/auth/domain/usecases/SendPasswordResetEmailUseCase";
import { SignupUseCase } from "./features/auth/domain/usecases/SignupUseCase";
import { LoginViewModel } from "./features/auth/presentation/viewmodels/LoginViewModel";
import { SignupViewModel } from "./features/auth/presentation/viewmodels/SignupViewModel";
import { GetSampleDataUseCase } from "./sample/application/usecases/GetSampleDataUseCase";
import { SampleRepository } from "./sample/infrastructure/repositories/SampleRepository";
import { GetSampleDataUseCaseToken, SampleRepositoryToken } from "./sample/tokens";

import { TourRepository } from "./features/home/data/repositories/TourRepository";
import { HomeViewModelToken, TourRepositoryToken } from "./features/home/home.di";
import { HomeViewModel } from "./features/home/presentation/viewmodels/HomeViewModel";

import { ExploreRepository } from "./features/explore/data/repositories/ExploreRepository";
import { ExploreFilterViewModelToken, ExploreRepositoryToken, ExploreViewModelToken, MapViewExploreScreenViewModelToken } from "./features/explore/explore.di";
import { ExploreFilterViewModel } from "./features/explore/presentation/screens/ExploreFilterViewModel";
import { ExploreViewModel } from "./features/explore/presentation/viewmodels/ExploreViewModel";
import { MapViewExploreScreenViewModel } from "./features/explore/presentation/viewmodels/MapViewExploreScreenViewModel";

import { TourDetailsRepository } from "./features/tour-details/data/repositories/TourDetailsRepository";
import { TourDetailsViewModel } from "./features/tour-details/presentation/viewmodels/TourDetailsViewModel";
import { TourDetailsRepositoryToken, TourDetailsViewModelToken } from "./features/tour-details/tour-details.di";

import { ProfileRepository } from "./features/profile/data/repositories/ProfileRepository";
import { GetAchievementsUseCase } from "./features/profile/domain/usecases/GetAchievementsUseCase";
import { GetFaqListUseCase } from "./features/profile/domain/usecases/GetFaqListUseCase";
import { GetFavoritesUseCase } from "./features/profile/domain/usecases/GetFavoritesUseCase";
import { GetUserProfileUseCase } from "./features/profile/domain/usecases/GetUserProfileUseCase";
import { AboutUsViewModel } from "./features/profile/presentation/viewmodels/AboutUsViewModel";
import { BookingHistoryViewModel } from "./features/profile/presentation/viewmodels/BookingHistoryViewModel";
import { FaqViewModel } from "./features/profile/presentation/viewmodels/FaqViewModel";
import { ProfileViewModel } from "./features/profile/presentation/viewmodels/ProfileViewModel";
import { AboutUsViewModelToken, BookingHistoryViewModelToken, FaqViewModelToken, GetAchievementsUseCaseToken, GetFaqListUseCaseToken, GetFavoritesUseCaseToken, GetUserProfileUseCaseToken, ProfileRepositoryToken, ProfileViewModelToken } from "./features/profile/profile.di";

import { MyBookingsRepository } from "./features/mybookings/data/repositories/MyBookingsRepository";
import { GetAllBookingsOrderedByCreatedAtUseCase } from "./features/mybookings/domain/usecases/GetAllBookingsOrderedByCreatedAtUseCase";
import { GetAllBookingsUseCase } from "./features/mybookings/domain/usecases/GetAllBookingsUseCase";
import { GetPastBookingsUseCase } from "./features/mybookings/domain/usecases/GetPastBookingsUseCase";
import { GetUpcomingBookingsUseCase } from "./features/mybookings/domain/usecases/GetUpcomingBookingsUseCase";
import { GetAllBookingsOrderedByCreatedAtUseCaseToken, GetAllBookingsUseCaseToken, GetPastBookingsUseCaseToken, GetUpcomingBookingsUseCaseToken, MyBookingsRepositoryToken, MyBookingsViewModelToken } from "./features/mybookings/mybookings.di";
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

import { CustomizeTourRepositoryToken, CustomizeTourViewModelToken, PaymentServiceToken } from "./features/customizeTour/customizeTour.di";
import { CustomizeTourRepository } from "./features/customizeTour/data/repositories/CustomizeTourRepository";
import { PaymentService } from "./features/customizeTour/data/services/PaymentService";
import { CustomizeTourViewModel } from "./features/customizeTour/presentation/viewmodels/CustomizeTourViewModel";

// AddReview module dependencies
import { AddReviewScreenViewModelToken, ReviewRepositoryToken } from "./features/addreview/addreview.di";
import { ReviewRepository } from "./features/addreview/data/repositories/ReviewRepository";
import { AddReviewScreenViewModel } from "./features/addreview/presentation/viewmodels/AddReviewScreenViewModel";

// Blog module dependencies
import { BlogDetailViewModelToken, BlogListViewModelToken, BlogRepositoryToken } from "./features/blog/blog.di";
import { BlogRepositoryImpl } from "./features/blog/data/repositories/BlogRepository";
import { BlogDetailViewModel } from "./features/blog/presentation/viewmodels/BlogDetailViewModel";
import { BlogListViewModel } from "./features/blog/presentation/viewmodels/BlogListViewModel";

// Register Auth dependencies first to ensure proper initialization
container.register(AuthRepositoryToken, { useClass: AuthRepository });
container.register(LoginUseCaseToken, { useClass: LoginUseCase });
container.register(SignupUseCaseToken, { useClass: SignupUseCase });
container.register(LogoutUseCaseToken, { useClass: LogoutUseCase });
container.register(GetCurrentUserUseCaseToken, { useClass: GetCurrentUserUseCase });
container.register(SendPasswordResetEmailUseCaseToken, { useClass: SendPasswordResetEmailUseCase });
container.register(LoginViewModelToken, { useClass: LoginViewModel });
container.register(SignupViewModelToken, { useClass: SignupViewModel });

// Register other dependencies
container.register(SampleRepositoryToken, {
  useClass: SampleRepository,
});
container.register(GetSampleDataUseCaseToken, {
  useClass: GetSampleDataUseCase,
});

container.registerSingleton(TourRepositoryToken, TourRepository);
container.registerSingleton(HomeViewModelToken, HomeViewModel);

container.register(ExploreRepositoryToken, { useClass: ExploreRepository });
container.register(ExploreViewModelToken, { useClass: ExploreViewModel });
container.register(MapViewExploreScreenViewModelToken, { useClass: MapViewExploreScreenViewModel });
container.register(ExploreFilterViewModelToken, { useClass: ExploreFilterViewModel });

container.register(TourDetailsRepositoryToken, { useClass: TourDetailsRepository });
container.register(TourDetailsViewModelToken, { useClass: TourDetailsViewModel });

container.register(ProfileRepositoryToken, { useClass: ProfileRepository });
container.register(GetAchievementsUseCaseToken, { useClass: GetAchievementsUseCase });
container.register(GetFavoritesUseCaseToken, { useClass: GetFavoritesUseCase });
container.register(GetFaqListUseCaseToken, { useClass: GetFaqListUseCase });
container.register(GetUserProfileUseCaseToken, { useClass: GetUserProfileUseCase });
container.register(ProfileViewModelToken, { useClass: ProfileViewModel });
container.register(AboutUsViewModelToken, { useClass: AboutUsViewModel });
container.register(FaqViewModelToken, { useClass: FaqViewModel });
container.register(BookingHistoryViewModelToken, { useClass: BookingHistoryViewModel });

container.register(MyBookingsRepositoryToken, { useClass: MyBookingsRepository });
container.register(GetUpcomingBookingsUseCaseToken, { useClass: GetUpcomingBookingsUseCase });
container.register(GetPastBookingsUseCaseToken, { useClass: GetPastBookingsUseCase });
container.register(GetAllBookingsUseCaseToken, { useClass: GetAllBookingsUseCase });
container.register(GetAllBookingsOrderedByCreatedAtUseCaseToken, { useClass: GetAllBookingsOrderedByCreatedAtUseCase });
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
container.register(PaymentServiceToken, { useClass: PaymentService });
container.register(CustomizeTourViewModelToken, { useClass: CustomizeTourViewModel });

// AddReview module dependencies registration
container.register(ReviewRepositoryToken, { useClass: ReviewRepository });
container.register(AddReviewScreenViewModelToken, { useClass: AddReviewScreenViewModel });

// Blog module dependencies registration
container.register(BlogRepositoryToken, { useClass: BlogRepositoryImpl });
container.register(BlogListViewModelToken, { useClass: BlogListViewModel });
container.register(BlogDetailViewModelToken, { useClass: BlogDetailViewModel });

export default container;

import "reflect-metadata";
import { container } from "tsyringe";
import { GetSampleDataUseCase } from "./sample/application/usecases/GetSampleDataUseCase";
import { SampleRepository } from "./sample/infrastructure/repositories/SampleRepository";
import { GetSampleDataUseCaseToken, SampleRepositoryToken } from "./sample/tokens";
import { AuthRepository } from "./auth/infrastructure/repositories/AuthRepository";
import { LoginUseCase } from "./auth/application/usecases/LoginUseCase";
import { SignupUseCase } from "./auth/application/usecases/SignupUseCase";
import { AuthRepositoryToken, LoginUseCaseToken, SignupUseCaseToken } from "./auth/tokens";

import { TourRepository } from "./features/home/data/repositories/TourRepository";
import { HomeViewModel } from "./features/home/presentation/viewmodels/HomeViewModel";
import { TourRepositoryToken, HomeViewModelToken } from "./features/home/home.di";

import { TourDetailsRepository } from "./features/tour-details/data/repositories/TourDetailsRepository";
import { TourDetailsViewModel } from "./features/tour-details/presentation/viewmodels/TourDetailsViewModel";
import { TourDetailsRepositoryToken, TourDetailsViewModelToken } from "./features/tour-details/tour-details.di";

import { ProfileRepository } from "./features/profile/data/repositories/ProfileRepository";
import { GetAchievementsUseCase } from "./features/profile/domain/usecases/GetAchievementsUseCase";
import { GetFavoritesUseCase } from "./features/profile/domain/usecases/GetFavoritesUseCase";
import { ProfileViewModel } from "./features/profile/presentation/viewmodels/ProfileViewModel";
import { ProfileRepositoryToken, GetAchievementsUseCaseToken, GetFavoritesUseCaseToken, ProfileViewModelToken } from "./features/profile/profile.di";

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

export default container;


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

export default container;

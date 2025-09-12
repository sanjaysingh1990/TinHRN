
import "reflect-metadata";
import { container } from "tsyringe";
import { GetSampleDataUseCase } from "./sample/application/usecases/GetSampleDataUseCase";
import { SampleRepository } from "./sample/infrastructure/repositories/SampleRepository";
import { GetSampleDataUseCaseToken, SampleRepositoryToken } from "./sample/tokens";
import { AuthRepository } from "./auth/infrastructure/repositories/AuthRepository";
import { LoginUseCase } from "./auth/application/usecases/LoginUseCase";
import { SignupUseCase } from "./auth/application/usecases/SignupUseCase";
import { AuthRepositoryToken, LoginUseCaseToken, SignupUseCaseToken } from "./auth/tokens";

container.register(SampleRepositoryToken, {
  useClass: SampleRepository,
});
container.register(GetSampleDataUseCaseToken, {
  useClass: GetSampleDataUseCase,
});

container.register(AuthRepositoryToken, { useClass: AuthRepository });
container.register(LoginUseCaseToken, { useClass: LoginUseCase });
container.register(SignupUseCaseToken, { useClass: SignupUseCase });

export default container;

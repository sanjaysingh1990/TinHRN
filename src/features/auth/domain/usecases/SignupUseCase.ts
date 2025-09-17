
import { inject, injectable } from 'tsyringe';
import { UseCase } from '../../../../core/application/UseCase';
import { AuthRepositoryToken } from '../../auth.di';
import { User } from '../entities/User';
import { IAuthRepository } from '../repositories/IAuthRepository';

@injectable()
export class SignupUseCase implements UseCase<{ name: string; email: string; password: string }, Promise<User>> {
  constructor(
    @inject(AuthRepositoryToken) private authRepository: IAuthRepository
  ) {}

  execute({ name, email, password }: { name: string; email: string; password: string }): Promise<User> {
    return this.authRepository.signup(name, email, password);
  }
}

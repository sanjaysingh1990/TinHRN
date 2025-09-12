
import { inject, injectable } from 'tsyringe';
import { UseCase } from '../../../core/application/UseCase';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { AuthRepositoryToken } from '../../tokens';
import { User } from '../../domain/entities/User';

@injectable()
export class SignupUseCase implements UseCase<{ name, email, password }, Promise<User>> {
  constructor(
    @inject(AuthRepositoryToken) private authRepository: IAuthRepository
  ) {}

  execute({ name, email, password }: { name, email, password }): Promise<User> {
    return this.authRepository.signup(name, email, password);
  }
}

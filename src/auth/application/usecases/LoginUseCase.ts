
import { inject, injectable } from 'tsyringe';
import { UseCase } from '../../../core/application/UseCase';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { AuthRepositoryToken } from '../../tokens';
import { User } from '../../domain/entities/User';

@injectable()
export class LoginUseCase implements UseCase<{ email, password }, Promise<User>> {
  constructor(
    @inject(AuthRepositoryToken) private authRepository: IAuthRepository
  ) {}

  execute({ email, password }: { email, password }): Promise<User> {
    return this.authRepository.login(email, password);
  }
}

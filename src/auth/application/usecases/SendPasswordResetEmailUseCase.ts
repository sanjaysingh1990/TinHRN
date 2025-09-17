import { inject, injectable } from 'tsyringe';
import { UseCase } from '../../../core/application/UseCase';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { AuthRepositoryToken } from '../../tokens';

@injectable()
export class SendPasswordResetEmailUseCase implements UseCase<{ email: string }, Promise<void>> {
  constructor(
    @inject(AuthRepositoryToken) private authRepository: IAuthRepository
  ) {}

  execute({ email }: { email: string }): Promise<void> {
    return this.authRepository.sendPasswordResetEmail(email);
  }
}
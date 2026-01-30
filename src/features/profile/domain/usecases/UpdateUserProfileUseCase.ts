import { inject, injectable } from "tsyringe";
import { AuthRepositoryToken } from "../../../auth/auth.di";
import { IAuthRepository } from "../../../auth/domain/repositories/IAuthRepository";

export interface UpdateUserProfileParams {
    name?: string;
    photoURL?: string;
}

@injectable()
export class UpdateUserProfileUseCase {
    constructor(
        @inject(AuthRepositoryToken)
        private authRepository: IAuthRepository
    ) { }

    async execute(params: UpdateUserProfileParams): Promise<void> {
        await this.authRepository.updateProfile(params);
    }
}

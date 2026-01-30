import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { inject, injectable } from 'tsyringe';
import { BaseViewModel } from '../../../../core/presentation/BaseViewModel';
import { storage } from '../../../../infrastructure/firebase/firebase.config';
import { GetUserProfileUseCase } from '../../domain/usecases/GetUserProfileUseCase';
import { UpdateUserProfileUseCase } from '../../domain/usecases/UpdateUserProfileUseCase';
import { GetUserProfileUseCaseToken } from '../../profile.di';

@injectable()
export class EditProfileViewModel extends BaseViewModel {
    private _name = '';
    private _email = '';
    private _photoURL = '';
    private _isUpdating = false;
    private _error = '';

    constructor(
        @inject(GetUserProfileUseCaseToken) private getUserProfileUseCase: GetUserProfileUseCase,
        private updateUserProfileUseCase: UpdateUserProfileUseCase
    ) {
        super();
    }

    get name() { return this._name; }
    get email() { return this._email; }
    get photoURL() { return this._photoURL; }
    get isUpdating() { return this._isUpdating; }
    get error() { return this._error; }

    setName(name: string) {
        this._name = name;
        this.notifyUpdate();
    }

    async loadProfile(): Promise<void> {
        try {
            const profile = await this.getUserProfileUseCase.execute();
            this._name = profile.name || '';
            this._email = profile.email || '';
            this._photoURL = profile.photoURL || '';
            this.notifyUpdate();
        } catch (error: any) {
            this._error = error.message;
            this.notifyUpdate();
        }
    }

    async uploadImage(uri: string): Promise<string | null> {
        this._isUpdating = true;
        this._error = '';
        this.notifyUpdate();

        try {
            // Use XMLHttpRequest for more stable blob conversion in React Native/Expo
            const blob: any = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    resolve(xhr.response);
                };
                xhr.onerror = function (e) {
                    console.error('[EditProfileViewModel] XMLHttpRequest failed:', e);
                    reject(new TypeError("Network request failed"));
                };
                xhr.responseType = "blob";
                xhr.open("GET", uri, true);
                xhr.send(null);
            });

            const filename = `profile_pics/${Date.now()}.jpg`;
            const storageRef = ref(storage, filename);

            await uploadBytes(storageRef, blob);

            // Clean up blob if possible
            if (blob && typeof blob.close === 'function') {
                blob.close();
            }

            const downloadURL = await getDownloadURL(storageRef);

            this._photoURL = downloadURL;
            this.notifyUpdate();
            return downloadURL;
        } catch (error: any) {
            console.error('[EditProfileViewModel] Image upload failed:', error);
            this._error = `Image upload failed: ${error.message}`;
            return null;
        } finally {
            this._isUpdating = false;
            this.notifyUpdate();
        }
    }

    async updateProfile(): Promise<boolean> {
        this._isUpdating = true;
        this._error = '';
        this.notifyUpdate();

        try {
            await this.updateUserProfileUseCase.execute({
                name: this._name,
                photoURL: this._photoURL
            });
            return true;
        } catch (error: any) {
            this._error = error.message;
            return false;
        } finally {
            this._isUpdating = false;
            this.notifyUpdate();
        }
    }
}

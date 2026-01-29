import { singleton } from 'tsyringe';

export interface UploadStatus {
    isUploading: boolean;
    progress: number;
    title?: string;
    error?: string;
}

@singleton()
export class UploadService {
    private _status: UploadStatus = {
        isUploading: false,
        progress: 0,
    };

    private _listeners: ((status: UploadStatus) => void)[] = [];

    get status(): UploadStatus {
        return { ...this._status };
    }

    updateStatus(status: Partial<UploadStatus>) {
        this._status = { ...this._status, ...status };
        this.notify();
    }

    startUpload(title: string) {
        this._status = {
            isUploading: true,
            progress: 0,
            title,
            error: undefined,
        };
        this.notify();
    }

    setProgress(progress: number) {
        this._status.progress = progress;
        this.notify();
    }

    finishUpload() {
        this._status = {
            isUploading: false,
            progress: 100,
            title: undefined,
        };
        this.notify();

        // Reset after a short delay so the progress bar can hide nicely
        setTimeout(() => {
            if (!this._status.isUploading) {
                this._status.progress = 0;
                this.notify();
            }
        }, 2000);
    }

    setError(error: string) {
        this._status = {
            ...this._status,
            isUploading: false,
            error,
        };
        this.notify();
    }

    subscribe(listener: (status: UploadStatus) => void) {
        this._listeners.push(listener);
        listener(this.status);
        return () => {
            this._listeners = this._listeners.filter(l => l !== l);
        };
    }

    private notify() {
        this._listeners.forEach(listener => listener(this.status));
    }
}

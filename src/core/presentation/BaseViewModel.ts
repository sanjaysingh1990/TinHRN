
export abstract class BaseViewModel {
    private _updateCallback?: () => void;

    setUpdateCallback(callback: () => void): void {
        this._updateCallback = callback;
    }

    public notifyUpdate(): void {
        this._updateCallback?.();
    }

    /**
     * Called when the component using this ViewModel is unmounted.
     * Useful for cleaning up subscriptions or timers.
     */
    onUnmount?(): void;
}

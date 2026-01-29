
export abstract class BaseViewModel {
    private _listeners: (() => void)[] = [];

    subscribe(listener: () => void): () => void {
        this._listeners.push(listener);
        return () => {
            this._listeners = this._listeners.filter(l => l !== listener);
        };
    }

    public notifyUpdate(): void {
        this._listeners.forEach(listener => listener());
    }

    /**
     * Called when the component using this ViewModel is unmounted.
     * Useful for cleaning up subscriptions or timers.
     */
    onUnmount?(): void;
}

import { useEffect, useMemo, useState } from 'react';
import { InjectionToken } from 'tsyringe';
import container from '../container';
import { BaseViewModel } from '../core/presentation/BaseViewModel';

/**
 * A hook to resolve a ViewModel from the DI container and automatically
 * subscribe to its updates.
 * 
 * @param token The injection token for the ViewModel
 * @returns The resolved ViewModel instance
 */
export function useViewModel<T extends BaseViewModel>(token: InjectionToken<T>): T {
    const [, setTick] = useState(0);

    // Resolve the VM from the container
    const vm = useMemo(() => container.resolve(token), [token]);

    useEffect(() => {
        // Set up the update callback to trigger a re-render
        vm.setUpdateCallback(() => {
            setTick(tick => tick + 1);
        });

        // Cleanup on unmount
        return () => {
            vm.onUnmount?.();
        };
    }, [vm]);

    return vm;
}

import { container, Lifecycle } from 'tsyringe';
import { SearchViewModel } from '../../presentation/viewmodels/SearchViewModel';
import { MockSearchRepository } from '../repositories/SearchRepository';
import { SearchRepositoryToken, SearchViewModelToken } from './tokens';

export function registerSearchDependencies(): void {
    if (!container.isRegistered(SearchRepositoryToken)) {
        container.register(SearchRepositoryToken, { useClass: MockSearchRepository });
    }

    if (!container.isRegistered(SearchViewModelToken)) {
        container.register(SearchViewModelToken, { useClass: SearchViewModel }, { lifecycle: Lifecycle.Singleton });
    }
}

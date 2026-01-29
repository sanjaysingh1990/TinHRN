import { inject, injectable } from 'tsyringe';
import { BaseViewModel } from '../../../../core/presentation/BaseViewModel';
import { SearchRepositoryToken } from '../../data/di/tokens';
import { SearchResult } from '../../domain/entities/SearchResult';
import { ISearchRepository } from '../../domain/repositories/ISearchRepository';

@injectable()
export class SearchViewModel extends BaseViewModel {
    private _query: string = '';
    private _results: SearchResult[] = [];
    private _isLoading: boolean = false;
    private _searchTimeout?: any;

    constructor(
        @inject(SearchRepositoryToken) private _repository: ISearchRepository
    ) {
        super();
    }

    get query(): string { return this._query; }
    get results(): SearchResult[] { return this._results; }
    get isLoading(): boolean { return this._isLoading; }

    setQuery(query: string) {
        this._query = query;
        this.notifyUpdate();

        // Clear previous timeout
        if (this._searchTimeout) {
            clearTimeout(this._searchTimeout);
        }

        if (!query.trim()) {
            this._results = [];
            this._isLoading = false;
            this.notifyUpdate();
            return;
        }

        // Set up debounce (500ms)
        this._searchTimeout = setTimeout(() => {
            this.performSearch();
        }, 500);
    }

    private async performSearch() {
        this._isLoading = true;
        this._results = []; // Clear previous results to show shimmers
        this.notifyUpdate();

        try {
            const results = await this._repository.search(this._query);
            this._results = results;
        } catch (error) {
            console.error('Search error:', error);
            this._results = [];
        } finally {
            this._isLoading = false;
            this.notifyUpdate();
        }
    }

    clearSearch() {
        this._query = '';
        this._results = [];
        this._isLoading = false;
        if (this._searchTimeout) {
            clearTimeout(this._searchTimeout);
        }
        this.notifyUpdate();
    }

    onUnmount() {
        if (this._searchTimeout) {
            clearTimeout(this._searchTimeout);
        }
    }
}

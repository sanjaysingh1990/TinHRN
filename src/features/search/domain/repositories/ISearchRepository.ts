import { SearchResult } from '../entities/SearchResult';

export interface ISearchRepository {
    search(query: string): Promise<SearchResult[]>;
}

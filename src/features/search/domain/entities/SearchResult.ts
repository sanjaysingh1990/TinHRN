export type SearchResultType = 'tour' | 'destination';

export interface SearchResult {
    id: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    type: SearchResultType;
    rating?: number;
    price?: string;
    duration?: string;
}

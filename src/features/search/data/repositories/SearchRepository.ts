import { SearchResult } from '../../domain/entities/SearchResult';
import { ISearchRepository } from '../../domain/repositories/ISearchRepository';

export class MockSearchRepository implements ISearchRepository {
    async search(query: string): Promise<SearchResult[]> {
        // Mock delay of 1.5s to show shimmers as requested
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (!query.trim()) return [];

        const mockResults: SearchResult[] = [
            {
                id: '1',
                title: 'Everest Base Camp Trek',
                subtitle: 'Nepal • Khumbu Region',
                imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1000&auto=format&fit=crop',
                type: 'tour',
                rating: 4.8,
                price: '₹45,000',
                duration: '12 Days'
            },
            {
                id: '2',
                title: 'Leh Ladakh Expedition',
                subtitle: 'India • Ladakh',
                imageUrl: 'https://images.unsplash.com/photo-1544085311-11a028465b03?q=80&w=1000&auto=format&fit=crop',
                type: 'tour',
                rating: 4.9,
                price: '₹35,000',
                duration: '8 Days'
            },
            {
                id: '3',
                title: 'Valley of Flowers',
                subtitle: 'India • Uttarakhand',
                imageUrl: 'https://images.unsplash.com/photo-1596395819057-e37f55a85289?q=80&w=1000&auto=format&fit=crop',
                type: 'destination',
                rating: 4.7
            },
            {
                id: '4',
                title: 'Roopkund Trek',
                subtitle: 'India • Himalayas',
                imageUrl: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?q=80&w=1000&auto=format&fit=crop',
                type: 'tour',
                rating: 4.6,
                price: '₹15,000',
                duration: '6 Days'
            }
        ];

        // Filter based on query (simple mock)
        return mockResults.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.subtitle.toLowerCase().includes(query.toLowerCase())
        );
    }
}

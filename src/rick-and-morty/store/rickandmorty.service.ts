import type { ApiService } from '../api/api.service';
import { CharactersListService } from './characters-list.service';
import { CharactersListStore } from './characters-list.store';

export class RickAndMortyService {
    charactersListService: CharactersListService;
    charactersListStore: CharactersListStore;

    constructor(api: ApiService) {
        this.charactersListService = new CharactersListService(api);
        this.charactersListStore = new CharactersListStore(api);
    }
}

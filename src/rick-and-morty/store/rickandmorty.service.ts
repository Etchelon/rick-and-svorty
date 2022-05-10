import type { ApiService } from '../api/api.service';
import { CharactersListService } from './characters-list.service';

export class RickAndMortyService {
    charactersListService: CharactersListService;

    constructor(api: ApiService) {
        this.charactersListService = new CharactersListService(api);
    }
}

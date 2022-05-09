import { ApiResource } from './api-resource';
import type { Character, Episode, GetAllCharactersOptions, GetAllEpisodesOptions, GetAllLocationsOptions, Location } from './api.types';

export class ApiService {
    character: ApiResource<Character, GetAllCharactersOptions>;
    location: ApiResource<Location, GetAllLocationsOptions>;
    episode: ApiResource<Episode, GetAllEpisodesOptions>;

    constructor(baseUrl: string) {
        this.character = new ApiResource<Character, GetAllCharactersOptions>(baseUrl, 'character');
        this.location = new ApiResource<Location, GetAllLocationsOptions>(baseUrl, 'location');
        this.episode = new ApiResource<Episode, GetAllEpisodesOptions>(baseUrl, 'episode');
    }
}

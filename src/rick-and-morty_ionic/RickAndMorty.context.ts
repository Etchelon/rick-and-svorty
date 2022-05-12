import type { ApiService } from './api/api.service';
import type { RickAndMortyService } from './store/rickandmorty.service';

export interface IRickAndMortyContext {
    api: ApiService;
    stores: RickAndMortyService;
}

export const RickAndMortyCtx = Symbol.for('RickAndMortyCtx');

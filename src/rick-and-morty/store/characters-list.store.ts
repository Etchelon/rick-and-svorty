import { chain, uniqBy, without } from 'lodash';
import type { Subscriber } from 'svelte/store';
import type { ApiService } from '../api/api.service';
import type { Character, GetAllCharactersOptions, PaginationInfo } from '../api/api.types';

export interface ICharacterListState {
    isLoading: boolean;
    queryOptions: GetAllCharactersOptions;
    currentPage: number;
    pageInfo: PaginationInfo | null;
    characters: Character[];
}

export interface ICharacterListStore {
    subscribe(subscription: (state: ICharacterListState) => void): () => void;
    previousPage(): void;
    nextPage(): void;
}

export const FIRST_PAGE = 1;
export const PAGE_SIZE = 20;

export class CharactersListStore implements ICharacterListStore {
    private isLoading = false;
    private queryOptions: GetAllCharactersOptions = {
        page: 1,
    };
    private get currentPage() {
        return this.queryOptions.page;
    }
    private pageInfo: PaginationInfo | null = null;
    private allCharacters: Character[] = [];
    private get characters() {
        return chain(this.allCharacters)
            .drop(PAGE_SIZE * (this.currentPage - 1))
            .take(PAGE_SIZE)
            .value();
    }

    private _subscribers: Subscriber<ICharacterListState>[] = [];

    constructor(private readonly api: ApiService) {}

    subscribe(subscriber: Subscriber<ICharacterListState>) {
        if (this._subscribers.length === 0) {
            this.fetch();
        }

        subscriber(this.getState());
        this._subscribers.push(subscriber);
        console.log({ subscribers: this._subscribers });

        return () => {
            console.info('Unsubscribing from the CharactersListStore');
            this._subscribers = without(this._subscribers, subscriber);
        };
    }

    previousPage() {
        this.changePage(-1);
    }

    nextPage() {
        this.changePage(1);
    }

    private setLoading(isLoading: boolean) {
        this.isLoading = isLoading;
        this.publish();
    }

    private changePage(delta: -1 | 1) {
        this.queryOptions = { page: this.currentPage + delta };
        this.fetch();
    }

    private fetch() {
        this.setLoading(true);
        this.api.character.all({ page: this.currentPage }).subscribe({
            next: ({ info, results }) => {
                this.allCharacters = uniqBy([...this.allCharacters, ...results], (c) => c.id);
                this.pageInfo = info;
                this.publish();
            },
            complete: () => {
                this.setLoading(false);
            },
        });
    }

    private publish() {
        this._subscribers.forEach((sub) => sub(this.getState()));
    }

    private getState(): ICharacterListState {
        return {
            isLoading: this.isLoading,
            queryOptions: this.queryOptions,
            characters: this.characters,
            currentPage: this.currentPage,
            pageInfo: this.pageInfo,
        };
    }
}

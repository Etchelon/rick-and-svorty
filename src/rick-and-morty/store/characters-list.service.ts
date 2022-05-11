import { chain, uniqBy } from 'lodash';
import { derived, Readable, Writable, writable } from 'svelte/store';
import type { ApiService } from '../api/api.service';
import type { Character, GetAllCharactersOptions, PaginationInfo } from '../api/api.types';

export interface ICharacterListStore {
    isLoading: Writable<boolean>;
    queryOptions: Writable<GetAllCharactersOptions>;
    currentPage: Readable<number>;
    pageInfo: Writable<PaginationInfo | null>;
    characters: Readable<Character[]>;
    previousPage(): void;
    nextPage(): void;
}

export const FIRST_PAGE = 1;
export const PAGE_SIZE = 20;

export class CharactersListService implements ICharacterListStore {
    isLoading = writable(false);
    queryOptions = writable({
        page: 1,
    });
    currentPage = derived(this.queryOptions, (o) => o.page);
    pageInfo = writable(null);
    private allCharacters = writable<Character[]>([]);
    characters = derived([this.allCharacters, this.currentPage], ([allCharacters, currentPage]) =>
        chain(allCharacters)
            .drop(PAGE_SIZE * (currentPage - 1))
            .take(PAGE_SIZE)
            .value(),
    );

    constructor(private readonly api: ApiService) {}

    subscribe(subscription: (value: void) => void) {
        this.isLoading.set(true);
        const unsubscriber = this.currentPage.subscribe((page) => {
            this.api.character.all({ page }).subscribe({
                next: (all) => {
                    this.appendCharacters(all.results);
                    this.setPageInfo(all.info);
                    subscription();
                },
                complete: () => {
                    this.isLoading.set(false);
                },
            });
        });

        return () => {
            console.info('Unsubscribing from the CharactersListStore');
            unsubscriber();
        };
    }

    previousPage() {
        this.changePage(-1);
    }

    nextPage() {
        this.changePage(1);
    }

    private changePage(delta: -1 | 1) {
        this.queryOptions.update(({ page }) => ({ page: page + delta }));
    }

    private appendCharacters(characters: Character[]) {
        this.allCharacters.update((allCharacters) => uniqBy([...allCharacters, ...characters], (c) => c.id));
    }

    private setPageInfo(info: PaginationInfo) {
        this.pageInfo.set(info);
    }
}

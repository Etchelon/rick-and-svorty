import { chain, uniqBy } from 'lodash';
import { action, autorun, makeAutoObservable } from 'mobx';
import type { ApiService } from '../api/api.service';
import type { Character, GetAllCharactersOptions, PaginationInfo } from '../api/api.types';
import { IDataService, subscribeFactory } from './data.service';

export const FIRST_PAGE = 1;
export const PAGE_SIZE = 20;

export class CharactersListService implements IDataService {
    isLoading = false;

    queryOptions: GetAllCharactersOptions = {
        page: 1,
    };
    get currentPage() {
        return this.queryOptions.page;
    }
    pageInfo: PaginationInfo | null = null;
    get characters() {
        return chain(this.allCharacters)
            .drop(PAGE_SIZE * (this.currentPage - 1))
            .take(PAGE_SIZE)
            .value();
    }

    private allCharacters: Character[] = [];

    constructor(private readonly api: ApiService) {
        makeAutoObservable(this);
    }

    protected subscribeImpl = () => {
        const disposer = autorun(() => {
            this.isLoading = true;
            this.api.character.all({ page: this.currentPage }).subscribe({
                next: (all) => {
                    this.appendCharacters(all.results);
                    this.setPageInfo(all.info);
                },
                complete: action(() => {
                    this.isLoading = false;
                }),
            });
        });
        return [disposer];
    };

    subscribe = subscribeFactory(this.subscribeImpl);

    previousPage() {
        this.changePage(-1);
    }

    nextPage() {
        this.changePage(1);
    }

    private changePage(delta: -1 | 1) {
        this.queryOptions.page += delta;
    }

    private appendCharacters(characters: Character[]) {
        this.allCharacters = uniqBy([...this.allCharacters, ...characters], (c) => c.id);
    }

    private setPageInfo(info: PaginationInfo) {
        this.pageInfo = info;
    }
}

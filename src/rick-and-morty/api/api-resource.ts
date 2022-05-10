import { chain, isNaN, join } from 'lodash';
import { map, Observable } from 'rxjs';
import type { PaginatedRequestOptions, PaginatedResponse } from './api.types';
import { BaseApiService } from './http';
import { joinPaths } from './http/utils';

/**
 * Interface describing a resource in the RickAndMorty APIs
 */
export interface IApiResource<T, U extends PaginatedRequestOptions = PaginatedRequestOptions> {
    /** Get one T by its url */
    oneByUrl(url: string): Observable<T>;

    /** Get one or more Ts by their urls */
    manyByUrls(urls: string[]): Observable<T[]>;

    /** Get one or more Ts by their ids */
    one(ids: number): Observable<T>;

    /** Get one or more Ts by their ids */
    many(...ids: number[]): Observable<T[]>;

    /** Get a paginated list of Ts */
    all(options: U): Observable<PaginatedResponse<T>>;
}

/**
 * Generic class that implements all operations that can be performed against a resource in the RickAndMorty Api.
 * The shape of these operations are identical across all types of resource (Character, Location, Episode).
 * The implemented operations are:
 * - get one entity by id
 * - get many entities by their ids
 * - get all entities, paginated and possibly filtered
 * - get one entity by its url
 * - get many entities by their url. Ids are extracted by the urls and used to call the api with a list of Ids
 */
export class ApiResource<T, TOptions extends PaginatedRequestOptions> extends BaseApiService implements IApiResource<T, TOptions> {
    oneByUrl(url: string): Observable<T> {
        return this.rawGet<T>(url);
    }

    manyByUrls(urls: string[]): Observable<T[]> {
        const baseEndpointUrl = joinPaths(this.baseUrl, this.action(''));
        const ids = chain(urls)
            .map((url) => url.replace(`${baseEndpointUrl}/`, ''))
            .filter((n) => !isNaN(n))
            .map(Number)
            .value();
        return this.many(...ids);
    }

    one(id: number): Observable<T> {
        const params = String(id);
        return this.get<T>(params);
    }

    many(...ids: number[]): Observable<T[]> {
        const params = join(ids, ',');
        const ret = this.get<T | T[]>(params);

        // The Api returns either a single item or an array of items based on the request
        // So when asking for a single item, we must map the returned item to an array
        // so that callers of many are guaranteed to get an array in return
        if (ids.length > 1) {
            return ret as Observable<T[]>;
        }

        return (ret as Observable<T>).pipe(map((item) => [item]));
    }

    all(options: TOptions): Observable<PaginatedResponse<T>> {
        return this.get<PaginatedResponse<T>>('', options as any);
    }
}

import type { Identifier, IQueryParameters } from './types';
import { joinPaths, querify } from './utils';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { catchError, from, map, Observable, tap, throwError } from 'rxjs';

const createAxiosInstance = (baseUrl: string) => {
    const config: AxiosRequestConfig = {
        baseURL: baseUrl,
        // withCredentials: true,
    };
    return axios.create(config);
};

const fromAxios = <TOut, TData>(axiosRequest: Promise<AxiosResponse<TOut, TData>>): Observable<TOut> =>
    from(axiosRequest).pipe(
        map(({ data }) => data),
        catchError((err) => {
            console.error(`Error calling HTTP endpoint: ${err.message ?? err}`);
            return throwError(() => err);
        }),
    );

export abstract class BaseApiService {
    protected readonly baseUrl: string;
    protected readonly http: AxiosInstance;

    constructor(apiUrl: string, protected endpointName: string) {
        this.baseUrl = joinPaths(apiUrl, 'api');
        this.http = createAxiosInstance(this.baseUrl);
    }

    protected action(name: string, params?: IQueryParameters): string {
        let url = joinPaths(this.endpointName, name);
        if (params) {
            url += querify(params);
        }
        return url;
    }

    protected rawGet<TOut>(url: string) {
        // set the url with params
        return fromAxios(this.http.get<TOut>(url)).pipe(tap(() => console.debug('Performing HTTP GET call to {Url}', url)));
    }

    /**
     * @param actionName name of the action with url
     * @param params optional parameters for the query string
     * that is used to identify the name of the property (resource) in the authorization check
     */
    protected get<TOut, TQueryParams = IQueryParameters>(actionName: string, params?: TQueryParams) {
        // set the url with params
        const url = this.action(actionName, { ...(params as any) });
        return fromAxios(this.http.get<TOut>(url)).pipe(tap(() => console.debug('Performing HTTP GET call to {Url}', url)));
    }

    protected post<TBody, TOut>(actionName: string, body: TBody) {
        const url = this.action(actionName);
        return fromAxios(this.http.post<TOut>(url, body)).pipe(tap(() => console.debug('Performing HTTP POST call to {Url}', url)));
    }

    protected put<TBody, TOut = void>(actionName: string, body: TBody, param?: string) {
        const url = this.action(actionName) + (param ? `/${param}` : '');
        return fromAxios(this.http.put<TOut>(url, body)).pipe(tap(() => console.debug('Performing HTTP PUT call to {Url}', url)));
    }

    protected delete<TOut>(actionName: string, param: Identifier) {
        const url = this.action(`${actionName}/${param}`);
        return fromAxios(this.http.delete<TOut>(url)).pipe(tap(() => console.debug('Performing HTTP DELETE call to {Url}', url)));
    }
}

import { chain, identity, isArray, isBoolean, isDate, isNil, isNumber, isString, negate, reduce, reduceRight } from 'lodash';
import { filter, map, pipe } from 'rxjs';
import type { IQueryParameters, SimpleType, UniversalFn } from './types';

//#region Functional

export const composeFns =
    <T>(...fns: UniversalFn[]) =>
    (x: T) =>
        reduceRight(fns, (acc: any, fn) => fn(acc), x);
export const pipeFns =
    <T>(...fns: UniversalFn[]) =>
    (x: T) =>
        reduce(fns, (acc: any, fn) => fn(acc), x);

//#endregion

export function getPercentage(fraction: number, whole: number, precision = 2): number {
    if (whole === 0) {
        return 0;
    }
    if (precision < 0) {
        precision = 0;
    }
    const percent = (fraction / whole) * 100;
    return Math.round(percent * Math.pow(10, precision)) / Math.pow(10, precision);
}

//#region Query String

function querifyValue(val: SimpleType): string {
    if (isNil(val)) {
        throw new Error(`Value must not be nil`);
    }

    if (isNumber(val) || isBoolean(val)) {
        return String(val);
    }

    if (isString(val)) {
        return encodeURIComponent(val);
    }

    if (isDate(val)) {
        return val.toISOString();
    }

    throw new Error(`Value of unsupported type ${typeof val}`);
}

export function querify(item: IQueryParameters, connector: '?' | '&' = '?'): string {
    const segments = chain(item)
        .toPairs()
        .reject(([_, val]) => isNil(val))
        .flatMap(([key, value]) => (isArray(value) ? value.map((val) => `${key}[]=${querifyValue(val)}`) : `${key}=${querifyValue(value)}`))
        .value();

    return segments.length === 0 ? '' : connector + segments.join('&');
}

//#endregion

const trim = (s: string) => s.trim();
const normalizeEnd = (s: string) => (s.endsWith('/') ? s.substring(0, s.length - 2) : s);
const normalizeStart = (s: string) => (s.startsWith('/') ? s.substring(1) : s);
const normalize = pipeFns<string>(trim, normalizeStart, normalizeEnd);

export function joinPaths(...segments: string[]): string {
    return chain(segments)
        .filter(identity)
        .reduce((memo, segment) => {
            const normalized = normalize(segment);
            return memo ? `${memo}/${normalized}` : normalized;
        }, '')
        .value();
}

export const compact = <TIn>(predicate: (arg: TIn) => boolean = negate(isNil), mapper: (in_: TIn) => NonNullable<TIn> = identity) =>
    pipe(filter(predicate), map<TIn, NonNullable<TIn>>(mapper));

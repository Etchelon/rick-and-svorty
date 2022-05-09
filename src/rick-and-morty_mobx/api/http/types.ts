export type Identifier = number | string;
export type DateLike = string | Date;
export type Nullable<T> = T | null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UniversalFn<TArgs = any, TRes = void> = (...args: TArgs[]) => TRes;
export type SimpleType = string | number | boolean | Date | Array<SimpleType>;

/** Query params are just a dictionary of SimpleType values */
export type IQueryParameters = {
	[name: string]: SimpleType;
};

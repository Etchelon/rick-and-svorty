import type { IReactionDisposer } from 'mobx';

type SubscribeImplFn = (...args: any[]) => IReactionDisposer[];

export interface IDataService {
    subscribe(...args: any[]): () => void;
}

export const subscribeFactory =
    (subscribeImpl: SubscribeImplFn) =>
    (...args: any[]) => {
        console.log('Someone subscribed!');
        const disposers = subscribeImpl(...args);
        return () => {
            console.log('Disposing!');
            disposers.forEach((disposer) => disposer());
        };
    };

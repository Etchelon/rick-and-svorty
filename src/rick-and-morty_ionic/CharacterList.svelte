<script lang="ts">
    import { clamp, chunk, isNil } from 'lodash';
    import { getContext } from 'svelte';
    import { IRickAndMortyContext, RickAndMortyCtx } from './RickAndMorty.context';
    import CharacterCard from './CharacterCard.svelte';

    const PAGE_SIZE = 20;

    const {
        stores: { charactersListStore },
    } = getContext<IRickAndMortyContext>(RickAndMortyCtx);

    const colSize = 3;
    $: rows = chunk($charactersListStore.characters, 12 / colSize);
    $: rangeStart = ($charactersListStore.currentPage - 1) * PAGE_SIZE + 1;
    $: rangeEnd = clamp(rangeStart + PAGE_SIZE - 1, $charactersListStore.pageInfo?.count ?? 0);
    $: canGoBack = !isNil($charactersListStore.pageInfo?.prev);
    $: canGoForward = !isNil($charactersListStore.pageInfo?.next);
    $: totalPages = $charactersListStore.pageInfo?.count ?? 0;
</script>

<div class="ion-page">
    <ion-header>
        <ion-toolbar>
            <ion-buttons slot="start">
                <ion-menu-button />
            </ion-buttons>
            <ion-title>Character List</ion-title>
        </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
        <ion-header collapse="condense">
            <ion-toolbar>
                <ion-title size="large">Character List</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-grid>
            {#each rows as characters}
                <ion-row>
                    {#each characters as character}
                        <ion-col key={character.id} size={colSize}>
                            <CharacterCard {character} />
                        </ion-col>
                    {/each}
                </ion-row>
            {/each}
        </ion-grid>

        {#if $charactersListStore.isLoading}
            <div class="spinner-wrapper" slot="fixed">
                <ion-spinner />
            </div>
        {/if}
    </ion-content>

    <ion-footer>
        <ion-toolbar>
            {#if canGoBack}
                <ion-buttons slot="start">
                    <ion-button onClick={() => charactersListStore.previousPage()}>
                        <div>{'<--'}</div>
                    </ion-button>
                </ion-buttons>
            {/if}
            <ion-title>{`Showing ${rangeStart}-${rangeEnd} of ${totalPages}`}</ion-title>
            {#if canGoForward}
                <ion-buttons slot="end">
                    <ion-button onClick={() => charactersListStore.nextPage()}>
                        <div>{'-->'}</div>
                    </ion-button>
                </ion-buttons>
            {/if}
        </ion-toolbar>
    </ion-footer>
</div>

<style>
    .ion-page {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .spinner-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        position: absolute;
        background-color: rgba(0, 0, 0, 0.3);
    }
</style>

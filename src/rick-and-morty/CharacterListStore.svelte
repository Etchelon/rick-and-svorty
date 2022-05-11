<script lang="ts">
    import { clamp, chunk, isNil } from 'lodash';
    import { getContext } from 'svelte';
    import { IRickAndMortyContext, RickAndMortyCtx } from './RickAndMorty.context';
    import CharacterCard from './CharacterCard.svelte';
    import type { ICharacterListState } from './store/characters-list.store';

    const PAGE_SIZE = 20;

    const {
        stores: { charactersListStore },
    } = getContext<IRickAndMortyContext>(RickAndMortyCtx);

    // const state = $charactersListStore;
    let state: ICharacterListState;
    let counter = 0;
    charactersListStore.subscribe((state_) => {
        console.info('Yo ', ++counter);
        state = state_;
    });
    console.log(state);
    const colSize = 3;
    $: rows = chunk(state.characters, 12 / colSize);
    $: rangeStart = (state.currentPage - 1) * PAGE_SIZE + 1;
    $: rangeEnd = clamp(rangeStart + PAGE_SIZE - 1, state.pageInfo?.count ?? 0);
    $: canGoBack = !isNil(state.pageInfo?.prev);
    $: canGoForward = !isNil(state.pageInfo?.next);
    $: totalPages = state.pageInfo?.count ?? 0;
</script>

<h1>Character List</h1>
{#if state.isLoading}
    Loading...
{/if}
{#each rows as characters}
    <div class="row">
        {#each characters as character}
            <CharacterCard {character} />
        {/each}
    </div>
{/each}
{#if canGoBack}
    <button type="button" on:click={() => charactersListStore.previousPage()}> Prev </button>
{/if}
<small>{`Showing ${rangeStart}-${rangeEnd} of ${totalPages}`}</small>
{#if canGoForward}
    <button type="button" on:click={() => charactersListStore.nextPage()}> Next </button>
{/if}

<style>
    .row {
        display: flex;
        gap: 12px;
        padding: 1rem;
        border-bottom: 1px solid #efefef;
    }
</style>

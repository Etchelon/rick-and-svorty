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

<h1>Character List</h1>
{#if $charactersListStore.isLoading}
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

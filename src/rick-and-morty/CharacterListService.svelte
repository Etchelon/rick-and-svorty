<script lang="ts">
    import { clamp, chunk, isNil } from 'lodash';
    import { getContext, onMount } from 'svelte';
    import { IRickAndMortyContext, RickAndMortyCtx } from './RickAndMorty.context';
    import CharacterCard from './CharacterCard.svelte';

    const PAGE_SIZE = 20;

    const {
        stores: { charactersListService },
    } = getContext<IRickAndMortyContext>(RickAndMortyCtx);

    const { characters, currentPage, isLoading, pageInfo } = charactersListService;
    const colSize = 3;
    $: rows = chunk($characters, 12 / colSize);
    $: rangeStart = ($currentPage - 1) * PAGE_SIZE + 1;
    $: rangeEnd = clamp(rangeStart + PAGE_SIZE - 1, $pageInfo?.count ?? 0);
    $: canGoBack = !isNil($pageInfo?.prev);
    $: canGoForward = !isNil($pageInfo?.next);
    $: totalPages = $pageInfo?.count ?? 0;

    onMount(() => $charactersListService);
</script>

<h1>Character List</h1>
{#if $isLoading}
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
    <button type="button" on:click={() => charactersListService.previousPage()}> Prev </button>
{/if}
<small>{`Showing ${rangeStart}-${rangeEnd} of ${totalPages}`}</small>
{#if canGoForward}
    <button type="button" on:click={() => charactersListService.nextPage()}> Next </button>
{/if}

<style>
    .row {
        display: flex;
        gap: 12px;
        padding: 1rem;
        border-bottom: 1px solid #efefef;
    }
</style>

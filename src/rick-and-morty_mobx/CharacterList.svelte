<script lang="ts" context="module">
    import { connect } from 'svelte-mobx';
</script>

<script lang="ts">
    import { clamp, chunk, isNil } from 'lodash';
    import { getContext, onMount } from 'svelte';
    import { IRickAndMortyContext, RickAndMortyCtx } from './RickAndMorty.context';
    import type { Character } from './api/api.types';
    import CharacterCard from './CharacterCard.svelte';

    const PAGE_SIZE = 20;

    const {
        store: { charactersListService },
    } = getContext<IRickAndMortyContext>(RickAndMortyCtx);
    onMount(() => charactersListService.subscribe());

    const { autorun } = connect();
    let rows: Character[][];
    let isLoading = false;
    let colSize: number;
    let rangeStart: number;
    let rangeEnd: number;
    let canGoBack = false;
    let canGoForward = false;
    let totalPages = 0;
    $: autorun(() => {
        const { characters, currentPage, pageInfo } = charactersListService;
        isLoading = charactersListService.isLoading;
        rows = chunk(characters, 4);
        colSize = 3;
        rangeStart = (currentPage - 1) * PAGE_SIZE + 1;
        rangeEnd = clamp(rangeStart + PAGE_SIZE - 1, pageInfo?.count ?? 0);
        canGoBack = !isNil(pageInfo?.prev);
        canGoForward = !isNil(pageInfo?.next);
        totalPages = pageInfo?.count ?? 0;
    });
</script>

<h1>Character List</h1>
{#if isLoading}
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

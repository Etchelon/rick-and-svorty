<script lang="ts">
    import { setContext } from 'svelte';
    import { ApiService } from './api/api.service';
    import CharacterListService from './CharacterListService.svelte';
    import CharacterListStore from './CharacterListStore.svelte';
    import { IRickAndMortyContext, RickAndMortyCtx } from './RickAndMorty.context';
    import { RickAndMortyService } from './store/rickandmorty.service';

    const api = new ApiService('https://rickandmortyapi.com');
    const stores = new RickAndMortyService(api);

    const ctx: IRickAndMortyContext = {
        api,
        stores,
    };

    setContext(RickAndMortyCtx, ctx);
    let useStore = true;
</script>

{#if useStore}
    <h1 on:click={() => (useStore = false)}>Rick and Morty app! (store)</h1>
    <CharacterListStore />
{:else}
    <h1 on:click={() => (useStore = true)}>Rick and Morty app! (service)</h1>
    <CharacterListService />
{/if}

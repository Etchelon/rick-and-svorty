<script lang="ts">
    import { setContext } from 'svelte';
    import { ApiService } from './api/api.service';
    import CharacterList from './CharacterList.svelte';
    import { IRickAndMortyContext, RickAndMortyCtx } from './RickAndMorty.context';
    import { RickAndMortyService } from './store/rickandmorty.service';

    const api = new ApiService('https://rickandmortyapi.com');
    const store = new RickAndMortyService(api);

    const ctx: IRickAndMortyContext = {
        api,
        store,
    };

    setContext(RickAndMortyCtx, ctx);
</script>

<h1>Rick and Morty app!</h1>
<CharacterList />

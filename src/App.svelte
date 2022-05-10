<script lang="ts">
    import Link from './Link.svelte';
    import RickAndMorty from './rick-and-morty/RickAndMorty.svelte';
    import RickAndMortyMobx from './rick-and-morty_mobx/RickAndMorty.svelte';

    export let name: string;
    let show2ndLink = false;
    let useMobX = false;
</script>

<main>
    <h1 on:click={() => (show2ndLink = !show2ndLink)}>Hello {name}!</h1>
    <Link name="Pippo" />
    {#if show2ndLink}
        <Link name="Pluto" />
    {/if}

    <div>
        <input id="use-mobx" type="checkbox" bind:checked={useMobX} />
        <label for="use-mobx">Use MobX</label>
    </div>
    {#if useMobX}
        <RickAndMortyMobx />
    {:else}
        <RickAndMorty />
    {/if}
</main>

<style>
    main {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>

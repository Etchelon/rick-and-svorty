<script lang="ts">
    import type { Character } from './api/api.types';

    export let character: Character;
</script>

<div class="card">
    <p>{character.name}</p>
    <small>{character.species} {character.gender} - {character.status}</small>
    <img src={character.image} alt={character.name} />
</div>

<style>
    .card {
        border: 1px solid #efefef;
        border-radius: 20px;
        padding: 1rem;
    }

    p {
        font-size: 24px;
        font-weight: bold;
        margin-top: 0;
        margin-bottom: 0.5rem;
    }

    small {
        display: block;
        margin-bottom: 0.5rem;
    }
</style>

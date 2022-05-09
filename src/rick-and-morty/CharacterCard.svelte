<script lang="ts">
    import type { Character } from './api/api.types';

    export let character: Character;
</script>

<div>
    <p>{character.name}</p>
    <small>{character.species} {character.gender} - {character.status}</small>
    <img src={character.image} alt={character.name} />
</div>

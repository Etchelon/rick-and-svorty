<script lang="ts">
    import type { Character } from './api/api.types';

    export let character: Character;
</script>

<ion-card>
    <ion-card-header>
        <ion-card-title>{character.name}</ion-card-title>
        <ion-card-subtitle>{character.species} {character.gender} - {character.status}</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
        <ion-img src={character.image} />
    </ion-card-content>
</ion-card>

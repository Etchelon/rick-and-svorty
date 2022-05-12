<script lang="ts">
    import { initialize } from '@ionic/core/components';
    import { IonApp } from '@ionic/core/components/ion-app';
    import { IonHeader } from '@ionic/core/components/ion-header';
    import { IonFooter } from '@ionic/core/components/ion-footer';
    import { IonToolbar } from '@ionic/core/components/ion-toolbar';
    import { IonButtons } from '@ionic/core/components/ion-buttons';
    import { IonButton } from '@ionic/core/components/ion-button';
    import { IonMenuButton } from '@ionic/core/components/ion-menu-button';
    import { IonTitle } from '@ionic/core/components/ion-title';
    import { IonContent } from '@ionic/core/components/ion-content';
    import { IonGrid } from '@ionic/core/components/ion-grid';
    import { IonRow } from '@ionic/core/components/ion-row';
    import { IonCol } from '@ionic/core/components/ion-col';
    import { IonCard } from '@ionic/core/components/ion-card';
    import { IonCardHeader } from '@ionic/core/components/ion-card-header';
    import { IonCardContent } from '@ionic/core/components/ion-card-content';
    import { IonCardTitle } from '@ionic/core/components/ion-card-title';
    import { IonCardSubtitle } from '@ionic/core/components/ion-card-subtitle';
    import { IonImg } from '@ionic/core/components/ion-img';

    import { onMount, setContext } from 'svelte';
    import { ApiService } from './api/api.service';
    import CharacterList from './CharacterList.svelte';
    import { IRickAndMortyContext, RickAndMortyCtx } from './RickAndMorty.context';
    import { RickAndMortyService } from './store/rickandmorty.service';

    const api = new ApiService('https://rickandmortyapi.com');
    const stores = new RickAndMortyService(api);

    const ctx: IRickAndMortyContext = {
        api,
        stores,
    };

    setContext(RickAndMortyCtx, ctx);

    onMount(() => {
        initialize();
        tryDefine('ion-app', IonApp);
        tryDefine('ion-header', IonHeader);
        tryDefine('ion-footer', IonFooter);
        tryDefine('ion-toolbar', IonToolbar);
        tryDefine('ion-buttons', IonButtons);
        tryDefine('ion-button', IonButton);
        tryDefine('ion-menu-button', IonMenuButton);
        tryDefine('ion-title', IonTitle);
        tryDefine('ion-content', IonContent);
        tryDefine('ion-grid', IonGrid);
        tryDefine('ion-row', IonRow);
        tryDefine('ion-col', IonCol);
        tryDefine('ion-card', IonCard);
        tryDefine('ion-card-header', IonCardHeader);
        tryDefine('ion-card-content', IonCardContent);
        tryDefine('ion-card-title', IonCardTitle);
        tryDefine('ion-card-subtitle', IonCardSubtitle);
        tryDefine('ion-img', IonImg);
        // Applies required global styles
        document.documentElement.classList.add('ion-ce');
    });

    // Prevents exception when hot reloading.
    function tryDefine(tag, impl) {
        try {
            customElements.define(tag, impl);
        } catch (error) {}
    }
</script>

<ion-app>
    <CharacterList />
</ion-app>

<style>
    ion-app {
        display: block;
        width: 100vw;
        height: 100vh;
    }
</style>

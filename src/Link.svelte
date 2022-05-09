<script lang="ts" context="module">
	import { writable } from "svelte/store";
	
	const totalCount = writable(0);
</script>

<script lang="ts">
	import { onMount } from "svelte";

	export let name = "Svelte tutorial";
	export let link = "https://svelte.dev/tutorial";
	
	onMount(() => {
		$totalCount += 1;
		console.log("onMount for Link", { $totalCount });

		return () => {
			$totalCount -= 1;
		};
	});
</script>

<p>Visit the <a href={link}>{name}</a> to learn how to build Svelte apps.</p>
<small>There are {$totalCount} instances of this component</small>

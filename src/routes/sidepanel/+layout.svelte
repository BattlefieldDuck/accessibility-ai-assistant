<script lang="ts">
    import { onMount } from "svelte";

    let { children } = $props();

    onMount(() => {
        // Add classes to hide overflow and scrollbar when the component mounts
        document.body.classList.add(
            "overflow-hidden", // Prevents scrolling
            "[&::-webkit-scrollbar]:hidden", // Hides the scrollbar in WebKit browsers
        );
    });
</script>

<div class="h-screen">
    {@render children()}
</div>

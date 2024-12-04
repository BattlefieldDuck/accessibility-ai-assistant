<script lang="ts">
    let { children } = $props();
</script>

<div class="mx-auto my-12 max-w-[1024px] min-w-0">
    <div class="mx-2 space-y-2">
        <h1 class="scroll-m-20 text-3xl md:text-4xl font-bold tracking-tight">
            Accessibility AI Assistant
        </h1>
        <p class="text-muted-foreground text-balance text-lg">
            Chrome Extension Options
        </p>

        {@render children()}
    </div>
</div>

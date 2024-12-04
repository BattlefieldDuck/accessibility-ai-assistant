<script lang="ts">
    let { title, items } = $props();
</script>

<div class="w-full pt-6 space-y-2">
    <legend class="text-sm font-medium leading-none">{@render title()}</legend>

    <div class="rounded-lg border p-4">
        <div class="items">{@render items()}</div>
    </div>
</div>

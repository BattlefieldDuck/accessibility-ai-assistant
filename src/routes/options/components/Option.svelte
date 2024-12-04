<script lang="ts">
    import { Label } from "$lib/components/ui/label/index.js";

    let { header, details, action } = $props();
</script>

<div class="flex flex-col md:flex-row justify-between">
    <div class="space-y-0.5 mb-2 md:mb-0">
        <Label>{@render header()}</Label>
        <div class="text-muted-foreground text-sm">{@render details()}</div>
    </div>
    {@render action()}
</div>

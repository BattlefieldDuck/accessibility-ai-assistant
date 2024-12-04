<script lang="ts">
    import { Switch } from "$lib/components/ui/switch/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import Option from "../components/Option.svelte";

    interface Props {
        accessibility: AccessibilityOptions;
    }

    let { accessibility = $bindable() }: Props = $props();
</script>

<Option>
    {#snippet header()}
        Screen Reader
    {/snippet}
    {#snippet details()}
        Screen Reader is turned {accessibility.screenReaderEnabled
            ? "on"
            : "off"}
    {/snippet}
    {#snippet action()}
        <div class="flex items-center space-x-2">
            <Label for="enabled">
                {accessibility.screenReaderEnabled ? "On" : "Off"}
            </Label>
            <Switch
                id="enabled"
                bind:checked={accessibility.screenReaderEnabled}
            />
        </div>
    {/snippet}
</Option>

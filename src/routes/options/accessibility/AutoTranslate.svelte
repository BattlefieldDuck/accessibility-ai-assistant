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
        Auto Translate
    {/snippet}
    {#snippet details()}
        Auto Translate is turned {accessibility.autoTranslateEnabled
            ? "on"
            : "off"}
    {/snippet}
    {#snippet action()}
        <div class="flex items-center space-x-2">
            <Label for="enabled">
                {accessibility.autoTranslateEnabled ? "On" : "Off"}
            </Label>
            <Switch
                id="enabled"
                bind:checked={accessibility.autoTranslateEnabled}
            />
        </div>
    {/snippet}
</Option>

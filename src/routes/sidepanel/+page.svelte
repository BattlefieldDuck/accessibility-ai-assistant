<script lang="ts">
    import * as Resizable from "$lib/components/ui/resizable/index.js";
    import ScreenReader from "./ScreenReader.svelte";
    import Conversation from "./Conversation.svelte";
    import { onMount } from "svelte";

    let defaultSize: number | undefined = $state();

    onMount(async () => {
        const data = await chrome.storage.local.get(["pane"]);
        defaultSize = data.pane?.size ?? 50;
    });

    function onResize(size: number) {
        chrome.storage.local.set({ pane: { size } });
    }
</script>

{#if defaultSize !== undefined}
    <Resizable.PaneGroup direction="vertical">
        <Resizable.Pane {defaultSize} {onResize}>
            <ScreenReader />
        </Resizable.Pane>
        <Resizable.Handle withHandle />
        <Resizable.Pane>
            <Conversation />
        </Resizable.Pane>
    </Resizable.PaneGroup>
{/if}

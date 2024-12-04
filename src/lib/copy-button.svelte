<script lang="ts">
    // https://github.com/huntabyte/shadcn-svelte/blob/main/sites/docs/src/lib/components/docs/block-copy-code-button.svelte

    import Check from "lucide-svelte/icons/check";
    import Clipboard from "lucide-svelte/icons/clipboard";
    import { buttonVariants } from "$lib/components/ui/button/index.js";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";

    let hasCopied = $state(false);

    interface Props {
        data: string;
    }

    let { data }: Props = $props();

    $effect(() => {
        if (hasCopied) {
            setTimeout(() => {
                hasCopied = false;
            }, 2000);
        }
    });

    function copyToClipboard() {
        navigator.clipboard.writeText(data);
    }
</script>

<Tooltip.Provider>
    <Tooltip.Root>
        <Tooltip.Trigger>
            <Tooltip.Trigger
                class={buttonVariants({
                    size: "icon",
                    variant: "outline",
                    class: "h-7 w-7 rounded-[6px] [&_svg]:size-3.5",
                })}
                onclick={() => {
                    copyToClipboard();
                    hasCopied = true;
                }}
            >
                <span class="sr-only">Copy</span>
                {#if hasCopied}
                    <Check />
                {:else}
                    <Clipboard />
                {/if}
            </Tooltip.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Content avoidCollisions={false}>Copy</Tooltip.Content>
    </Tooltip.Root>
</Tooltip.Provider>

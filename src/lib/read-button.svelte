<script lang="ts">
    import Volume2 from "lucide-svelte/icons/volume-2";
    import LoaderCircle from "lucide-svelte/icons/loader-circle";
    import Pause from "lucide-svelte/icons/pause";
    import { buttonVariants } from "$lib/components/ui/button/index.js";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";

    type Status = "start" | "starting" | "end" | "pause" | "resume";
    let status: Status = $state("end");

    let tooltipContent = $derived(
        status === "end" || status === "pause" ? "Read aloud" : "Pause",
    );

    interface Props {
        utterance: string;
    }

    let { utterance }: Props = $props();

    async function onButtonClick() {
        if (status === "end") {
            const options = await chrome.storage.local.get(["tts"]);
            const tts: TtsOptions = options.tts;

            status = "starting";
            chrome.tts.stop();

            setTimeout(() => {
                chrome.tts.speak(utterance, {
                    voiceName: tts.voiceName,
                    rate: tts.rate,
                    pitch: tts.pitch,
                    volume: 1.0,
                    onEvent: function (event) {
                        if (event.type === "start" || event.type === "end") {
                            status = event.type;
                        } else if (event.type === "error") {
                            console.error("Error: " + event.errorMessage);
                        }
                    },
                });

                setTimeout(() => {
                    if (status === "starting") {
                        // flushes the queue of any pending utterances when fail to start
                        chrome.tts.stop();
                        status = "end";
                    }
                }, 5000);
            }, 100);
        } else if (status === "start" || status === "resume") {
            status = "pause";
            chrome.tts.pause();
        } else if (status === "pause") {
            status = "resume";
            chrome.tts.resume();
        }
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
                onclick={() => onButtonClick()}
            >
                <span class="sr-only">{tooltipContent}</span>
                {#if status === "end" || status === "pause"}
                    <Volume2 />
                {:else if status === "starting"}
                    <LoaderCircle class="animate-spin" />
                {:else}
                    <Pause />
                {/if}
            </Tooltip.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Content avoidCollisions={false}>
            {tooltipContent}
        </Tooltip.Content>
    </Tooltip.Root>
</Tooltip.Provider>

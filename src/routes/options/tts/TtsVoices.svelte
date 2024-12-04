<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import Option from "../components/Option.svelte";

    interface Props {
        voices: chrome.tts.TtsVoice[];
        tts: TtsOptions;
    }

    let { voices, tts = $bindable() }: Props = $props();
</script>

<Option>
    {#snippet header()}
        Voices
    {/snippet}
    {#snippet details()}
        Selected voice: {tts.voiceName}
    {/snippet}
    {#snippet action()}
        <Select.Root
            type="single"
            name="voiceName"
            bind:value={tts.voiceName}
            required
            allowDeselect={false}
        >
            <Select.Trigger class="max-w-[360px]">
                <div class="truncate">
                    {tts.voiceName}
                </div>
            </Select.Trigger>
            <Select.Content>
                <Select.Group>
                    {#each voices as voice}
                        {#if voice.voiceName}
                            <Select.Item
                                value={voice.voiceName}
                                label={voice.voiceName}
                            >
                                {voice.voiceName}
                            </Select.Item>
                        {/if}
                    {/each}
                </Select.Group>
            </Select.Content>
        </Select.Root>
    {/snippet}
</Option>

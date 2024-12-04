<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import Option from "../components/Option.svelte";

    const types: AISummarizerType[] = [
        "tl;dr",
        "key-points",
        "teaser",
        "headline",
    ];

    interface Props {
        summarizer: AISummarizerOptions;
    }

    let { summarizer = $bindable() }: Props = $props();
</script>

<Option>
    {#snippet header()}
        Type
    {/snippet}
    {#snippet details()}
        Selected type: {summarizer.type}
    {/snippet}
    {#snippet action()}
        <Select.Root
            type="single"
            name="type"
            bind:value={summarizer.type}
            required
            allowDeselect={false}
        >
            <Select.Trigger class="max-w-[180px]">
                <div class="truncate">
                    {summarizer.type}
                </div>
            </Select.Trigger>
            <Select.Content>
                <Select.Group>
                    {#each types as item}
                        <Select.Item value={item} label={item}>
                            {item}
                        </Select.Item>
                    {/each}
                </Select.Group>
            </Select.Content>
        </Select.Root>
    {/snippet}
</Option>

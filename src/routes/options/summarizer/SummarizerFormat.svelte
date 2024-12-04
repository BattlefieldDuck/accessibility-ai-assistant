<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import Option from "../components/Option.svelte";

    let formats: AISummarizerFormat[] = ["plain-text", "markdown"];

    interface Props {
        summarizer: AISummarizerOptions;
    }

    let { summarizer = $bindable() }: Props = $props();
</script>

<Option>
    {#snippet header()}
        Format
    {/snippet}
    {#snippet details()}
        Selected format: {summarizer.format}
    {/snippet}
    {#snippet action()}
        <Select.Root
            type="single"
            name="format"
            bind:value={summarizer.format}
            required
            allowDeselect={false}
        >
            <Select.Trigger class="max-w-[180px]">
                <div class="truncate">
                    {summarizer.format}
                </div>
            </Select.Trigger>
            <Select.Content>
                <Select.Group>
                    {#each formats as item}
                        <Select.Item value={item} label={item}>
                            {item}
                        </Select.Item>
                    {/each}
                </Select.Group>
            </Select.Content>
        </Select.Root>
    {/snippet}
</Option>

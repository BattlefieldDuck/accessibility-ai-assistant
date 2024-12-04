<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import Option from "../components/Option.svelte";

    let lengths: AISummarizerLength[] = ["short", "medium", "long"];

    interface Props {
        summarizer: AISummarizerOptions;
    }

    let { summarizer = $bindable() }: Props = $props();
</script>

<Option>
    {#snippet header()}
        Length
    {/snippet}
    {#snippet details()}
        Selected length: {summarizer.length}
    {/snippet}
    {#snippet action()}
        <Select.Root
            type="single"
            name="length"
            bind:value={summarizer.length}
            required
            allowDeselect={false}
        >
            <Select.Trigger class="max-w-[180px]">
                <div class="truncate">
                    {summarizer.length}
                </div>
            </Select.Trigger>
            <Select.Content>
                <Select.Group>
                    {#each lengths as item}
                        <Select.Item value={item} label={item}>
                            {item}
                        </Select.Item>
                    {/each}
                </Select.Group>
            </Select.Content>
        </Select.Root>
    {/snippet}
</Option>

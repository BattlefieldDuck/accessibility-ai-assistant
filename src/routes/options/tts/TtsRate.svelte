<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import { onMount } from "svelte";
    import Option from "../components/Option.svelte";

    interface Props {
        tts: TtsOptions;
    }

    let { tts = $bindable() }: Props = $props();

    const rates = [
        { value: "0.25", label: "0.25" },
        { value: "0.5", label: "0.5" },
        { value: "0.75", label: "0.75" },
        { value: "1", label: "Normal" },
        { value: "1.25", label: "1.25" },
        { value: "1.5", label: "1.5" },
        { value: "1.75", label: "1.75" },
        { value: "2", label: "2" },
    ];

    let value = $state("1");
    let rate = $derived(
        rates.find((r) => r.value === value)?.label ?? "Normal",
    );

    onMount(() => {
        value = tts.rate.toString();
    });

    $effect(() => {
        tts.rate = Number(value);
    });
</script>

<Option>
    {#snippet header()}
        Rate
    {/snippet}
    {#snippet details()}
        Speaking rate relative to the default rate for this voice.
    {/snippet}
    {#snippet action()}
        <Select.Root
            type="single"
            name="rate"
            bind:value
            required
            allowDeselect={false}
        >
            <Select.Trigger class="max-w-[180px]">
                <div class="truncate">
                    {rate}
                </div>
            </Select.Trigger>
            <Select.Content>
                <Select.Group>
                    {#each rates as { value, label }}
                        <Select.Item {value} {label}>
                            {label}
                        </Select.Item>
                    {/each}
                </Select.Group>
            </Select.Content>
        </Select.Root>
    {/snippet}
</Option>

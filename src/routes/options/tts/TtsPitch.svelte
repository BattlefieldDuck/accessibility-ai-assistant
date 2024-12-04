<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import { onMount } from "svelte";
    import Option from "../components/Option.svelte";

    interface Props {
        tts: TtsOptions;
    }

    let { tts = $bindable() }: Props = $props();

    const pitches = [
        { value: "0", label: "0" },
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
    let pitch = $derived(
        pitches.find((r) => r.value === value)?.label ?? "Normal",
    );

    onMount(() => {
        value = tts.pitch.toString();
    });

    $effect(() => {
        tts.pitch = Number(value);
    });
</script>

<Option>
    {#snippet header()}
        Pitch
    {/snippet}
    {#snippet details()}
        Speaking pitch between 0 and 2 inclusive, with 0 being lowest and 2
        being highest.
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
                    {pitch}
                </div>
            </Select.Trigger>
            <Select.Content>
                <Select.Group>
                    {#each pitches as { value, label }}
                        <Select.Item {value} {label}>
                            {label}
                        </Select.Item>
                    {/each}
                </Select.Group>
            </Select.Content>
        </Select.Root>
    {/snippet}
</Option>

<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import Option from "../components/Option.svelte";

    interface Languages {
        value: Intl.UnicodeBCP47LocaleIdentifier;
        label: string;
    }

    // During the origin trial, we're limiting the potential translatable language pairs to protect user privacy.
    // https://developer.chrome.com/docs/ai/translator-api
    let languages: Languages[] = [
        { value: "en", label: "English" },
        { value: "zh", label: "Mandarin Chinese (simplified)" },
        { value: "zh-Hant", label: "Taiwanese Mandarin (traditional)" },
        { value: "ja", label: "Japanese" },
        { value: "pt", label: "Portuguese" },
        { value: "ru", label: "Russian" },
        { value: "es", label: "Spanish" },
        { value: "tr", label: "Turkish" },
        { value: "hi", label: "Hindi" },
        { value: "vi", label: "Vietnamese" },
        { value: "bn", label: "Bengali" },
    ];

    let label = $derived(languages.find(lang => lang.value === translator.targetLanguage)?.label);

    interface Props {
        translator: TranslatorOptions;
    }

    let { translator = $bindable() }: Props = $props();
</script>

<Option>
    {#snippet header()}
        Primary Language
    {/snippet}
    {#snippet details()}
        Selected language: {label}
    {/snippet}
    {#snippet action()}
        <Select.Root
            type="single"
            name="targetLanguage"
            bind:value={translator.targetLanguage}
            required
            allowDeselect={false}
        >
            <Select.Trigger class="max-w-[360px]">
                <div class="truncate">
                    {label}
                </div>
            </Select.Trigger>
            <Select.Content>
                <Select.Group>
                    {#each languages as { value, label }}
                        <Select.Item {value} {label}>
                            {label}
                        </Select.Item>
                    {/each}
                </Select.Group>
            </Select.Content>
        </Select.Root>
    {/snippet}
</Option>

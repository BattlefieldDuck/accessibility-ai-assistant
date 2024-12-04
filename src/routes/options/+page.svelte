<script lang="ts">
    import { onMount } from "svelte";
    import { Separator } from "$lib/components/ui/separator/index.js";

    import OptionGroup from "./components/OptionGroup.svelte";
    import Accessibility from "./accessibility";
    import Tts from "./tts";
    import Summarizer from "./summarizer";
    import Translator from "./translator";

    let mounted = $state(false);
    let voices: chrome.tts.TtsVoice[] = $state([]);

    let options: Options = $state({
        accessibility: {
            screenReaderEnabled: true,
            autoTranslateEnabled: false,
        },
        tts: {
            voiceName: "",
            rate: 1.0,
            pitch: 1.0,
            volume: 1.0,
        },
        translator: { targetLanguage: "en" },
        summarizer: { type: "tl;dr", format: "plain-text", length: "short" },
    });

    onMount(async () => {
        const data = await chrome.storage.local.get(Object.keys(options));
        options = { ...options, ...data };

        voices = await chrome.tts.getVoices();

        if (
            !voices.find((voice) => voice.voiceName === options.tts.voiceName)
        ) {
            options.tts.voiceName = voices[0].voiceName ?? "";
        }

        chrome.storage.onChanged.addListener((changes, namespace) => {
            if (namespace === "local") {
                for (let [key, { newValue }] of Object.entries(changes)) {
                    options[key] = newValue;
                }
            }
        });

        mounted = true;
    });

    $effect(() => {
        if (mounted) {
            chrome.storage.local.set(options);
        }
    });
</script>

{#if mounted}
    <OptionGroup>
        {#snippet title()}
            Accessibility
        {/snippet}
        {#snippet items()}
            <Accessibility.ScreenReader
                bind:accessibility={options.accessibility}
            />
            <Separator class="my-4" />
            <Accessibility.AutoTranslate
                bind:accessibility={options.accessibility}
            />
        {/snippet}
    </OptionGroup>

    <OptionGroup>
        {#snippet title()}
            Translator
        {/snippet}
        {#snippet items()}
            <Translator.TargetLanguage bind:translator={options.translator} />
        {/snippet}
    </OptionGroup>

    <OptionGroup>
        {#snippet title()}
            Text-to-Speech
        {/snippet}
        {#snippet items()}
            <Tts.Voices {voices} bind:tts={options.tts} />
            <Separator class="my-4" />
            <Tts.Rate bind:tts={options.tts} />
            <Separator class="my-4" />
            <Tts.Pitch bind:tts={options.tts} />
        {/snippet}
    </OptionGroup>

    <OptionGroup>
        {#snippet title()}
            Summarizer
        {/snippet}
        {#snippet items()}
            <Summarizer.Type bind:summarizer={options.summarizer} />
            <Separator class="my-4" />
            <Summarizer.Format bind:summarizer={options.summarizer} />
            <Separator class="my-4" />
            <Summarizer.Length bind:summarizer={options.summarizer} />
        {/snippet}
    </OptionGroup>
{/if}

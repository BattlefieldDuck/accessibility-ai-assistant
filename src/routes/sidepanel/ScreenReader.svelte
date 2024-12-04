<script lang="ts">
    import { onMount, untrack } from "svelte";
    import { buttonVariants } from "$lib/components/ui/button/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import { Textarea } from "$lib/components/ui/textarea/index.js";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { Toggle } from "$lib/components/ui/toggle/index.js";
    import * as Icons from "./components/icons.js";
    import { translate } from "$lib/ai/translator.js";
    import { detect } from "$lib/ai/languageDetector.js";

    let mounted = $state(false);
    let accessibility: AccessibilityOptions = $state({
        screenReaderEnabled: true,
        autoTranslateEnabled: true,
    });

    let selectedText = $state("");
    let translatedText = $state("");

    const getPlaceholderText = () => {
        const { autoTranslateEnabled, screenReaderEnabled } = accessibility;

        if (autoTranslateEnabled && screenReaderEnabled) {
            return "Select text to translate and read aloud...";
        } else if (screenReaderEnabled) {
            return "Select text to read aloud...";
        } else if (autoTranslateEnabled) {
            return "Select text to translate...";
        } else {
            return "Screen Reader and Auto Translate are disabled...";
        }
    };

    onMount(async () => {
        // Retrieve accessibility options from Chrome local storage
        const options = await chrome.storage.local.get(["accessibility"]);
        accessibility = options.accessibility;

        // Add listener for changes in Chrome local storage
        chrome.storage.onChanged.addListener((changes, namespace) => {
            if (namespace === "local") {
                for (let [key, { newValue }] of Object.entries(changes)) {
                    if (key === "accessibility") {
                        accessibility = newValue;
                    }
                }
            }
        });

        // Add listener for messages from other parts of the extension
        chrome.runtime.onMessage.addListener((request) => {
            if (request.text) {
                selectedText = request.text;
            }
        });

        mounted = true;
    });

    // Effect to save accessibility settings to Chrome local storage
    $effect(() => {
        if (mounted) {
            chrome.storage.local.set({ accessibility });
        }
    });

    // Effect to handle changes in selected text
    $effect(() => {
        if (mounted) {
            selectedText;
            untrack(onSelectedTextChanged);
        }
    });

    // Effect to stop TTS if screen reader is disabled
    $effect(() => {
        if (mounted && !accessibility.screenReaderEnabled) {
            chrome.tts.stop();
        }
    });

    // Effect to stop TTS and clear translated text if auto-translate is disabled
    $effect(() => {
        if (mounted && !accessibility.autoTranslateEnabled) {
            chrome.tts.stop();
            translatedText = "";
        }
    });

    // Function to handle changes in selected text
    async function onSelectedTextChanged() {
        let utterance = selectedText;

        // Translate text if auto-translate is enabled
        if (accessibility.autoTranslateEnabled) {
            const options = await chrome.storage.local.get(["translator"]);
            const translator: TranslatorOptions = options.translator;
            const detectedLanguage = await detect(utterance);

            if (detectedLanguage === translator.targetLanguage) {
                translatedText = utterance;
            } else {
                try {
                    translatedText = await translate(utterance, {
                        sourceLanguage: detectedLanguage,
                        targetLanguage: translator.targetLanguage,
                    });
                } catch (e) {
                    // Uncaught (in promise) NotSupportedError: Unable to create translator for the given source and target language.
                    console.error(e);
                    console.error({
                        sourceLanguage: detectedLanguage,
                        targetLanguage: translator.targetLanguage,
                    });

                    translatedText = `Error: ${(e as Error).message}`;
                }
            }

            utterance = translatedText;
        }

        // Speak text using TTS if screen reader is enabled
        if (accessibility.screenReaderEnabled) {
            const options = await chrome.storage.local.get(["tts"]);
            const tts: TtsOptions = options.tts;

            chrome.tts.stop();
            chrome.tts.speak(utterance, {
                voiceName: tts.voiceName,
                rate: tts.rate,
                pitch: tts.pitch,
                volume: 1.0,
            });
        }
    }
</script>

{#if mounted}
    <div class="flex h-full flex-1 flex-col overflow-hidden">
        <Tooltip.Provider>
            <div class="mb-1 flex items-center px-4 py-3">
                <div class="flex items-center gap-2">
                    <Toggle
                        aria-label="Toggle Screen Reader"
                        bind:pressed={accessibility.screenReaderEnabled}
                    >
                        <Icons.Speech class="size-4" />
                        Screen Reader
                    </Toggle>

                    <Toggle
                        aria-label="Toggle Auto Translate"
                        bind:pressed={accessibility.autoTranslateEnabled}
                    >
                        <Icons.Languages class="size-4" />
                        Auto Translate
                    </Toggle>
                </div>
                <div class="ml-auto flex items-center gap-2"></div>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger
                        id="options_dropdown"
                        class={buttonVariants({
                            variant: "outline",
                            size: "icon",
                        })}
                    >
                        <Icons.EllipsisVertical class="size-4" />
                        <span class="sr-only">More</span>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content align="end">
                        <DropdownMenu.Item
                            onclick={() => chrome.runtime.openOptionsPage()}
                        >
                            Options
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </div>
        </Tooltip.Provider>

        <Separator />

        <div class="h-full grid grid-cols-1 gap-4 p-4">
            {#if accessibility.screenReaderEnabled || accessibility.autoTranslateEnabled}
                <Textarea
                    placeholder={getPlaceholderText()}
                    class="resize-none h-full"
                    bind:value={selectedText}
                    readonly
                />
            {/if}
            {#if accessibility.autoTranslateEnabled}
                <Textarea
                    class="resize-none h-full"
                    bind:value={translatedText}
                    readonly
                />
            {/if}
        </div>
    </div>
{/if}

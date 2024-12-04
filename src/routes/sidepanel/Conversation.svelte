<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import { Skeleton } from "$lib/components/ui/skeleton/index.js";
    import * as Icons from "./components/icons.js";

    import { summarize } from "$lib/ai/summarizer";
    import { createLanguageModelSession } from "$lib/ai/languageModel.js";
    import CopyButton from "$lib/copy-button.svelte";
    import ReadButton from "$lib/read-button.svelte";

    let value = $state("");
    let prompts: AILanguageModelPrompt[] = $state([]);

    function setPromptResponse(content: string) {
        const lastPrompt = prompts.at(-1);
        if (lastPrompt) {
            lastPrompt.content = content;
        }

        scrollToBottom();
    }

    type Action = "summarize" | "prompting";
    let action: Action | undefined = $state();
    let disabled = $derived(action !== undefined);
    let status = $derived(action ? "Thinking..." : "Online");

    let scrollableElement: HTMLDivElement;

    function scrollToBottom() {
        setTimeout(
            () =>
                scrollableElement.scrollTo({
                    top: scrollableElement.scrollHeight,
                    behavior: "smooth",
                }),
            300,
        );
    }

    async function getHTMLInnerText() {
        const queryInfo = { active: true, currentWindow: true };
        const tabs = await chrome.tabs.query(queryInfo);
        const tabId = tabs[0]?.id;

        if (!tabId) {
            throw new Error();
        }

        let result: string | undefined;

        [{ result }] = await chrome.scripting.executeScript({
            target: { tabId },
            func: () => document.documentElement.innerText,
        });

        if (!result) {
            throw new Error();
        }

        return result;
    }

    async function onButtonSummarizeClick() {
        action = "summarize";

        prompts.push(
            {
                role: "user",
                content: "/summarize",
            },
            {
                role: "assistant",
                content: "",
            },
        );
        scrollToBottom();

        let result: string;

        try {
            result = await getHTMLInnerText();
        } catch (e) {
            setPromptResponse("Error: " + (e as Error).message);
            action = undefined;
            return;
        }

        const options = await chrome.storage.local.get(["summarizer"]);
        let summary = await summarize(
            result.slice(0, 1024),
            options.summarizer,
        );

        setPromptResponse(summary);
        action = undefined;
    }

    async function onSendClick() {
        action = "prompting";

        prompts.push(
            {
                role: "user",
                content: value,
            },
            {
                role: "assistant",
                content: "",
            },
        );
        scrollToBottom();

        let result: string;

        try {
            result = await getHTMLInnerText();
        } catch (e) {
            setPromptResponse("Error: " + (e as Error).message);
            action = undefined;
            return;
        }

        const session = await createLanguageModelSession({
            systemPrompt: `You are an AI Assistant. Your primary task is to assist the user based on the content of the webpage provided.
    1. If the user's question is completely unrelated to the webpage content, respond with: "I'm sorry, but I couldn't find the information you're looking for on this webpage."
    2. If the user's question is related to the webpage content, provide an appropriate answer based on the available information.
    Here is the content of the webpage: ${result}`,
            temperature: 0.7,
            topK: 2,
        });

        const response = await session.prompt(value);

        setPromptResponse(response);
        action = undefined;
        value = "";
    }
</script>

<div class="flex h-full flex-1 flex-col overflow-hidden">
    <div class="flex items-start p-4">
        <div class="flex items-start gap-4 text-sm">
            <Avatar.Root>
                <Avatar.Image
                    src="./favicon.png"
                    alt="Accessibility AI Assistant"
                />
                <Avatar.Fallback>AI</Avatar.Fallback>
            </Avatar.Root>
            <div class="grid gap-1">
                <div class="font-semibold">AI Assistant</div>
                <div class="line-clamp-1 text-xs">{status}</div>
            </div>
        </div>

        <div class="flex items-center gap-2 ml-auto">
            <Button onclick={() => onButtonSummarizeClick()} {disabled}>
                {#if action === "summarize"}
                    <Icons.LoaderCircle class="animate-spin" />
                {:else}
                    <Icons.Sparkles />
                {/if}
                Summarize
            </Button>
        </div>
    </div>

    <div
        bind:this={scrollableElement}
        class="flex-1 overflow-y-auto text-sm px-4"
    >
        {#each prompts as prompt}
            <div class="mt-4 mb-6 space-y-2">
                <div class="flex items-start gap-2 text-sm">
                    <Avatar.Root class="h-5 w-5">
                        <Avatar.Image
                            src={prompt.role === "user"
                                ? "./circle-user.svg"
                                : "./favicon.png"}
                            alt={prompt.role}
                        />
                        <Avatar.Fallback>{prompt.role}</Avatar.Fallback>
                    </Avatar.Root>
                    <div class="grid gap-1">
                        {#if prompt.role === "user"}
                            <div class="font-semibold">You</div>
                        {:else}
                            <div class="font-semibold">Assistant</div>
                        {/if}
                    </div>
                </div>

                <div>
                    {#if prompt.content === ""}
                        <div class="space-y-2">
                            <Skeleton class="h-4 w-full" />
                            <Skeleton class="h-4 w-full" />
                            <Skeleton class="h-4 w-1/2" />
                        </div>
                    {:else if prompt.role === "user" && prompt.content === "/summarize"}
                        <div class="flex items-center gap-2 text-sm">
                            <Icons.Sparkles class="h-3 w-3" /> Summarize
                        </div>
                    {:else}
                        {prompt.content}
                    {/if}
                </div>

                {#if prompt.role === "assistant" && prompt.content !== ""}
                    <div class="flex items-center gap-1">
                        <CopyButton data={prompt.content} />
                        <ReadButton utterance={prompt.content} />
                    </div>
                {/if}
            </div>
        {/each}
    </div>

    <Separator class="mt-auto" />

    <div class="p-4">
        <form class="flex w-full items-center space-x-2">
            <Input
                bind:value
                placeholder="Type your question about this page here..."
                {disabled}
            />
            <Button
                class="px-3"
                type="submit"
                size="icon"
                {disabled}
                onclick={() => onSendClick()}
            >
                <Icons.Send />
            </Button>
        </form>
    </div>
</div>

<style>
    .overflow-y-auto {
        scrollbar-width: thin;
    }
</style>
